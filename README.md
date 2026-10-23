# Full Stack Open × Brewtica

Catatan belajar Guspriaman Warasi — Full Stack Developer & Server Security Engineer.

Tujuan: memahami alasan di balik implementasi web, lalu membuktikannya melalui studi kasus dan pengujian Brewtica. Kursus utama: [Full Stack Open, University of Helsinki](https://fullstackopen.com/en/).

Repositori ini publik atas izin pemilik setelah pemeriksaan berkas dan riwayat Git. Lab berjalan mandiri di localhost dengan data simulasi; penjelasan Brewtica merupakan studi kasus konseptual. Tidak ada sambungan ke API, database, atau repositori privat Brewtica.

## Status — 23 Oktober 2026

- Login GitHub `guspriaman` di sistem submission berhasil.
- **Part 0 berhasil disubmit: 6 latihan, 1,5 jam.** Angka waktu dan penyelesaian bacaan dikonfirmasi langsung oleh peserta, lalu diverifikasi pada portal.
- Diagram dan lab disiapkan melalui pendampingan AI. Bantuan tersebut diungkapkan pada berkas dan komentar submission.
- Portal kini menawarkan submission Part 1. Bukti pencatatan tersedia pada [receipt Part 0](part0/submission.json); pencatatan ini bukan sertifikat atau konfirmasi nilai akhir kursus.
- Repositori ini tidak berisi kode privat, kredensial, data pelanggan, maupun database Brewtica.

## Jalankan lab pertama

Gunakan Node.js 24 atau lebih baru. Lab tanpa dependensi pihak ketiga.

```sh
npm start
```

Buka http://127.0.0.1:4174/. Hentikan server dengan Ctrl+C. Server hanya mendengarkan localhost.

Bacaan dan praktik 0.1–0.3 tersedia di http://127.0.0.1:4174/dasar: HTML, pembanding CSS, serta formulir native dengan endpoint lokal. Halaman tersebut mendampingi bacaan MDN; halaman yang dibuka atau diuji oleh asisten tidak otomatis menjadi konfirmasi bahwa peserta telah menyelesaikan seluruh bacaan.

Pada laptop ini, Node.js 22 tetap dipakai Brewtica. Untuk lab gunakan PowerShell berikut dari folder repositori:

```powershell
& "$env:LOCALAPPDATA\nvm\v24.13.0\node.exe" .\part0\server.mjs
```

## Sesi 1 — HTTP, DOM, dan keranjang (30–45 menit)

1. Baca pengantar [Part 0](https://fullstackopen.com/en/part0/fundamentals_of_web_apps/), lalu bagian HTTP dan DOM. Tautan HTML, CSS, dan formulir untuk latihan 0.1–0.3 tersedia pada materi resmi.
2. Buka mini lab dan DevTools → Network. Muat ulang halaman. Temukan HTML, CSS, JavaScript, dan `GET /api/menu`.
3. Klik **Tambah Kopi Demo**. Amati DOM dan total. Handler ini mengubah state di browser, tanpa request HTTP.
4. Muat ulang halaman. Keranjang dipulihkan dari `localStorage`, bukan dari pesanan dalam database. Nama storage lab berbeda dari Brewtica.
5. Klik **Validasi ke server**. Amati `POST /api/cart/validate`, request JSON, status 200, serta respons harga dan stok. POST di contoh ini hanya membaca katalog.
6. Baca [pemetaan ke Brewtica](docs/brewtica-cart-flow.md), lalu tulis jawaban sendiri dalam [catatan belajar](part0/catatan-belajar.md).

Target sesi: dapat menjelaskan letak data keranjang dan perbedaan perubahan DOM dengan permintaan HTTP. Lab belum mencakup checkout, pembayaran, autentikasi, atau penyimpanan database.

## Bukti portofolio

| Tahap | Konsep | Praktik yang diarahkan ke Brewtica | Bukti yang dituju |
|---|---|---|---|
| 0 | HTTP, HTML/CSS, DOM, formulir | Telusuri alur katalog → keranjang → validasi | Diagram alur, catatan Network, penjelasan dengan kata sendiri |
| 1 | React, komponen, state, props | Pelajari pembagian komponen dan state keranjang | Demo komponen terisolasi dan catatan keputusan |
| 2 | Formulir dan komunikasi server | Loading, error, dan validasi input | Skenario UI dan hasil uji |
| 3 | Backend dan API | Bedakan validasi keranjang dan pembuatan order | Kontrak API, status HTTP, penanganan error |
| 4 | Pengujian backend dan autentikasi | Uji batas akses serta input tanpa transaksi produksi | Pengujian pada lingkungan lokal terpisah |
| 5 | Pengujian frontend | Kembangkan latihan Playwright yang sudah dimulai | PR, laporan uji, penjelasan perilaku yang dilindungi |

Latihan resmi tetap dikerjakan sesuai instruksi kursus; proyek Next.js Brewtica menjadi penerapan tambahan. Latihan React/Node dari kursus tidak otomatis setara dengan menyelesaikan fitur Next.js.

Perubahan aplikasi nantinya dibuat di branch terpisah, memakai data uji lokal, diperiksa sebelum merge/deploy. Tidak ada perubahan produksi dalam sesi pembukaan ini.

## Submission dan kelanjutan

- Kerjakan dan pahami setiap latihan sendiri; gunakan bantuan untuk penjelasan dan review.
- Review teknis diagram [0.4](part0/exercises/0.4-new-note.md), [0.5](part0/exercises/0.5-spa-load.md), dan [0.6](part0/exercises/0.6-spa-new-note.md) selesai dengan bantuan AI dan disertakan pada submission Part 0. Lihat [hasil review dan status submission](part0/README.md).
- Periksa seluruh latihan pada satu part sebelum mengirim: sistem mengunci penambahan latihan pada part yang sudah diserahkan.
- Jangan lampirkan repositori privat Brewtica sebagai tugas kursus. Gunakan repositori belajar terpisah.

Panduan terkini: [General info](https://fullstackopen.com/en/part0/general_info/). Sertifikat dan kredit universitas memiliki persyaratan berbeda; login saja belum menghasilkan sertifikat.
