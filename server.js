const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

  if (req.method === "POST" && req.url === "/api/chat") {
    const chunks = [];
    req.on("data", chunk => { chunks.push(chunk); });
    req.on("end", () => {
      const body = Buffer.concat(chunks);
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "API key not configured on server" }));
        return;
      }
      const options = {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": body.length,
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        }
      };
      const proxyReq = https.request(options, proxyRes => {
        const responseChunks = [];
        proxyRes.on("data", chunk => { responseChunks.push(chunk); });
        proxyRes.on("end", () => {
          const fullResponse = Buffer.concat(responseChunks);
          console.log("Anthropic status:", proxyRes.statusCode, "bytes:", fullResponse.length);
          res.writeHead(proxyRes.statusCode, {
            "Content-Type": "application/json",
            "Content-Length": fullResponse.length,
          });
          res.end(fullResponse);
        });
      });
      proxyReq.on("error", err => {
        console.error("Anthropic error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
      proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  const filePath = path.join(__dirname, "index.html");
  fs.readFile(filePath, "utf8", (err, html) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
});

server.listen(PORT, () => {
  console.log(`TriFlow Serve running on port ${PORT}`);
  console.log(`API key configured: ${process.env.ANTHROPIC_API_KEY ? "YES" : "NO"}`);
});
