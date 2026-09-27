const http = require("http");

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "meu_token";

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url.startsWith("/webhook")) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(challenge);
      return;
    }

    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (req.method === "POST" && req.url === "/webhook") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      console.log("Webhook recebido:", body);

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("EVENT_RECEIVED");
    });

    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Webhook online");
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
