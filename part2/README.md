# Part 2 — Dari state React ke data di server

Tujuan sesi: memahami alur data dan menyiapkan latihan 2.1–2.20 untuk review sebelum submission. Disiapkan dengan pendampingan AI; pengujian teknis bukan bukti bahwa peserta sudah membaca atau memahami materi. Part 2 **belum disubmit** dan waktu belajar belum dicatat. Part 0–1 tetap tercatat 20 latihan/3 jam.

Lab Brewtica di sini adalah studi kasus mandiri dengan pemasok fiktif. Tidak mengambil kode, database, kontak, atau API dari Brewtica produksi. Nama pemasok dan nomor DEMO bukan data orang sungguhan.

## Jalankan di dua terminal

Gunakan Node.js 24. Dari folder `part2`:

```sh
npm ci
```

Terminal pertama:

```sh
npm run server
```

Terminal kedua:

```sh
npm run dev
```

Buka http://127.0.0.1:4177/. Server API berada pada http://127.0.0.1:3001/.

Di laptop ini Node.js 22 untuk Brewtica tetap dipertahankan. Jika terminal memakai Node 22, gunakan executable khusus berikut dari folder `part2`:

```powershell
& "$env:LOCALAPPDATA\nvm\v24.13.0\node.exe" server.mjs
# Terminal lain:
& "$env:LOCALAPPDATA\nvm\v24.13.0\node.exe" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4177 --strictPort
```

| Halaman | Alamat | Tujuan |
|---|---|---|
| Lab Brewtica | /brewtica-lab/ | Praktik pemasok simulasi melalui resource /contacts |
| Courseinfo | /courseinfo/ | Latihan 2.1–2.5 |
| Phonebook | /phonebook/ | Latihan 2.6–2.17, resource /persons |
| Countries | /countries/ | Latihan 2.18–2.20, API negara dan cuaca |

`db.json` adalah seed contoh. `server.mjs` menyalinnya ke `.data/db.json` hanya jika berkas runtime belum ada. Restart server tidak menimpa entri latihan. Data runtime diabaikan Git. Tidak ada perintah reset otomatis. Masukkan data demo saja. Tombol Delete pada aplikasi meminta konfirmasi dan hanya menghapus entri lokal yang dipilih.

## 1. Daftar: map, filter, reduce, dan key

Bayangkan menu kedai berupa array produk:

```js
products.map(product => <Product key={product.id} product={product} />)
products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
products.reduce((total, product) => total + product.price * product.quantity, 0)
```

`map` menghasilkan tampilan per item. `filter` memilih item. `reduce` menggabungkan data menjadi satu nilai, misalnya total. `key` memberi identitas stabil saat daftar berubah; gunakan ID data. Key unik diperlukan di antara saudara dalam daftar yang sama.

Praktik: buka Courseinfo. Course pertama memiliki empat bagian dengan total 42; Node.js dua bagian dengan total 10. Telusuri `courseinfo/src/App.jsx` → `Course.jsx`. Course menerima objek melalui props, Content memakai map, Total memakai reduce dengan nilai awal 0 sehingga daftar kosong tetap menghasilkan 0. Menambah satu bagian tidak membutuhkan penambahan JSX manual.

## 2. Formulir terkontrol

Input menampilkan nilai state lewat `value`. Saat Anda mengetik, `onChange` memperbarui state. Saat formulir dikirim, `event.preventDefault()` mencegah navigasi dokumen bawaan browser.

Praktik: buka Lab Brewtica. Isi **Name: Pemasok Latihan** dan **Number: DEMO-003**. Sebelum klik Add / update, data baru hanya ada di state formulir. Daftar belum bertambah dan server belum menerima data.

Komponen `Filter`, `PersonForm`, dan `Persons` menerima nilai serta callback. State dan handler operasi disimpan di App. Dengan ini kita dapat mengikuti satu sumber data, bukan membuat salinan state di setiap anak komponen.

## 3. Membaca server: useEffect, Promise, dan GET

