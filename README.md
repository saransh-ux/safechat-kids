# SafeChat Kids

SafeChat Kids is a full-stack, AI-powered web chatbot application designed to provide a safe, educational, and engaging environment for children and teenagers under 18. It promotes creativity, enforces healthy digital habits, and gives parents clear visibility into their child's learning journey.

## 🌟 Features

*   **Age-Adaptive Responses:** The app asks for the user's age at launch and scales the complexity of the chat responses accordingly (simple for 6-10, moderate for 11-14, detailed for 15-17).
*   **Creativity Protection System:** Instead of providing instant answers to queries like "Write a story about a lion," the system offers hints and assigns small creative exercises (e.g., "Write the first 2 lines yourself").
*   **Healthy Usage Reminders:** An automatic 30-minute timer tracks continuous usage and displays a friendly full-screen reminder prompting the child to take a break.
*   **Positive Reinforcement & Rewards:** Upon completing an exercise or reaching learning goals, children earn visual rewards (Stars) in the chat window.
*   **Parental Dashboard:** A dedicated dashboard view allowing parents to easily monitor session duration time limits, number of messages sent, exercises completed, and rewards earned.

## 🛠️ Technology Stack

**Frontend:**
*   React.js
*   Vite (configured to auto-open in the browser)
*   Tailwind CSS (for responsive, modern, child-friendly styling)
*   Lucide React (for iconography)

**Backend:**
*   Node.js with Express.js
*   SQLite3 (lightweight, local file-based database)

## 📦 Project Structure

```text
SafeChat For Kids/
├── backend/                  # Express API Server & Database
│   ├── database.js           # SQLite initialization and schema
│   ├── server.js             # API routes (session, chat, rewards, dashboard)
│   └── package.json          # Backend dependencies
└── frontend/                 # React + Vite Application
    ├── public/               
    ├── src/
    │   ├── App.jsx           # Main React component containing Chat, Prompts, Dashboard
    │   ├── index.css         # Base Tailwind styles
    │   └── main.jsx          # React DOM entry point
    ├── tailwind.config.js    # Tailwind configuration
    ├── vite.config.js        # Vite config (server.open = true)
    └── package.json          # Frontend dependencies
```

## 🚀 Getting Started

To run the application locally, you will need to start both the backend server and the frontend development server.

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.

### Step 1: Start the Backend Server

1.  Open a terminal.
2.  Navigate to the `backend` directory:
    ```bash
    cd "c:\Users\HP\Desktop\SafeChat For Kids\backend"
    ```
3.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *The console should print "Database initialized" and indicate the server is running on port 5000.*

### Step 2: Start the Frontend Application

1.  Open a **new** terminal window.
2.  Navigate to the `frontend` directory:
    ```bash
    cd "c:\Users\HP\Desktop\SafeChat For Kids\frontend"
    ```
3.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
4.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
    *Vite will compile the code and automatically open the SafeChat Kids application in your default web browser.*
