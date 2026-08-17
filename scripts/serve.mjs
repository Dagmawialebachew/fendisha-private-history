import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dev = process.argv.includes('--dev');
const serveDir = dev ? root : path.join(root, 'dist');
const port = Number(process.env.PORT || 4173);

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.json': 'application/json; charset=utf-8'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'content-type': type, 'cache-control': dev ? 'no-store' : 'public, max-age=3600' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  if (pathname === '/') pathname = '/index.html';
  const base = dev && ['/app.js','/config.js','/content.js'].includes(pathname) ? path.join(root, 'src') : serveDir;
  const clean = pathname.replace(/^\/+/, '');
  const file = path.resolve(base, clean);
  if (!file.startsWith(path.resolve(base))) return send(res, 403, 'Forbidden');
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) {
      const fallback = path.join(serveDir, 'index.html');
      if (fs.existsSync(fallback)) return fs.createReadStream(fallback).pipe(res);
      return send(res, 404, 'Run npm run build first.');
    }
    res.writeHead(200, { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': dev ? 'no-store' : 'public, max-age=3600' });
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(port, () => console.log(`Fendisha birthday site: http://localhost:${port}${dev ? ' (dev)' : ''}`));
