const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

  // API proxy endpoint
  if (req.method === "POST" && req.url === "/api/chat") {
    const chunks = [];
    req.on("data", chunk => { chunks.push(chunk); });
    req.on("end", () => {
      const body = Buffer.concat(chunks);
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "API key not configured" }));
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
          const fullResponse = Buffer.concat(responseChunks).toString("utf8");
          console.log("Anthropic status:", proxyRes.statusCode);
          console.log("Response length:", fullResponse.length);
          res.writeHead(proxyRes.statusCode, {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(fullResponse, "utf8"),
          });
          res.end(fullResponse);
        });
      });
      proxyReq.on("error", err => {
        console.error("Proxy error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
      proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  // Serve index.html for all other requests
  const filePath = path.join(__dirname, "index.html");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`TriFlow Serve running on port ${PORT}`);
});
