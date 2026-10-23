# Part 1 — React, dari konsep ke praktik

Implementasi pendamping disiapkan dengan bantuan AI. Source mencakup hasil akhir kelompok latihan 1.1–1.14 dan lab kedai tambahan. **Belum disubmit sebagai Part 1; pemahaman peserta dan waktu belajar Part 1 belum dikonfirmasi.** Part 0 tetap tercatat 6 latihan/1,5 jam.

## Jalankan

Gunakan Node.js 24. Dari folder `part1`:

```sh
npm ci
npm run dev
```

Buka http://127.0.0.1:4175/. Satu proyek Vite menyediakan empat halaman terpisah; sumber tiap aplikasi berada dalam foldernya sendiri. Tidak ada koneksi ke proyek privat atau produksi.

| Aplikasi | URL lokal | Source utama |
|---|---|---|
| Lab kedai | /brewtica-lab/ | [App.jsx](brewtica-lab/src/App.jsx) |
| Courseinfo | /courseinfo/ | [App.jsx](courseinfo/src/App.jsx) |
| Unicafe | /unicafe/ | [App.jsx](unicafe/src/App.jsx) |
| Anecdotes | /anecdotes/ | [App.jsx](anecdotes/src/App.jsx) |

Lab Part 0 tetap berjalan terpisah pada port 4174. Node.js untuk Brewtica produksi tidak diganti.

## 1. Komponen: satu bagian tampilan

`ProductCard` adalah fungsi yang mengembalikan JSX untuk satu kartu produk. Dua produk memakai komponen yang sama. `Cart` bertanggung jawab menampilkan keranjang. `App` mengatur datanya.

Komponen diawali huruf kapital, ditulis di luar komponen lain, dan digunakan sebagai elemen JSX. JSX memakai kurung kurawal untuk memasukkan ekspresi JavaScript dan `className` untuk class CSS.

## 2. Props: masukan dari induk

```jsx
<ProductCard
  product={product}
  quantity={quantities[product.id]}
  onAdd={add}
/>
```

`App` mengirim objek produk, jumlah, dan fungsi callback. `ProductCard` membaca props, menampilkan data, dan memanggil callback ketika diklik. Props tidak diubah langsung oleh anak.

## 3. State: data yang diingat React

```jsx
const [quantities, setQuantities] = useState({ coffee: 0, tea: 0 })
setQuantities(previous => ({
  ...previous,
  coffee: Math.min(previous.coffee + 1, 5),
}))
```

Setter meminta React menjadwalkan render berikutnya. Fungsi updater menerima state sebelumnya, sehingga beberapa klik tidak bergantung pada salinan nilai lama. Spread membentuk objek baru. Mengubah objek lama langsung tidak memberi alur pembaruan yang benar.

Nama dan harga produk merupakan props; jumlah yang bisa berubah berasal dari state. Total adalah data turunan dari harga × jumlah, sehingga tidak perlu state tersendiri. `onClick={() => onAdd(product.id)}` menunggu klik; `onClick={onAdd(product.id)}` malah memanggil fungsi saat render.

Hook dipanggil pada tingkat teratas komponen, bukan di dalam kondisi atau loop. Daftar komponen memakai key stabil. Fungsi biasa boleh dihitung saat render selama tidak menimbulkan efek samping.

## Praktik berurutan tanpa transaksi nyata

1. Buka lab kedai. Tambah Kopi Demo satu kali dan Teh Demo dua kali. Total menjadi Rp61.000. Kartu produk dan keranjang memakai state yang sama pada App.
2. Kurangi Teh Demo sekali. Total menjadi Rp43.000. Tombol anak menyampaikan kejadian ke induk melalui callback.
3. Tambah kopi sampai stok 5. Tombol tambah dinonaktifkan. Jumlah tidak melewati batas simulasi.
4. Reload. State kembali ke awal: contoh React ini hanya memakai memori. Lab Part 0 menyimpan keranjang ke localStorage; React tidak membuat persistence secara otomatis.
5. Buka Courseinfo. Ikuti data `course` dari App menuju Header, Content, Part, dan Total. Tiga jumlah menghasilkan total 31.
6. Buka Unicafe. Sebelum klik, statistik belum ditampilkan. Klik good dua kali, neutral sekali, bad sekali: total 4, rata-rata 0,25, positif 50%. Lihat bahwa statistik dihitung dari tiga state, bukan state tambahan.
7. Buka Anecdotes. Vote satu teks, pindah ke teks lain, dan vote lagi. Masing-masing punya hitungan sendiri; bagian terbanyak mengikuti maksimum array. Pilihan acak dapat mengulang dan hasil seri memilih satu pemenang.

Konsep JavaScript yang dipakai: objek/array, destructuring parameter, arrow function, spread, map, reduce, dan kondisi. Gunakan Console untuk menemukan error; React memperbarui DOM dari hasil render, sehingga perubahan tampilan tidak perlu querySelector manual.

## Pemetaan latihan resmi

| Nomor | Implementasi yang diperiksa |
|---|---|
| 1.1 | Header, Content, Total; data milik App |
| 1.2 | Content memakai Part |
| 1.3 | Data bagian berbentuk objek |
| 1.4 | Array parts diteruskan sebagai props |
| 1.5 | course menyatukan name dan parts |
| 1.6 | Tiga counter feedback |
| 1.7 | Total, rata-rata, persentase positif |
| 1.8 | Statistics dipisahkan; state tetap di App |
| 1.9 | Kondisi tanpa feedback |
| 1.10 | Button dan StatisticLine |
| 1.11* | Statistik memakai table/tbody/tr |
| 1.12* | Pilihan anekdot acak |
| 1.13* | Vote terpisah, pembaruan array immutable |
| 1.14* | Anekdot dengan vote terbesar |

Data Courseinfo mengikuti skenario tugas. Anecdotes memakai delapan teks latihan orisinal berbahasa Indonesia, bukan kutipan yang diklaim milik penulis lain. Keduanya dinyatakan terbuka untuk review. Folder final dipertahankan; kursus menerima hasil akhir tiap kelompok tanpa mewajibkan snapshot setiap langkah.

## Pemeriksaan teknis

```sh
npm run build
npx playwright install chromium
npm test
```

Hasil 23 Oktober 2026: build berhasil; **14 pengujian berhasil** (7 skenario × desktop/mobile). Pengujian memeriksa jumlah, statistik kosong/negatif/campuran, vote independen dan pemenang, batas stok, reload, ketiadaan request API dari keranjang, layout, dan error browser. Pengujian bukan konfirmasi pemahaman peserta.

Sebelum submission: baca seluruh materi Part 1 termasuk JavaScript dan debugging, telusuri source tiap aplikasi, pahami callback serta pembaruan immutable, review implementasi dengan kata sendiri, lalu laporkan waktu belajar sebenarnya. Angka 1,5 jam Part 0 tidak digunakan ulang untuk Part 1. Belum ada checkbox portal Part 1 yang ditandai.

## Sumber

- [Introduction to React / 1.1–1.2](https://fullstackopen.com/en/part1/introduction_to_react/)
- [JavaScript / 1.3–1.5](https://fullstackopen.com/en/part1/java_script/)
- [Component state and event handlers](https://fullstackopen.com/en/part1/component_state_event_handlers/)
- [Complex state, debugging, dan 1.6–1.14](https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps/)
