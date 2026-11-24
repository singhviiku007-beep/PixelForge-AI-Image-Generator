const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MIME = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".png":"image/png", ".svg":"image/svg+xml" };

async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "POST" && url.pathname === "/api/generate") {
    if (!process.env.OPENAI_API_KEY) {
      res.writeHead(500, {"Content-Type":"application/json"});
      return res.end(JSON.stringify({error:"Server par OPENAI_API_KEY set nahi hai. README dekhein."}));
    }
    let body = "";
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 100000) {
        res.writeHead(413, {"Content-Type":"application/json"});
        return res.end(JSON.stringify({error:"Prompt bahut bada hai."}));
      }
    }
    try {
      const { prompt, size = "1024x1536", style = "3D Realistic" } = JSON.parse(body || "{}");
      if (!prompt || !prompt.trim()) throw new Error("Pehle image ka description likhein.");
      const finalPrompt = `${prompt.trim()}\nVisual style: ${style}. Create a polished, high-quality image.`;
      const api = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type":"application/json" },
        body: JSON.stringify({ model:"gpt-image-2.6-flare", prompt:finalPrompt, size, n:1, output_format:"png" })
      });
      const data = await api.json();
      if (!api.ok) throw new Error(data.error?.message || `Image API error (${api.status})`);
      const image = data.data?.[0]?.b64_json;
      if (!image) throw new Error("Image response nahi mila. Dobara try karein.");
      res.writeHead(200, {"Content-Type":"application/json"});
      return res.end(JSON.stringify({ image:`data:image/png;base64,${image}` }));
    } catch (e) {
      res.writeHead(400, {"Content-Type":"application/json"});
      return res.end(JSON.stringify({error:e.message || "Kuch galat ho gaya."}));
    }
  }

  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const file = path.join(ROOT, pathname.replace(/^\/+/, ""));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.readFile(file, (err, content) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, {"Content-Type": MIME[path.extname(file)] || "application/octet-stream"});
    res.end(content);
  });
}

http.createServer(handle).listen(PORT, () => console.log(`Image Generator: http://localhost:${PORT}`));
