const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 5174);
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY || "";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function handleConcerts(request, response) {
  if (!TICKETMASTER_API_KEY) {
    sendJson(response, 500, {
      message: "Sunucuda TICKETMASTER_API_KEY tanimli degil.",
    });
    return;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const city = requestUrl.searchParams.get("city") || "";
  const keyword = requestUrl.searchParams.get("keyword") || "";

  if (!city.trim()) {
    sendJson(response, 400, { message: "Sehir bilgisi gerekli." });
    return;
  }

  const ticketmasterUrl = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  ticketmasterUrl.searchParams.set("apikey", TICKETMASTER_API_KEY);
  ticketmasterUrl.searchParams.set("city", city);
  ticketmasterUrl.searchParams.set("classificationName", "music");
  ticketmasterUrl.searchParams.set("sort", "date,asc");
  ticketmasterUrl.searchParams.set("size", "6");
  ticketmasterUrl.searchParams.set("locale", "*");

  if (keyword.trim()) {
    ticketmasterUrl.searchParams.set("keyword", keyword);
  }

  try {
    const ticketmasterResponse = await fetch(ticketmasterUrl);
    const data = await ticketmasterResponse.json();

    if (!ticketmasterResponse.ok) {
      sendJson(response, ticketmasterResponse.status, {
        message: data?.fault?.faultstring || "Ticketmaster API istegi basarisiz oldu.",
      });
      return;
    }

    sendJson(response, 200, data);
  } catch (error) {
    sendJson(response, 502, { message: "Ticketmaster servisine ulasilamadi." });
  }
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const safePath = path.normalize(decodeURIComponent(requestUrl.pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(__dirname, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(__dirname)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extension] || "application/octet-stream" });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  if (request.url.startsWith("/api/concerts")) {
    handleConcerts(request, response);
    return;
  }

  serveStatic(request, response);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
