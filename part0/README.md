# Part 0 — Paket review akhir

Review teknis selesai pada 23 Oktober 2026. Hasil dibuat melalui pendampingan AI dan pembahasan dengan peserta; bantuan tersebut dinyatakan terbuka dalam berkas latihan. Belum ada submission resmi.

| Latihan | Skenario | Hasil review |
|---|---|---|
| [0.4](exercises/0.4-new-note.md) | Menambah catatan melalui formulir Notes | POST, redirect 302, GET halaman, aset dan JSON, lalu DOM: sesuai sumber |
| [0.5](exercises/0.5-spa-load.md) | Membuka SPA | HTML, CSS, spa.js, data.json, lalu DOM: sesuai sumber |
| [0.6](exercises/0.6-spa-new-note.md) | Menambah catatan melalui SPA | preventDefault, perubahan lokal/DOM, POST JSON, 201 tanpa redirect: sesuai sumber |

Kode referensi yang diperiksa: [example_app, commit 3a61b89](https://github.com/mluukkai/example_app/tree/3a61b89f0b4ec3b8db9de97025564587f9e6ede0), khususnya index.js dan public/spa.js. Perbandingan dilakukan terhadap alur sukses. Cache dan unduhan paralel dapat membuat tampilan Network berbeda dari urutan visual yang disederhanakan.

## Persiapan submission

- [x] Tiga diagram tersedia di folder exercises.
- [x] Pemeriksaan teknis terhadap kode sumber resmi selesai.
- [x] Penjelasan peserta tentang redirect, HTML/JSON, dan DOM sebelum POST tercatat.
- [x] Repositori terpisah dan privat; tidak berisi kode privat atau data produksi Brewtica.
- [ ] Bacaan 0.1 HTML, 0.2 CSS, dan 0.3 formulir: belum dikonfirmasi selesai oleh peserta. Jangan mencatatnya sebagai selesai tanpa dasar.
- [ ] Akses pengajar untuk repositori privat: akun resmi mattiluukkainen belum menjadi collaborator; belum ada undangan.
- [ ] Pernyataan integritas akademik: belum disetujui peserta pada portal.
- [ ] Jumlah latihan dan waktu belajar: hanya laporkan yang benar-benar selesai dan waktu yang dapat dipertanggungjawabkan. Jangan mengisi angka perkiraan sebagai data peserta tanpa dasar.

Alamat folder latihan: https://github.com/guspriaman/fullstack-open/tree/codex/fullstack-open-foundations/part0/exercises

Portal telah diperiksa sampai pernyataan integritas; kolom setelahnya belum dibuka. Review ini tidak mengklaim seluruh persyaratan portal sudah terpenuhi. [Ketentuan submission resmi](https://fullstackopen.com/en/part0/general_info/#submitting-exercises) menyatakan part yang sudah dikirim tidak dapat ditambah latihan yang terlewat.

Tidak ada perubahan pada produksi Brewtica dan tidak ada data yang dihapus. Catatan checklist pengamatan yang belum dikonfirmasi tetap dibiarkan terbuka.
