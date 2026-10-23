# Review akhir Part 1

Pemeriksaan teknis 23 Oktober 2026. Basis implementasi: commit eda377f892c07c9899cc863329dfc8ab16bbe12a. Pendampingan AI diungkapkan; dokumen ini tidak menggantikan konfirmasi pemahaman atau waktu belajar peserta.

## Hasil pencocokan dan praktik

| Kelompok | Kesesuaian implementasi | Pengamatan review browser |
|---|---|---|
| 1.1–1.5 Courseinfo | Header, Content, Part, Total; course berbentuk objek dengan array parts; data dari App melalui props | Tiga bagian 10, 7, 14 dan total 31 tampil |
| 1.6–1.11 Unicafe | State terpisah di App, Statistics, Button, StatisticLine, kondisi kosong, statistik dalam tabel | Awalnya tanpa statistik; good 2 / neutral 1 / bad 1 menghasilkan all 4, average 0.25, positive 50.0% |
| 1.12–1.14 Anecdotes | Pilihan acak, array vote immutable, maksimum dan penanganan seri | Teks pertama mendapat 2 vote; teks lain mendapat 1; pemenang tetap teks pertama |

Seluruh nomor 1.1–1.14 terwakili pada hasil akhir tiga aplikasi. Teks anekdot berupa data orisinal berbahasa Indonesia, dengan perilaku sesuai tugas. Pilihan acak boleh mengulang; itu bukan kehilangan state vote.

Courseinfo melatih aliran props dari induk ke anak. Unicafe menyimpan sumber data pada state, lalu menghitung statistik turunan. Anecdotes memisahkan pilihan yang sedang tampil dari array hitungan vote; setter membuat array baru dan tidak mengubah state lama secara langsung.

Build sebelumnya berhasil dan source aplikasi tidak berubah sejak 14 pengujian desktop/mobile lulus. Laporan pengujian: 14 expected, 0 unexpected, 0 skipped, 0 flaky. Tidak ada pengiriman Part 1 pada saat review teknis ini dibuat.

## Data untuk portal

- Bagian: Part 1.
- Nomor yang siap direview untuk ditandai: 1–14.
- Repositori: https://github.com/guspriaman/fullstack-open
- Lokasi aplikasi: part1/courseinfo, part1/unicafe, part1/anecdotes.
- Komentar perlu menyebut pendampingan AI dan lokasi tiga aplikasi.
- Waktu harus berasal dari konfirmasi peserta, hanya untuk Part 1.
- Status setelah Send harus diperiksa pada tabel portal sebelum dinyatakan berhasil.

Sumber: [komponen](https://fullstackopen.com/en/part1/introduction_to_react/), [struktur data](https://fullstackopen.com/en/part1/java_script/), [state dan latihan lanjutan](https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps/).
