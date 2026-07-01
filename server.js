const http = require("http");
const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadEnvFile();

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
      message: "Konserleri gostermek icin Ticketmaster API key ayarlanmali.",
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

    const events = data._embedded?.events || [];
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        if (event.priceRanges?.length) {
          return event;
        }

        const detailUrl = new URL(`https://app.ticketmaster.com/discovery/v2/events/${event.id}.json`);
        detailUrl.searchParams.set("apikey", TICKETMASTER_API_KEY);
        detailUrl.searchParams.set("locale", "*");

        try {
          const detailResponse = await fetch(detailUrl);

          if (!detailResponse.ok) {
            return event;
          }

          const detail = await detailResponse.json();
          return {
            ...event,
            priceRanges: detail.priceRanges || event.priceRanges,
            info: detail.info || event.info,
            pleaseNote: detail.pleaseNote || event.pleaseNote,
          };
        } catch (error) {
          return event;
        }
      }),
    );

    sendJson(response, 200, {
      ...data,
      _embedded: {
        ...data._embedded,
        events: enrichedEvents,
      },
    });
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
