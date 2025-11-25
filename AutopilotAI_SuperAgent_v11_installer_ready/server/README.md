Autopilot-AI Backend (Full)
===========================

1. Copy .env.example to .env and add your GEMINI_API_KEY (do NOT commit the .env file).
   Example:
     cp .env.example .env
     # edit .env and add GEMINI_API_KEY=...

2. Install dependencies:
     npm install

3. Start server:
     npm start

4. Endpoints:
     POST /api/agent  -> accepts { query, dom, img, selection } and returns { raw, action }
     WebSocket on port -> send { type: 'CHAT', query, dom, img } to receive streaming chunks.

Notes:
  - The agent implementation supports both Google Generative Language endpoints and
    OpenAI-style chat completions. Set GEMINI_ENDPOINT and GEMINI_MODEL accordingly.
  - For production, run behind HTTPS and add authentication between extension and server.