Halaman mula-mula merender state daftar kosong dan status Loading. Setelah render, `useEffect` memulai GET. Promise mewakili hasil yang datang kemudian. Saat respons berhasil, `setPersons(data)` memicu render berikutnya.

```js
useEffect(() => {
  const controller = new AbortController()
  service.getAll(controller.signal).then(data => setPersons(data))
  return () => controller.abort()
}, [service])
```

Ini cuplikan konsep; source lengkap juga menangani loading, retry, dan error. Cleanup membatalkan request yang sudah tidak diperlukan. Dependency effect menentukan kapan effect perlu dijalankan lagi. Di mode pengembangan dengan StrictMode, React dapat menjalankan siklus setup/cleanup tambahan; jumlah request tidak boleh dijadikan satu-satunya patokan pemahaman effect.

Praktik DevTools → Network → Fetch/XHR: reload lab. Temukan **GET /contacts**, status 200, serta respons JSON pemasok. Pada Phonebook endpoint-nya **GET /persons**. Frontend (4177) dan API (3001) merupakan dua proses berbeda meskipun keduanya berada di komputer Anda.

## 4. Menyimpan perubahan: POST, PUT, DELETE

| Tindakan | Request lab | Kapan DOM berubah? |
|---|---|---|
| Baca daftar | GET /contacts | Setelah JSON diterima dan state diperbarui |
| Tambah pemasok | POST /contacts | Setelah server mengembalikan entri dan ID |
| Ganti nomor | PUT /contacts/:id | Setelah server mengonfirmasi data pengganti |
| Hapus satu entri lokal | DELETE /contacts/:id | Setelah konfirmasi pengguna dan respons server |
| Filter nama | Tidak mengirim HTTP baru | Setelah state filter berubah |

Praktik aman: tambah pemasok demo melalui formulir. Lihat Payload berisi `name` dan `number`, lalu Response berisi ID dari server. Reload halaman: data tetap tampil karena dibaca lagi dari `.data/db.json`, bukan dari localStorage. Ini berbeda dengan lab Part 1 yang menyimpan keranjang hanya di memori React.

Isi nama yang sama dengan nomor berbeda untuk melihat konfirmasi penggantian. Cancel tidak mengirim PUT. Nama dan nomor yang sama memunculkan peringatan duplikat. Pencocokan nama mengabaikan kapital dan spasi di tepi.

Modul `phonebook/src/services/persons.js` menangani Axios dan HTTP. App mengelola state/tampilan. Memisahkan keduanya memudahkan debugging: periksa URL/payload di service dan perubahan state di App.

## 5. Kegagalan request dan notifikasi

Respons gagal tidak boleh menjadi pesan sukses. `catch` menampilkan notifikasi error, mempertahankan input agar bisa dicoba ulang, dan `finally` mengaktifkan kembali tombol. Pesan sukses dan error berbeda gaya; notifikasi operasi hilang setelah lima detik.

Untuk latihan 2.17, bila kontak dihapus melalui tab pertama lalu tab kedua mencoba mengganti nomornya, server mengembalikan 404. Tab kedua menjelaskan bahwa data telah dihapus dan membersihkan entri usang dari tampilan. Pengujian skenario ini memakai dua halaman dengan data tiruan terisolasi, sehingga tidak menghapus entri belajar Anda.

Latihan tanpa menghapus data: hentikan server lokal dengan Ctrl+C, lalu coba simpan pemasok demo. Perhatikan pesan gagal dan input tetap ada. Nyalakan server lagi lalu coba simpan ulang. Error koneksi yang ditangani dapat tetap muncul di console; yang tidak boleh ada adalah exception aplikasi/promise yang tidak ditangani.

## 6. Countries: data API dan effect yang bergantung pilihan

Countries mengambil daftar negara dari layanan University of Helsinki. Input pencarian menyaring daftar di browser. Lebih dari 10 hasil meminta filter lebih spesifik; 2–10 hasil memberi tombol Show; satu hasil menampilkan ibu kota, luas, bahasa, dan bendera. Nol hasil ditangani dengan pesan yang jelas.

