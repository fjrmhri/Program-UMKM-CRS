<p align="center">
  <img src="https://img.shields.io/github/stars/fjrmhri/Program-UMKM-CRS?style=for-the-badge&logo=github&color=8b5cf6" alt="Stars"/>
  <img src="https://img.shields.io/github/license/fjrmhri/Program-UMKM-CRS?style=for-the-badge&color=10b981" alt="License"/>
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/Firebase-12.0.0-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-38bdf8?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS"/>
</p>

# Program UMKM CSR Dashboard

Dashboard web untuk memantau pembukuan dan perkembangan UMKM binaan Program CSR RAPP Estate Cerenti. Aplikasi dibangun dengan React + Vite dan terhubung ke Firebase untuk autentikasi serta penyimpanan realtime sehingga mitra dapat memasukkan data monitoring, melihat tren, dan mencatat tindak lanjut.

## Fitur Utama

- **Autentikasi mitra** dengan alur login/registrasi berbasis nomor HP (email pseudo).
- **Pencatatan monitoring MSE** lengkap dengan kalkulasi otomatis omset, biaya operasional, dan klasifikasi usaha.
- **Grafik perkembangan** menggunakan Recharts untuk membaca tren omset.
- **Catatan pribadi** bagi pendamping/mitra agar tindak lanjut mudah dilacak.
- **Antarmuka responsif** yang nyaman diakses di desktop maupun perangkat mobile.

## Persyaratan

- Node.js 18+ dan npm 9+
- Proyek Firebase dengan Authentication dan Realtime Database aktif

## Cara Instalasi & Menjalankan

1. **Kloning repositori** dan masuk ke folder proyek.
2. **Instal dependensi**:
   ```bash
   npm install
   ```
3. **Siapkan environment** (lihat bagian berikut).
4. **Jalankan pengembangan**:
   ```bash
   npm run dev
   ```
   Aplikasi akan tersedia di `http://localhost:5173` secara default.

Untuk build produksi, gunakan `npm run build` lalu `npm run preview` untuk pratinjau lokal.

## Konfigurasi Environment

Buat berkas `.env` atau `.env.local` di akar proyek dengan kredensial Firebase Anda:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Pastikan Realtime Database menggunakan rules yang sesuai kebutuhan keamanan program CSR.

## Struktur Proyek

```
src/
├── assets/                # Logo dan aset statis
├── components/            # Komponen UI (auth, dashboard, modal)
├── context/               # Context React untuk autentikasi
├── pages/                 # Halaman Login & Sign Up
├── firebase.js            # Inisialisasi Firebase
├── App.jsx                # Routing utama
└── main.jsx               # Entry point React
```

## Skrip NPM

- `npm run dev` – Menjalankan server pengembangan Vite.
- `npm run build` – Membuat build produksi.
- `npm run preview` – Menjalankan pratinjau build produksi.
- `npm run lint` – Mengecek gaya kode dengan ESLint.

## Lisensi

Proyek ini ditujukan untuk operasional internal Program CSR. Silakan hubungi maintainer sebelum menggunakan atau mendistribusikan ulang kode sumber.
