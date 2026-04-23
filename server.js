const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const server = http.createServer((req, res) => {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = "";
  req.on("data", chunk => { body += chunk; });
  req.on("end", () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "API key not configured" }));
      return;
    }

    const payload = Buffer.from(body);
    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": payload.length,
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      }
    };

    const proxyReq = https.request(options, proxyRes => {
      let data = "";
      proxyRes.on("data", chunk => { data += chunk; });
      proxyRes.on("end", () => {
        res.writeHead(proxyRes.statusCode, { "Content-Type": "application/json" });
        res.end(data);
      });
    });

    proxyReq.on("error", err => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Proxy error: " + err.message }));
    });

    proxyReq.write(payload);
    proxyReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`T&R Irrigation AI Proxy running on port ${PORT}`);
});
