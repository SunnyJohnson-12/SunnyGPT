# 🚀 Vercel Deployment Guide: Sunny's GPT

This step-by-step guide covers how to deploy your fullstack application—both the Node.js Express backend and the Vite React frontend—to Vercel.

Because your project is split into two directories (`backend` and `aura-chat-main`), the easiest path is to deploy them as **two separate Vercel projects**.

---

## Part 1: Deploying the Backend
Vercel is primarily built for frontend frameworks, but it natively supports deploying standard Express.js apps as serverless functions with a small configuration file.

### 1. Preparation
1. Inside your `backend` folder, create a new file named `vercel.json` and paste this exactly:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```
2. Make sure your code is pushed to a fresh GitHub repository (you can push the entire `Sunny` folder).

### 2. Deploying to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2. Select your GitHub repository.
3. In the "Configure Project" step, look for the **Root Directory** setting. Change it by selecting the `backend` folder.
4. Under "Environment Variables", copy all variables from your `backend/.env` file:
   - Key: `GEMINI_API_KEY` | Value: `your_key_here`
   - Key: `GEMINI_MODEL` | Value: `gemini-3-flash-preview`
   *(You don't need to add `PORT`)*
5. Click **Deploy**.
6. When it finishes, Vercel will give you a live domain (e.g., `sunnys-backend.vercel.app`). **Copy this URL** for the next step.

---

## Part 2: Deploying the Frontend (Sunny's GPT)

Your frontend was built using Vite and currently looks for the backend at `http://localhost:5555`. I've updated the code so it automatically uses whatever environment variable you provide for the actual production URL!

### 1. Preparation
1. Ensure your frontend changes are pushed to GitHub.
2. Ensure you have added your real `Google Client ID` inside your `App.tsx` (or extracted it to an `.env` file first).

### 2. Deploying to Vercel
1. Head back to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2. Select the same GitHub repository again.
3. In the "Root Directory" setting, change it to the `aura-chat-main` folder.
4. Vercel will automatically detect that you're using Vite and will set the Build Command to `npm run build` by default.
5. Under **Environment Variables**, add the URL pointing to your newly created Backend:
   - Key: `VITE_API_URL`
   - Value: `https://sunnys-backend.vercel.app` *(Must match your actual backend Vercel URL exactly, without a trailing slash!)*
6. Click **Deploy**.

---

## Part 3: Final Security Steps

Once both are deployed, you need to update a few security checks:

1. **Update Google OAuth**
   - Go to your Google Cloud Console.
   - Edit your OAuth 2.0 Web Client ID.
   - Add your **new Frontend Vercel Domain** (e.g., `https://sunnys-gpt.vercel.app`) to your "Authorized JavaScript Origins".

2. **Test the Connection**
   - Visit your frontend live URL.
   - Log in using Google.
   - Ask the Chatbot a question and verify the backend responds successfully!

### Troubleshooting
If the frontend says it can't connect:
- Ensure the `VITE_API_URL` you passed to your Vercel frontend is perfectly identical to the real backend URL (including `https://`).
- Check your Vercel Logs on the backend project for any API Key errors.
