# PixelForge AI — Image Generator

## Zaroori baat
Yeh ek ready-to-run website project hai. Image generation ke liye OpenAI API key aur API billing/credits chahiye. ChatGPT subscription aur API billing alag hote hain.

## Run kaise karein
1. Node.js 18 ya newer install karein.
2. Is folder mein terminal kholein.
3. `.env.example` ko `.env` naam se copy karein (ya environment variable set karein).
4. `.env` mein apni secret key set karein: `OPENAI_API_KEY=...`
5. Run:
   - macOS/Linux: `export OPENAI_API_KEY="your_key"` then `npm start`
   - Windows PowerShell: `$env:OPENAI_API_KEY="your_key"` then `npm start`
6. Browser mein `http://localhost:3000` kholein.

API key ko kabhi `index.html` ya `app.js` mein mat daalein. Server us key ko private rakhta hai.
Public internet par launch karne se pehle authentication, rate limiting, usage limits aur hosting configure karein.

Image API docs: https://developers.openai.com/api/docs/guides/image-generation
