import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5555;

// Middleware
app.use(cors());
app.use(express.json());

// Check for properly configured API key
if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in the environment variables.");
}

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key");

/**
 * POST /api/chat
 * Accepts { message: string }
 * Returns { response: string }
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call Gemini model as configured in environment
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.0-flash' });
    const result = await model.generateContent(message);

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
  console.log(`Ready to serve /api/chat endpoints using Gemini Flash 3`);
});
// Force restart to load updated .env
// Force restart to load updated .env 3
