/**
 * DevTrack - Local Office Network Server
 * Lightweight zero-dependency HTTP server for serving the app across office Wi-Fi / LAN
 * and providing real-time team state synchronization between developer laptops.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'devtrack_server_db.json');
const BACKUP_SEED_FILE = path.join(__dirname, 'DevTrack_Database_Backup_2026-09-18.json');

// Auto-seed database if it doesn't exist yet
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    if (fs.existsSync(BACKUP_SEED_FILE)) {
      try {
        const seedData = fs.readFileSync(BACKUP_SEED_FILE, 'utf8');
        fs.writeFileSync(DB_FILE, seedData, 'utf8');
        console.log('📦 Database initialized from latest backup file.');
      } catch (err) {
        console.warn('⚠️ Could not copy backup seed file:', err.message);
      }
    }
  }
}
initDatabase();

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Helper: Get local network IP addresses
function getLocalNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

const server = http.createServer((req, res) => {
  // CORS Headers for network clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse URL safely
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // API Route: Health Check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  // API Route: Get Server State
  if (pathname === '/api/state' && req.method === 'GET') {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        parsed._serverTimestamp = Date.now();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(parsed));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read database file', details: err.message }));
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ exists: false }));
    }
    return;
  }

  // API Route: Sync/Save Server State
  if (pathname === '/api/state' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (!parsed || !Array.isArray(parsed.developers)) {
          throw new Error('Invalid state schema: missing developers list');
        }
        parsed._serverTimestamp = Date.now();
        const jsonToSave = JSON.stringify(parsed, null, 2);
        fs.writeFileSync(DB_FILE, jsonToSave, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, timestamp: parsed._serverTimestamp }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  let filePath = path.join(__dirname, relativePath);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      // Fallback to index.html for SPA routing if requested resource has no extension
      if (!path.extname(filePath)) {
        filePath = path.join(__dirname, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
        return;
      }
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`, 'utf-8');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalNetworkAddresses();
  console.log('\n================================================================');
  console.log('🚀 DevTrack Local Office Attendance Server is Running!');
  console.log('================================================================');
  console.log(`\n💻 Local access on this computer:`);
  console.log(`   http://localhost:${PORT}`);
  
  if (ips.length > 0) {
    console.log(`\n🌐 Team access from other laptops/phones on the same office Wi-Fi:`);
    ips.forEach(ip => {
      console.log(`   http://${ip}:${PORT}`);
    });
  }
  console.log('\n================================================================\n');
});
