# Dashboard Lembaga Rayuan Negeri Selangor 2026

Dashboard statik responsif berdasarkan fail Excel **SENARAI PERMOHONAN LR 2026 (DASHBOARD) (1).xlsx**, dengan gaya visual berinspirasikan mockup pengguna.

## Kandungan
- KPI jumlah rayuan, keputusan, belum ada keputusan, pendengaran dan tempoh purata
- Carta trend bulanan, status, jenis rayuan, taburan mengikut PBT
- Penapis bulan, PBT, jenis; carian rekod; dialog perincian kes
- Jadual tarikh pendengaran, keputusan dan eksport CSV

## Jalankan di komputer
Jalankan pelayan HTTP dari folder ini, misalnya `python -m http.server 8000`, kemudian buka `http://localhost:8000`.

## Terbitkan melalui GitHub Pages
1. Cipta repositori baharu di GitHub (sebaiknya **private** dahulu kerana fail mungkin mengandungi nama individu dan butiran kes).
2. Muat naik `index.html`, `style.css`, `app.js` dan `data.json` ke akar repositori.
3. Semak kesesuaian penerbitan data dengan dasar jabatan, serta dapatkan kebenaran sebelum menjadikan repositori **public**.
4. Untuk repositori public yang diluluskan, buka **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.

## Nota integriti data
- Semua 14 rekod diambil daripada baris bernombor dalam helaian `LR 2026`; tiada angka simulasi digunakan.
- `TIADA MAKLUMAT` dianggap **belum ada keputusan**, bukannya semestinya kes masih aktif.
- `TARIK DIRI` dikira sebagai rekod yang mempunyai keputusan/status, bukan keputusan rayuan yang dibenarkan.
- Purata tempoh hanya dikira jika tarikh rayuan dan keputusan tersedia; tarikh pendengaran berulang ditunjukkan sebagai entri berasingan.
- Tiada penyegerakan automatik dengan Excel; jana semula `data.json` apabila rekod berubah.
- Logo rasmi dan peta PBT tidak disertakan kerana aset/sumber GIS yang disahkan belum dibekalkan.

## Privasi data untuk laman awam
`data.json` mengandungi hanya bilangan kes, tarikh, PBT, jenis, status dan tarikh pendengaran/keputusan. Nama perayu, alamat, tajuk permohonan dan ahli panel tidak dipaparkan. **Perhatian:** versi awal `data.json` pernah dimuat naik ke sejarah git bagi repositori awam; memadam data daripada versi terkini **tidak memadam sejarah Git**. Pentadbir perlu menilai keperluan penyusunan semula sejarah repositori atau migrasi ke repositori baharu dan mendapatkan nasihat pegawai keselamatan maklumat. Jangan simpan data terperingkat atau maklumat peribadi dalam GitHub Pages awam.

## Peta sempadan PBT
Peta interaktif menggunakan geometri sempadan PBT Selangor yang dipermudahkan daripada fail GeoJSON dibekalkan. 12 kawasan PBT dipaparkan, termasuk kawasan yang mempunyai sifar rayuan. Klik kawasan atau senarai PBT untuk menapis carta, KPI dan jadual. Data bilangan kes diperoleh daripada `data.json`, bukannya angka rekaan. Bentuk geometri telah dipermudahkan untuk prestasi paparan; **bukan peta ukur atau rujukan sempadan perundangan**. Jangan terbitkan data kes peribadi di laman awam.
