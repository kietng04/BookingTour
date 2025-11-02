const http = require('http');

const TARGET_HOST = 'http://localhost:3000';
const PORT = 5173;

const server = http.createServer((req, res) => {
  const location = `${TARGET_HOST}${req.url || ''}`;
  console.log(`[redirect-5173] ${req.method} ${req.url} -> ${location}`);
  res.statusCode = 302;
  res.setHeader('Location', location);
  res.end();
});

server.listen(PORT, () => {
  console.log(`[redirect-5173] listening on http://localhost:${PORT}, redirecting to ${TARGET_HOST}`);
});
