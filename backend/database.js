const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function getDbConnection() {
    return open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });
}

async function initDb() {
    const db = await getDbConnection();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            age INTEGER NOT NULL,
            start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            end_time DATETIME,
            total_duration INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        );

        CREATE TABLE IF NOT EXISTS rewards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER,
            stars INTEGER DEFAULT 0,
            badges TEXT DEFAULT '[]',
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        );

        CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER,
            topic TEXT NOT NULL,
            is_completed BOOLEAN DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        );
    `);

    // Safely add the is_flagged column if it doesn't already exist from the initial table creation
    try {
        await db.exec(`ALTER TABLE messages ADD COLUMN is_flagged BOOLEAN DEFAULT 0;`);
        console.log("Added is_flagged column to messages table.");
    } catch (err) {
        // If the column already exists, SQLite throws an error which we can safely ignore
    }

    console.log("Database initialized");
    return db;
}

module.exports = { getDbConnection, initDb };