Praktik: ketik `fin` untuk Finland, lalu `united` untuk beberapa hasil dan klik Show. Cuaca diminta hanya ketika satu negara ditampilkan. Koordinat memakai `capitalInfo.latlng`, bukan titik tengah negara. Jika koordinat ibu kota tidak tersedia, aplikasi menjelaskan bahwa cuaca tidak diminta. Perubahan negara membatalkan request lama agar respons sebelumnya tidak menimpa pilihan baru.

Cuaca menggunakan Open-Meteo tanpa API key untuk lab ini. Suhu, kecepatan angin, deskripsi kondisi, waktu, dan zona waktu ditampilkan bersama atribusi. Ini data model cuaca. Ketersediaan internet, layanan eksternal, dan kebijakan layanan memengaruhi hasil; error negara/cuaca punya tombol Retry. Pengujian otomatis memakai fixture API yang stabil, sedangkan pemeriksaan live dicatat terpisah dalam review.

## Pemetaan latihan

| Nomor | Implementasi final |
|---|---|
| 2.1 | Course dan daftar bagian dinamis |
| 2.2 | Total latihan |
| 2.3* | Total melalui reduce |
| 2.4 | Array beberapa course |
| 2.5 | Course pada modul terpisah |
| 2.6 | Formulir nama dan penambahan orang |
| 2.7 | Deteksi dan peringatan duplikat |
| 2.8 | Formulir nomor telepon |
| 2.9* | Filter nama tanpa membedakan kapital |
| 2.10 | Filter, PersonForm, Persons terpisah; state di App |
| 2.11 | db.json, json-server 3001, Axios GET dalam effect |
| 2.12 | Simpan dengan POST |
| 2.13 | Modul service HTTP |
| 2.14 | DELETE satu entri dengan konfirmasi |
| 2.15* | PUT penggantian nomor dengan konfirmasi |
| 2.16 | Notifikasi sukses sementara |
| 2.17* | Error 404 pada entri usang dan notifikasi berbeda |
| 2.18* | Pencarian negara, daftar, detail, bendera, bahasa |
| 2.19* | Tombol Show pada beberapa hasil |
| 2.20* | Cuaca ibu kota dari API |

Hasil akhir tiap kelompok disimpan dalam folder terpisah. Lab Brewtica tambahan membantu praktik dan tidak menggantikan aplikasi resmi.

## Pemeriksaan teknis dan sebelum submit

```sh
npm run build
npx playwright install chromium
npm test
```

Test CRUD dan 404 memakai HTTP fixture dalam memori. Test persistensi nyata hanya menambahkan entri `Persistence Demo <UUID>` dan membiarkannya tersimpan, tanpa mereset atau menghapus entri lain. File runtime tidak masuk Git.

Sebelum submission: baca materi resmi, praktikkan alurnya, jelaskan sendiri kapan input/state/server/DOM berubah, lalu konfirmasikan review dan waktu belajar khusus Part 2. Jangan menyalin ulang waktu 3 jam Part 0–1. Persiapan asisten tidak berarti peserta otomatis sudah memahami. Bantuan AI perlu diungkapkan pada komentar submission. Pengiriman Part 2 mengunci pilihan nomor pada portal; saat ini tidak ada pengiriman baru.

## Sumber resmi

- [Rendering collections, modules](https://fullstackopen.com/en/part2/rendering_a_collection_modules/)
- [Forms](https://fullstackopen.com/en/part2/forms/)
- [Getting data from server](https://fullstackopen.com/en/part2/getting_data_from_server/)
- [Altering data in server](https://fullstackopen.com/en/part2/altering_data_in_server/)
- [Styles, errors, Countries](https://fullstackopen.com/en/part2/adding_styles_to_react_app/)
- [Helsinki Rest Countries](https://studies.cs.helsinki.fi/restcountries/)
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [JSON Server](https://github.com/typicode/json-server)
