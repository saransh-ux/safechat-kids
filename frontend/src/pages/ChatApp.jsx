import { useState, useEffect, useRef } from 'react';
import { Send, Shield, Star, Activity, Mic, MicOff, Volume2, ArrowLeft, Trophy, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AgeSelection from '../components/AgeSelection';

const API_URL = 'http://localhost:5000/api';

export default function ChatApp({ session, setSession }) {
    const navigate = useNavigate();

    if (!session) {
        return (
            <AgeSelection
                onSelectAge={async (age, label) => {
                    try {
                        const res = await fetch(`${API_URL}/session`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ age: parseInt(age) })
                        });
                        const data = await res.json();
                        setSession({ ...data, ageLabel: label });
                    } catch (err) {
                        console.error(err);
                        alert('Failed to connect to server. Is the backend running?');
                    }
                }}
            />
        );
    }

    return <ChatWindow session={session} onBack={() => navigate('/')} />;
}

// Simple markdown bold/newline formatter
function formatMessage(text) {
    if (!text) return '';
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\n/g, '<br/>');
    return html;
}

function ChatWindow({ session, onBack }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: session.message }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [stars, setStars] = useState(0);
    const [messagesCount, setMessagesCount] = useState(0); // Gamification tracker
    const [badges, setBadges] = useState([]); // Gamification rewards
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Setup Gamification Badges
    useEffect(() => {
        if (messagesCount === 5 && !badges.includes("Curious Explorer")) {
            setBadges(prev => [...prev, "Curious Explorer"]);
            // Also add a system message congratulating them
            setMessages(prev => [...prev, { role: 'system', content: '🎉 You earned the "Curious Explorer" badge for asking 5 questions!' }]);
        }
    }, [messagesCount, badges]);

    // Fetch initial rewards
    useEffect(() => {
        fetch(`${API_URL}/dashboard?sessionId=${session.sessionId}`)
            .then(r => r.json())
            .then(d => {
                if (d.rewards) setStars(d.rewards.stars || 0);
                if (d.conversationsCount) setMessagesCount(d.conversationsCount);
            })
            .catch(console.error);
    }, [session.sessionId]);

    // Setup Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => (prev ? prev + " " + transcript : transcript));
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListen = () => {
        if (!recognitionRef.current) return alert("Your browser doesn't support Voice Mode.");
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/\*\*/g, '').replace(/#/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 0.95;
            utterance.pitch = 1.1; // slightly higher pitch for friendly voice

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: session.sessionId, age: session.age, message: userMsg })
            });
            const data = await res.json();
            
            // If the message was flagged by the backend, update the optimistic user message
            if (data.isFlagged) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastUserIndex = newMessages.length - 1; // Since optimistic UI makes it the last one before API response
                    if (lastUserIndex >= 0 && newMessages[lastUserIndex].role === 'user') {
                        newMessages[lastUserIndex] = { ...newMessages[lastUserIndex], isFlagged: true };
                    }
                    return newMessages;
                });
            } else {
                // Increment counter only for safe, valid questions
                setMessagesCount(prev => prev + 1);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply, isExercise: data.isExercise }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Oops! My brain got disconnected. Let's try again." }]);
        }
        setLoading(false);
    };

    const handleCompleteExercise = async () => {
        try {
            const res = await fetch(`${API_URL}/rewards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: session.sessionId })
            });
            const data = await res.json();
            setStars(data.rewards.stars);
            setMessages(prev => [...prev, { role: 'assistant', content: "🎉 Excellent work! You earned 10 stars and finished the exercise. Would you like to keep working on this or learn something new?" }]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 relative font-sans">
            {/* Header */}
            <header className="bg-white border-b-2 border-indigo-50 px-3 md:px-6 py-3 md:py-4 flex flex-wrap justify-between items-center gap-3 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                    <button onClick={onBack} className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 md:p-2 bg-slate-50 rounded-full hover:bg-indigo-50">
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="bg-indigo-500 p-1.5 md:p-2 rounded-full text-white shadow-md">
                            <Shield className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">SafeChat Kids</h1>
                            <p className="text-[10px] md:text-sm font-medium text-emerald-500 bg-emerald-50 px-2 rounded-full inline-block">Safe Mode: On</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 justify-end w-full md:w-auto">
                    {badges.map(badge => (
                        <div key={badge} className="bg-rose-100 border border-rose-200 px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 md:gap-2 font-bold text-rose-700 animate-pop text-xs md:text-sm">
                            <Trophy className="w-3 h-3 md:w-4 md:h-4 text-rose-500" />
                            <span className="hidden sm:inline">{badge}</span>
                        </div>
                    ))}
                    <div className="bg-yellow-100 border-2 border-yellow-300 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm flex items-center gap-1.5 md:gap-2 font-bold text-yellow-700 text-sm md:text-base">
                        <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-500" />
                        <span>{stars} Stars</span>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-6 flex flex-col relative bg-[url('/pattern.png')] bg-repeat bg-opacity-5">
                <AnimatePresence>
                    {messages.map((m, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            key={idx}
                            className={`flex max-w-[95%] md:max-w-[85%] ${m.role === 'user' ? 'self-end flex-row-reverse' : m.role === 'system' ? 'self-center my-4' : 'self-start'} gap-2 sm:gap-3`}
                        >
                            {m.role === 'system' ? (
                                <div className="bg-yellow-400 text-yellow-900 font-bold px-4 py-2 md:px-6 md:py-3 rounded-full flex items-center gap-2 shadow-md text-sm md:text-base">
                                    <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                                    {m.content}
                                </div>
                            ) : (
                                <>
                                    {m.role === 'assistant' && (
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md">
                                            <Shield className="w-4 h-4 md:w-7 md:h-7 text-white" />
                                        </div>
                                    )}

                                    <div className={`p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border text-[15px] md:text-lg leading-relaxed relative group ${m.role === 'user' ? (m.isFlagged ? 'bg-red-500 text-white rounded-tr-sm border-red-600 animate-pulse' : 'bg-blue-500 text-white rounded-tr-sm border-blue-600') : 'bg-white text-slate-800 rounded-tl-sm border-slate-200'}`}>
                                        
                                        {m.isFlagged && m.role === 'user' && (
                                            <div className="absolute -left-2 -top-2 md:-left-3 md:-top-3 bg-white rounded-full p-1 shadow-md z-10" title="Inappropriate word detected">
                                                <AlertCircle className="w-4 h-4 md:w-6 md:h-6 text-red-500" />
                                            </div>
                                        )}
                                        <style>{`
                      .message-content h1, .message-content h2, .message-content h3 { font-weight: bold; margin-bottom: 0.5rem; }
                      .message-content p { margin-bottom: 0.75rem; }
                      .message-content p:last-child { margin-bottom: 0; }
                      .message-content strong { font-weight: 800; }
                      .message-content ul, .message-content ol { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 0.75rem; }
                    `}</style>
                                        <div className="message-content whitespace-pre-wrap font-medium" dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}></div>

                                        {/* Speech Button for AI */}
                                        {m.role === 'assistant' && (
                                            <button
                                                onClick={() => isSpeaking ? stopSpeaking() : speak(m.content)}
                                                className="absolute -right-3 -bottom-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 p-2 rounded-full shadow-md transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
                                                title="Read out loud"
                                            >
                                                <Volume2 size={16} />
                                            </button>
                                        )}

                                        {m.isExercise && (
                                            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200 opacity-20 rounded-bl-full"></div>
                                                <div className="flex items-center gap-2 text-orange-600 font-bold mb-2">
                                                    <Activity size={18} />
                                                    <span>Creativity Challenge!</span>
                                                </div>
                                                <button
                                                    onClick={handleCompleteExercise}
                                                    className="w-full mt-3 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_4px_0_0_rgba(194,65,12,1)] active:translate-y-[4px] active:shadow-none text-sm"
                                                >
                                                    I completed the exercise!
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="self-start flex gap-3 max-w-[85%] items-end">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                            <Shield className="w-4 h-4 md:w-7 md:h-7 text-white" />
                        </div>
                        <div className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl rounded-tl-sm shadow-sm border border-slate-200 flex items-center gap-1.5 md:gap-2 h-12 md:h-[68px]">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-400 animate-bounce"></div>
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="bg-white px-3 md:px-8 py-3 md:py-4 border-t-2 border-indigo-50 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-1.5 md:gap-2 bg-slate-50 p-1.5 md:p-2 rounded-[2rem] border-2 border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                    <button
                        type="button"
                        onClick={toggleListen}
                        className={`p-2.5 md:p-4 rounded-full transition-colors flex-shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                        title="Voice Mode"
                    >
                        {isListening ? <Mic className="w-5 h-5 md:w-6 md:h-6" /> : <MicOff className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>

                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        placeholder={isListening ? "Listening... Speak now!" : "Ask me anything..."}
                        className="flex-1 bg-transparent p-2 md:p-4 text-base md:text-xl outline-none font-medium ml-1 resize-none max-h-32 min-h-[44px] md:min-h-[60px]"
                        rows={1}
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:shadow-none text-white p-2.5 md:p-4 rounded-full transition-all shadow-[0_4px_0_0_rgba(67,56,202,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_rgba(67,56,202,1)] active:translate-y-[4px] active:shadow-none flex items-center justify-center cursor-pointer flex-shrink-0"
                    >
                        <Send className={`w-5 h-5 md:w-6 md:h-6 ${input.trim() ? "translate-x-0.5 -translate-y-0.5" : ""}`} />
                    </button>
                </form>
                <div className="text-center mt-2 md:mt-3 text-slate-400 text-xs md:text-sm font-medium">
                    Powered by SafeChat AI. Always monitored by Parents.
                </div>
            </div>
        </div>
    );
}
