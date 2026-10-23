import { useState } from 'react';
import Navigation from '../../shared/Navigation.jsx';

const products = [
  { id: 'coffee', name: 'Kopi Demo', price: 25000, stock: 5 },
  { id: 'tea', name: 'Teh Demo', price: 18000, stock: 3 },
];
const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export function ProductCard({ product, quantity, onAdd }) {
  return <article><h2>{product.name}</h2><p>{rupiah(product.price)} · stok simulasi {product.stock}</p><p>Di keranjang: {quantity}</p><button type="button" onClick={() => onAdd(product.id)} disabled={quantity >= product.stock}>Tambah {product.name}</button><p className="hint">product dan quantity adalah props. onAdd adalah callback dari App.</p></article>;
}
export function Cart({ items, onDecrease }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <section aria-label="Keranjang React"><h2>Keranjang</h2>{items.length === 0 ? <p>Keranjang masih kosong.</p> : items.map(item => <div className="cart-line" key={item.id}><span>{item.name} × {item.quantity}</span><strong>{rupiah(item.price * item.quantity)}</strong><button type="button" className="secondary" onClick={() => onDecrease(item.id)} aria-label={`Kurangi ${item.name}`}>−1</button></div>)}<p className="number" aria-live="polite">Total: {rupiah(total)}</p><p className="hint">Total dihitung dari state, bukan disimpan sebagai state kedua.</p></section>;
}
export default function App() {
  const [quantities, setQuantities] = useState({ coffee: 0, tea: 0 });
  const [lastAction, setLastAction] = useState('Belum ada klik.');
  const add = id => {
    const product = products.find(product => product.id === id);
    setQuantities(previous => ({ ...previous, [id]: Math.min(previous[id] + 1, product.stock) }));
    setLastAction(`Callback tambah ${product.name} meminta App memperbarui state.`);
  };
  const decrease = id => {
    setQuantities(previous => ({ ...previous, [id]: Math.max(previous[id] - 1, 0) }));
    setLastAction('State diperbarui dengan objek baru; jumlah tidak menjadi negatif.');
  };
  const items = products.filter(product => quantities[product.id] > 0).map(product => ({ ...product, quantity: quantities[product.id] }));
  return <main><Navigation /><p className="eyebrow">LAB KEDAI · REACT</p><h1>Satu state, tampilan selaras.</h1><p className="notice">Simulasi mandiri. Tidak ada API, database, checkout, atau koneksi produksi. State kembali ke awal setelah reload.</p>
    <div className="columns">{products.map(product => <ProductCard key={product.id} product={product} quantity={quantities[product.id]} onAdd={add} />)}</div>
    <div className="columns workspace"><Cart items={items} onDecrease={decrease} /><aside><h2>Yang sedang terjadi</h2><p role="status">{lastAction}</p><pre>{JSON.stringify(quantities, null, 2)}</pre><p>Komponen = bagian UI. Props = masukan dari induk. State = data yang diingat React dan dapat diubah lewat setter.</p></aside></div>
    <footer>Contoh asli yang dibuat dengan bantuan AI untuk belajar. Tidak menyalin source privat Brewtica.</footer>
  </main>;
}
