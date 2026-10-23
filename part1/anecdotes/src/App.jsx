import { useState } from 'react';
import Navigation from '../../shared/Navigation.jsx';

// Original Indonesian practice data, not quotations attributed to other authors.
export const anecdotes = [
  'Kode yang mudah dibaca mempercepat perbaikan besok.',
  'Pengujian yang baik menjelaskan perilaku yang ingin dipertahankan.',
  'Pahami alur data sebelum menambah abstraksi.',
  'Perubahan kecil lebih mudah ditinjau daripada tebakan besar.',
  'Pesan error yang jelas adalah bagian dari pengalaman pengguna.',
  'Data dari browser tetap perlu diperiksa oleh server.',
  'Simpan sumber kebenaran sekali, lalu hitung sisanya.',
  'Alat membantu bekerja cepat, pemahaman membantu memilih arah.',
];

export default function App() {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const maximum = Math.max(...votes);
  const winner = votes.indexOf(maximum);
  const vote = () => setVotes(previous => previous.map((count, index) => index === selected ? count + 1 : count));
  const next = () => setSelected(Math.floor(Math.random() * anecdotes.length));
  return <main><Navigation /><p className="eyebrow">ANECDOTES · 1.12–1.14</p><h1>Anecdote of the day</h1>
    <section aria-label="Selected anecdote"><p className="quote">{anecdotes[selected]}</p><p aria-live="polite">has {votes[selected]} votes</p></section>
    <div className="actions"><button type="button" onClick={vote}>vote</button><button type="button" onClick={next}>next anecdote</button></div>
    <section aria-label="Most voted anecdote"><h2>Anecdote with most votes</h2><p className="quote">{anecdotes[winner]}</p><p aria-live="polite">has {maximum} votes</p></section>
    <footer>Each anecdote has its own vote count. Array updates create a new array. Random selection may repeat; ties show the first winner. Prepared with AI tutoring assistance.</footer>
  </main>;
}
