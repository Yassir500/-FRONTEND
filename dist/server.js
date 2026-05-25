import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Reconstruir __dirname para entornos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DIST_PATH = __dirname; // Al estar dentro de dist, servimos el directorio actual

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // Limpiar la URL de parámetros de consulta (query strings)
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_PATH, urlPath === '/' ? 'index.html' : urlPath);

  // Seguridad: evitar que se acceda a archivos fuera de la carpeta dist
  if (!filePath.startsWith(DIST_PATH)) {
    res.writeHead(403);
    return res.end('403 Forbidden');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Fallback para SPA: si el archivo no existe (ej. una ruta de Vue Router),
        // servimos el index.html para que Vue maneje el routing en el cliente.
        fs.readFile(path.join(DIST_PATH, 'index.html'), (err, indexContent) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Error del servidor: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\x1b[32m✔ Servidor ejecutándose en: http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[34mℹ Sirviendo archivos desde: ${DIST_PATH}\x1b[0m`);
});