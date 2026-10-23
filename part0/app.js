const storageKey = 'fso_part0_cart_demo_v1';
const currency = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const menuElement = document.querySelector('#menu');
const cartElement = document.querySelector('#cart');
const totalElement = document.querySelector('#total');
const statusElement = document.querySelector('#status');
const validateButton = document.querySelector('#validate');
let cart = [];
let products = [];
let storageAvailable = true;

function trace(text) {
  const item = document.createElement('li');
  item.textContent = text;
  document.querySelector('#trace').append(item);
}
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) cart = saved.filter(item =>
    ['coffee-demo', 'tea-demo'].includes(item.id) &&
    typeof item.name === 'string' && Number.isFinite(item.price) && item.price >= 0 &&
    Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 5
  );
} catch {
  trace('Data lokal tidak dapat dibaca; lab dimulai dengan keranjang kosong.');
}

function renderCart() {
  cartElement.replaceChildren();
  if (!cart.length) {
    const empty = document.createElement('li');
    empty.textContent = 'Keranjang masih kosong.';
    cartElement.append(empty);
  }
  for (const item of cart) {
    const row = document.createElement('li');
    row.textContent = `${item.name} × ${item.quantity} — ${currency.format(item.price * item.quantity)}`;
    cartElement.append(row);
  }
  totalElement.textContent = `Total simulasi: ${currency.format(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}`;
  validateButton.disabled = !cart.length;
  try { localStorage.setItem(storageKey, JSON.stringify(cart)); }
  catch {
    if (storageAvailable) trace('Penyimpanan lokal tidak tersedia; keranjang hanya bertahan selama halaman terbuka.');
    storageAvailable = false;
  }
}

async function loadMenu() {
  try {
    const response = await fetch('/api/menu');
    if (!response.ok) throw new Error('Menu gagal dimuat.');
    products = await response.json();
    trace(`HTTP GET /api/menu → ${response.status}; JSON dipakai untuk membentuk kartu menu.`);
    menuElement.replaceChildren();
    for (const product of products) {
      const article = document.createElement('article');
      const name = document.createElement('h3');
      name.textContent = product.name;
      const price = document.createElement('p');
      price.textContent = currency.format(product.price);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `Tambah ${product.name}`;
      button.addEventListener('click', () => {
        const existing = cart.find(item => item.id === product.id);
        if (existing && existing.quantity >= product.stock) {
          statusElement.textContent = 'Jumlah sudah mencapai stok simulasi.';
          return;
        }
        if (existing) existing.quantity += 1;
        else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        renderCart();
        statusElement.textContent = 'Keranjang berubah di browser. Belum divalidasi ulang.';
        trace(`Klik tambah ${product.name} → state, DOM, dan localStorage berubah; handler ini tidak mengirim request HTTP.`);
      });
      article.append(name, price, button);
      menuElement.append(article);
    }
  } catch (error) {
    menuElement.textContent = error.message;
    trace('GET menu gagal. Periksa server dan tab Network.');
  }
}

validateButton.addEventListener('click', async () => {
  validateButton.disabled = true;
  statusElement.textContent = 'Meminta harga dan stok simulasi dari server…';
  try {
    const response = await fetch('/api/cart/validate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: cart.map(item => item.id) }),
    });
    if (!response.ok) throw new Error('Validasi gagal.');
    const latest = await response.json();
    cart = cart.flatMap(item => {
      const product = latest.find(product => product.id === item.id);
      return product ? [{ id: product.id, name: product.name, price: product.price, quantity: Math.min(item.quantity, product.stock) }] : [];
    });
    renderCart();
    statusElement.textContent = 'Harga dan stok sudah dicocokkan. Tidak ada pesanan yang dibuat.';
    trace(`HTTP POST /api/cart/validate → ${response.status}; respons JSON memperbarui keranjang. Server hanya membaca katalog.`);
  } catch (error) {
    statusElement.textContent = `${error.message} Keranjang tetap disimpan di browser.`;
  } finally { validateButton.disabled = !cart.length; }
});

renderCart();
trace('HTML dimuat; JavaScript membaca keranjang lokal lalu membentuk DOM.');
await loadMenu();
