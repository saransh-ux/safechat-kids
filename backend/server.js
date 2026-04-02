const express = require('express');
const cors = require('cors');
const { initDb, getDbConnection } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Chatbot Logic: Mock AI that filters responses and encourages creativity.
const CREATIVITY_TRIGGERS = ['write a story', 'write an essay', 'solve homework', 'give me the answer', 'do my homework'];
const Filter = require('bad-words');
const filter = new Filter();

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/api/session', async (req, res) => {
    const { age } = req.body;
    try {
        const db = await getDbConnection();
        // Create session
        const result = await db.run('INSERT INTO sessions (user_id, age) VALUES (?, ?)', ['user1', age]);
        const sessionId = result.lastID;

        // Init rewards
        await db.run('INSERT INTO rewards (session_id) VALUES (?)', [sessionId]);

        res.json({ sessionId, age, message: 'Welcome to SafeChat Kids! Let learning begin.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/chat', async (req, res) => {
    const { sessionId, age, message } = req.body;
    const lowerMessage = message.toLowerCase();

    try {
        const db = await getDbConnection();
        // Check for bad words
        const isFlagged = filter.isProfane(message) || lowerMessage.includes('badword') || lowerMessage.includes('fuck');

        // Save user message with flag
        await db.run('INSERT INTO messages (session_id, role, content, is_flagged) VALUES (?, ?, ?, ?)', [sessionId, 'user', message, isFlagged ? 1 : 0]);

        let responseText = "";

        // Feature 1: Creativity & Safety Protection System
        const triggersCreativity = CREATIVITY_TRIGGERS.some(trigger => lowerMessage.includes(trigger));

        if (isFlagged) {
            responseText = "Hi there! I am here to be a kind and helpful learning buddy. I don't use words like that, and I can only talk about things that are friendly and safe for us to learn together.\n\nI would love to tell you a cool fact about space or how a volcano works instead! What should we explore first?";
        } else if (triggersCreativity) {
            responseText = `I see you want to write something amazing about this! Instead of giving you the full answer, let's create it together.\n\nHere's a quick hint: Think about the main characters and where they are.\n\n**Small Exercise:** Can you write 2-3 lines describing what is happening first?`;

            // Log exercise
            await db.run('INSERT INTO exercises (session_id, topic) VALUES (?, ?)', [sessionId, 'Creative Writing']);
        } else {
            // Generate response using Gemini
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

                // Fetch chat history for context (last 10 messages)
                const historyRows = await db.all('SELECT role, content FROM messages WHERE session_id = ? ORDER BY id DESC LIMIT 10', [sessionId]);
                const historyStr = historyRows.reverse().map(row => `${row.role === 'user' ? 'User' : 'Assistant'}: ${row.content}`).join('\n');

                // Construct a system prompt to enforce age-appropriate language constraints
                const prompt = `You are SafeChat Kids, a friendly, educational, and universally safe AI chatbot designed specifically for children and teenagers. 
                The current user you are talking to is ${age} years old. 

                Guidelines for your response:
                1. If the user is 6-10 years old: Use very simple vocabulary, short sentences, an enthusiastic tone, and clear analogies. Do not use complex jargon.
                2. If the user is 11-14 years old: Use moderate vocabulary, clear structural explanations, and relatable examples.
                3. If the user is 15-17 years old: Provide more detailed, thorough educational breakdowns but remain engaging and structured.
                4. NEVER discuss inappropriate, violent, adult, or sensitive topics. If the user's question touches on these, politely decline to answer, stating that you are a learning companion for kids.
                5. Do NOT just say "Wow that's a cool question!" unless it fits. Actually answer their question accurately and concisely. Focus on being educational, engaging, and directly helpful.

                Here is the recent conversation history:
${historyStr}
                
                Generate the next response as the Assistant.`;

                let result = null;
                const maxRetries = 2; // Try up to 3 times total

                for (let attempt = 0; attempt <= maxRetries; attempt++) {
                    try {
                        result = await model.generateContent(prompt);
                        break; // Success, exit the loop
                    } catch (err) {
                        const isTransitory = err.message && (err.message.includes('503') || err.message.includes('429'));
                        if (isTransitory && attempt < maxRetries) {
                            console.warn(`Gemini API busy (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in 2 seconds...`);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        } else {
                            throw err; // Out of retries or not a 503/429, throw to outer catch
                        }
                    }
                }

                if (result) {
                    responseText = result.response.text();
                }
            } catch (aiError) {
                console.error("Gemini API Error:", aiError.message);

                // Determine the type of error to guide the user
                const isRateLimit = aiError.message && aiError.message.includes('429');
                const isServiceUnavailable = aiError.message && aiError.message.includes('503');
                const isMissingKey = !process.env.GOOGLE_API_KEY || (aiError.message && aiError.message.includes('API key not valid'));

                if (isRateLimit) {
                    responseText = "I'm receiving too many questions right now and my brain needs a tiny rest! (Google Gemini API Rate Limit Exceeded: 429 Too Many Requests. Try again in a minute!)";
                } else if (isServiceUnavailable) {
                    responseText = "I am currently taking a short nap because too many kids are talking to me at once! Please give me a minute or two to wake back up. (503 Service Unavailable)";
                } else if (isMissingKey) {
                    if (age >= 6 && age <= 10) {
                        responseText = `Wow, that's a cool question! Let me help you with "${message}" in a fun and simple way... (Oops, my AI brain is sleeping right now. Check your API key and make sure to restart your backend server!)`;
                    } else if (age >= 11 && age <= 14) {
                        responseText = `That's an interesting topic! Let's explore "${message}" with some cool examples... (Oops, my AI brain is sleeping right now. Check your API key and make sure to restart your backend server!)`;
                    } else {
                        responseText = `Great question. Here is a detailed educational breakdown of "${message}"... (Oops, my AI brain is sleeping right now. Check your API key and make sure to restart your backend server!)`;
                    }
                } else {
                    responseText = `Oops, something went wrong while thinking about "${message}". (Error: ${aiError.message || aiError.statusText || 'Unable to connect to AI'}).`;
                }
            }
        }

        // Save AI message
        await db.run('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)', [sessionId, 'assistant', responseText]);

        res.json({ reply: responseText, isExercise: triggersCreativity, isFlagged });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

app.post('/api/rewards', async (req, res) => {
    const { sessionId } = req.body;
    try {
        const db = await getDbConnection();
        // Give 10 stars for completing an exercise
        await db.run('UPDATE rewards SET stars = stars + 10 WHERE session_id = ?', [sessionId]);
        const rewards = await db.get('SELECT stars, badges FROM rewards WHERE session_id = ?', [sessionId]);
        res.json({ message: 'Great job! You earned 10 stars!', rewards });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/dashboard', async (req, res) => {
    const { sessionId } = req.query;
    try {
        const db = await getDbConnection();
        const session = await db.get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
        const rewards = await db.get('SELECT * FROM rewards WHERE session_id = ?', [sessionId]);
        const exercisesCount = await db.get('SELECT COUNT(*) as count FROM exercises WHERE session_id = ?', [sessionId]);
        const messagesCount = await db.get('SELECT COUNT(*) as count FROM messages WHERE session_id = ? AND role = "assistant"', [sessionId]);
        const chatHistory = await db.all('SELECT role, content, is_flagged, timestamp FROM messages WHERE session_id = ? ORDER BY id ASC', [sessionId]);
        const flagsCount = chatHistory.filter(m => m.is_flagged).length;

        // Create a strictly real-time timeline for the last 7 days
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const dynamicTimeline = [];
        const now = new Date();
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const isToday = i === 0;
            const startUTC = session ? new Date(session.start_time.replace(' ', 'T') + 'Z').getTime() : Date.now();
            const mins = isToday ? (session.total_duration || Math.max(0, Math.ceil((Date.now() - startUTC) / 60000))) : 0;
            dynamicTimeline.push({ name: days[d.getDay()], minutes: mins });
        }

        const topicBreakdown = [
            { subject: 'Chatting', count: messagesCount ? messagesCount.count : 0 },
            { subject: 'Exercises', count: exercisesCount ? exercisesCount.count : 0 }
        ];

        if (flagsCount > 0) {
            topicBreakdown.push({ subject: 'Flagged', count: flagsCount });
        }

        res.json({
            session,
            rewards,
            exercisesCompleted: exercisesCount ? exercisesCount.count : 0,
            conversationsCount: (messagesCount ? messagesCount.count : 0) * 2,
            flagsCount,
            sessionDuration: session.total_duration || Math.max(0, Math.ceil((Date.now() - (session ? new Date(session.start_time.replace(' ', 'T') + 'Z').getTime() : Date.now())) / 60000)),
            chatHistory,
            activityTimeline: dynamicTimeline,
            topicBreakdown
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Initialize DB and start server
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}).catch(console.error);

// Quick workaround for Node v24 dropping event loop with Express 5
setInterval(() => {}, 1000 * 60 * 60);
