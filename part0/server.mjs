import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

// Data simulasi, bukan sambungan ke database atau API produksi Brewtica.
const menu = [
  { id: 'coffee-demo', name: 'Kopi Demo', price: 25000, stock: 5 },
  { id: 'tea-demo', name: 'Teh Demo', price: 18000, stock: 3 },
];
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/dasar', ['dasar.html', 'text/html; charset=utf-8']],
  ['/dasar.css', ['dasar.css', 'text/css; charset=utf-8']],
  ['/dasar.js', ['dasar.js', 'text/javascript; charset=utf-8']],
]);

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  // Local lab: accept only same-host requests and never expose it on the LAN.
  if (req.headers.host !== '127.0.0.1:4174' ||
      (req.headers.origin && req.headers.origin !== 'http://127.0.0.1:4174')) {
    return json(res, 403, { error: 'Akses hanya dari lab lokal.' });
  }
  const path = new URL(req.url, 'http://127.0.0.1:4174').pathname;
  if (req.method === 'GET' && files.has(path)) {
    const [name, type] = files.get(path);
    try {
      const body = await readFile(new URL(name, import.meta.url));
      res.writeHead(200, {
        'Content-Type': type,
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'",
      });
      return res.end(body);
    } catch { return json(res, 500, { error: 'Berkas lab gagal dibaca.' }); }
  }
  if (req.method === 'POST' && path === '/latihan-form') {
    if (req.headers['content-type']?.split(';')[0] !== 'application/x-www-form-urlencoded') {
      return json(res, 415, { error: 'Gunakan formulir HTML bawaan.' });
    }
    let raw = '';
    try {
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 4096) return json(res, 413, { error: 'Formulir terlalu besar.' });
      }
      const fields = new URLSearchParams(raw);
      const product = fields.get('product');
      const quantity = Number(fields.get('quantity'));
      const note = fields.get('note') || '';
      if (!menu.some(item => item.id === product) || !Number.isInteger(quantity) || quantity < 1 || quantity > 5 || note.length > 300) {
        return json(res, 400, { error: 'Produk, jumlah, atau catatan tidak valid.' });
      }
      const escaped = JSON.stringify({ product, quantity, note }, null, 2)
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'self'; object-src 'none'; frame-ancestors 'none'",
      });
      return res.end(`<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hasil formulir simulasi</title><link rel="stylesheet" href="/dasar.css"><main><p class="eyebrow">LATIHAN 0.3</p><h1>Formulir diterima.</h1><p>Server membalas HTML dengan status 200. Tidak ada pesanan atau data yang disimpan.</p><pre>${escaped}</pre><p>Di Network, periksa POST /latihan-form dan Payload → Form Data. JSON yang ditampilkan di atas hanya format ringkasan respons; kiriman formulir aslinya berupa pasangan name/value yang di-URL-encode.</p><p>Contoh ini langsung membalas HTML. Contoh kursus 0.4 membalas redirect 302.</p><a href="/dasar#formulir">Kembali ke materi formulir</a> · <a href="/">Buka lab keranjang</a></main></html>`);
    } catch { return json(res, 400, { error: 'Formulir tidak dapat dibaca.' }); }
  }
  if (req.method === 'GET' && path === '/api/menu') return json(res, 200, menu);
  if (req.method === 'POST' && path === '/api/cart/validate') {
    if (req.headers['content-type']?.split(';')[0] !== 'application/json') {
      return json(res, 415, { error: 'Gunakan JSON.' });
    }
    try {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 4096) return json(res, 413, { error: 'Body terlalu besar.' });
      }
      const body = JSON.parse(raw);
      if (!Array.isArray(body.productIds) || body.productIds.length > 10 ||
          !body.productIds.every(id => typeof id === 'string')) {
        return json(res, 400, { error: 'productIds harus berupa array ID produk.' });
      }
      // POST di sini membaca katalog. Tidak membuat pesanan dan tidak mengubah stok.
      return json(res, 200, menu.filter(product => body.productIds.includes(product.id)));
    } catch { return json(res, 400, { error: 'JSON tidak valid.' }); }
  }
  return json(res, 404, { error: 'Rute tidak ditemukan.' });
});
server.listen(4174, '127.0.0.1', () => {
  console.log('Part 0 lab siap: http://127.0.0.1:4174/ — Ctrl+C untuk berhenti');
});
