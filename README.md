# Lovable ChatGPT Clone with Gemini 3.0 Flash

A fullstack lovable chat application powered by Google Gemini Flash 3 and built for Antigravity Deployment.

## Features
- **Frontend**: Playful, lovable React UI with typing animations and auto-scroll.
- **Backend**: Node.js API with fast responses via the live Google Gemini Flash 3 model (`@google/genai`).
- **Antigravity Ready**: Pre-configured `antigravity.json` for smooth dual-service orchestration.

## Getting Started

### 1. Environment Setup
You need to set up your environment variables for the backend. Find the `.env.example` in the backend folder and copy it:
```bash
cp backend/.env.example backend/.env
```
Inside `backend/.env`, set your Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Run Locally
To run the project locally, open two terminals.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd aura-chat-main
npm install
npm run dev
```
Navigate to the frontend port (usually `localhost:5173` or `3000`) and the app will connect to the API seamlessly.

### 3. Deploy with Antigravity
This project includes an `antigravity.json` config which orchestrates both the frontend and backend microservices. To deploy:
1. Ensure the Antigravity CLI is installed.
2. In the `deploy/antigravity.json`, ensure your port configuration matches your server environment.
3. Run the Antigravity deploy command in the root folder. Antigravity will detect both the `static` frontend bundle and your `node` backend.
