# Review teknis Part 2 — 23 Oktober 2026

Status: implementasi pendamping 2.1–2.20 siap untuk review belajar sebelum submission. **Belum disubmit.** Pemahaman dan waktu Part 2 belum dikonfirmasi oleh peserta. Semua aplikasi disiapkan dengan pendampingan AI dan hal itu diungkapkan pada source/panduan.

## Kesesuaian dengan tugas

| Kelompok | Hasil review |
|---|---|
| 2.1–2.5 Courseinfo | Course dalam modul terpisah; Course → Header/Content/Part/Total; map untuk course dan parts, key ID stabil, reduce bernilai awal 0. Data akhir: empat bagian total 42 dan dua bagian Node.js total 10. Tidak membatasi jumlah bagian dengan indeks hardcoded. |
| 2.6–2.10 Phonebook | Input nama/nomor terkontrol, preventDefault, deteksi duplikat, filter tanpa membedakan kapital. Filter, PersonForm, Persons terpisah; state dan handler tetap di App. |
| 2.11–2.15 Phonebook | Seed db.json dan json-server port 3001. GET melalui effect dan Axios. Modul service mengembalikan response.data. POST mendapatkan ID server; PUT untuk nomor pengganti; DELETE per-ID dengan konfirmasi. State berubah setelah respons berhasil. |
| 2.16–2.17 Phonebook | Notifikasi sukses/error berbeda gaya dan role aksesibilitas; hilang setelah 5 detik. Error 404 dari data usang menampilkan penjelasan dan menghapus entri usang hanya dari state browser. Input dipertahankan saat simpan gagal. Initial load gagal memiliki Retry dan tombol simpan dinonaktifkan. |
| 2.18–2.20 Countries | API negara resmi Helsinki; pencarian kosong, nol, >10, 2–10, dan satu hasil ditangani. Show memilih negara; perubahan query membersihkan pilihan. Detail ibu kota/luas/bahasa/bendera; cuaca ibu kota melalui Open-Meteo, tanpa API key. Request lama dibatalkan pada perubahan negara, koordinat hilang dijelaskan, retry API tersedia. |
| Lab Brewtica tambahan | Menggunakan komponen direktori yang sama pada resource /contacts terpisah. Pemasok fiktif; tidak berisi kode privat atau koneksi ke produksi. Panduan menjelaskan input → state → POST → respons → state → DOM dan reload → GET. |

Hasil akhir tiap kelompok cukup untuk review sesuai petunjuk tugas; folder latihan resmi tetap terpisah dari lab tambahan. Implementasi ini tidak menambahkan validasi backend/autentikasi produksi; JSON Server adalah server latihan.

## Validasi otomatis

Build Vite berhasil. **32 pengujian lulus: 16 skenario × desktop/mobile; 0 gagal, 0 skip, 0 flaky.** Laporan JSON terakhir mulai 2026-10-23T05:32:17.497Z, durasi sekitar 55 detik.

Skenario meliputi total course, form POST tanpa navigasi halaman, persistensi reload, filter, peringatan duplikat, pembatalan/konfirmasi PUT dan DELETE, error request, retry, notifikasi kedaluwarsa, dua halaman dengan entri usang, endpoint lab terpisah, pencarian negara, Show, cuaca, kegagalan API, koordinat kosong, dan layout responsif. Page error tidak ditoleransi pada pengujian.

Test kegagalan/CRUD/delete memakai fixture HTTP terisolasi dalam memori. Test persistensi nyata hanya membuat entri demo unik dan mempertahankannya di database lokal. Data belajar yang sudah ada tidak direset atau dihapus. Empat entri Persistence Demo tersimpan dari dua putaran pengujian; ini data runtime yang diabaikan Git.

Pada putaran pertama ditemukan label tombol saat disabled yang membingungkan dan locator pengujian nomor yang terlalu ketat. Label diperbaiki agar tetap Add / update; pemeriksaan nomor ditargetkan ke baris kontak. Build dan keseluruhan 32 pengujian kemudian lulus.

## Praktik langsung pada browser

- Browser dalam aplikasi membuka lab pada port 4177; server lokal port 3001 aktif. Chrome sempat tidak terhubung ke kontrol browser, sehingga pengecekan dilanjutkan di browser dalam aplikasi.
- Ditambahkan satu pemasok fiktif “Pemasok Praktik Part 2”, nomor “DEMO-PART2-001”. Respons sukses tampil; setelah reload entri tetap terlihat dan filter “Praktik” menyisakan entri tersebut.
- Countries memakai API live: Finland, ibu kota Helsinki, luas 338.424 km², Finnish/Swedish, bendera, dan cuaca Helsinki tampil. Pengamatan saat review: suhu 10,7 °C, angin 22,7 km/h; waktu model 2026-10-23T08:30 Europe/Helsinki. Angka ini observasi saat review, bukan data tetap atau jaminan ketersediaan layanan.
- Screenshot lab dan negara disimpan dalam paket lokal keluaran. Pemeriksaan tampilan tidak menunjukkan pemotongan konten; layout menyesuaikan lebar panel.

## Sebelum pengiriman resmi

1. Peserta membaca materi Part 2 dan mempraktikkan alur pada README.
2. Peserta mereview ketiga aplikasi resmi dan dapat menjelaskan props, state, effect, respons server, persistensi, serta error.
3. Konfirmasi pemahaman dan waktu belajar khusus Part 2 berasal dari peserta. Waktu Part 0–1 tidak dihitung ulang.
4. Saat submission diizinkan, gunakan root repo https://github.com/guspriaman/fullstack-open dan ungkapkan bantuan AI serta lokasi aplikasi di part2/.
5. Verifikasi hasil pada portal sebelum menambah hitungan resmi. Saat ini total resmi tetap 20 latihan dan 3 jam.

Sumber tugas: [collections](https://fullstackopen.com/en/part2/rendering_a_collection_modules/), [forms](https://fullstackopen.com/en/part2/forms/), [GET](https://fullstackopen.com/en/part2/getting_data_from_server/), [perubahan server](https://fullstackopen.com/en/part2/altering_data_in_server/), [styling dan Countries](https://fullstackopen.com/en/part2/adding_styles_to_react_app/).
