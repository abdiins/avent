# avent

Platform manajemen event dengan pendaftaran peserta dan check-in berbasis kode tiket digital.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: PostgreSQL + Prisma ORM 7
- **Autentikasi**: NextAuth.js (Credentials Provider + bcrypt)
- **Styling**: Tailwind CSS 4 + Vanilla CSS
- **Validasi**: Zod 4
- **QR Code**: qrcode.react (client-side)

## Fitur

- ✅ **Autentikasi** — Register & Login dengan role Admin dan Peserta
- ✅ **CRUD Event** — Admin membuat, mengedit, dan menghapus event
- ✅ **Pendaftaran Event** — Peserta mendaftar ke event dengan validasi kuota
- ✅ **Tiket Digital QR** — Kode unik & QR Code otomatis dibuat saat pendaftaran
- ✅ **Check-in Peserta** — Admin input kode tiket untuk verifikasi kehadiran
- ✅ **Dashboard Statistik** — Ringkasan pendaftar vs hadir per event
- ✅ **Riwayat Peserta** — Halaman "Tiket Saya" untuk melihat semua tiket

## Prasyarat

- Node.js 18+
- PostgreSQL (lokal atau cloud: [Neon](https://neon.tech) / [Railway](https://railway.app))

## Cara Menjalankan di Lokal

### 1. Clone & Install Dependency

```bash
cd eventflow
npm install
```

### 2. Setup Environment Variables

Salin file `.env.example` menjadi `.env`, lalu isi dengan konfigurasi Anda:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random_string_minimal_32_karakter"
```

> **Tip**: Generate NEXTAUTH_SECRET dengan `openssl rand -base64 32`

### 3. Migrasi Database

```bash
npx prisma migrate dev --name init
```

Ini akan membuat tabel `User`, `Event`, dan `Registration` di database PostgreSQL Anda.

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 5. Mulai Menggunakan

1. **Buat akun Admin**: Register di `/register`, pilih role "Admin / Panitia"
2. **Buat Event**: Login sebagai Admin → Kelola Event → Buat Event Baru
3. **Buat akun Peserta**: Register akun baru dengan role "Peserta"
4. **Daftar Event**: Login sebagai Peserta → Jelajahi Event → Daftar
5. **Lihat Tiket**: Buka "Tiket Saya" untuk melihat QR Code tiket
6. **Check-in**: Login sebagai Admin → Check-in → Masukkan kode tiket

## Struktur Folder

```
eventflow/
├── prisma/
│   └── schema.prisma         # Skema database
├── src/
│   ├── app/
│   │   ├── api/               # API Routes (backend)
│   │   │   ├── auth/          # NextAuth & Register
│   │   │   ├── events/        # CRUD Event
│   │   │   ├── registrations/ # Pendaftaran & Tiket
│   │   │   ├── check-in/      # Check-in peserta
│   │   │   └── admin/         # Statistik admin
│   │   ├── admin/             # Halaman admin
│   │   ├── user/              # Halaman peserta
│   │   ├── events/            # Halaman event publik
│   │   ├── login/             # Halaman login
│   │   ├── register/          # Halaman register
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Stylesheet global
│   │   └── page.tsx           # Landing page
│   ├── components/            # Komponen React
│   ├── lib/                   # Konfigurasi & utilitas
│   └── types/                 # Augmentasi tipe TypeScript
├── .env.example               # Contoh env variables
└── README.md                  # Dokumentasi ini
```

## Deploy ke Vercel

1. Push code ke GitHub
2. Buat project baru di [Vercel](https://vercel.com)
3. Set environment variables (`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`)
4. Vercel akan otomatis build dan deploy

> **Catatan**: Untuk database, gunakan [Neon](https://neon.tech) (gratis) untuk PostgreSQL serverless.

## Lisensi

Project ini dibuat untuk keperluan UAS Pemrograman Web 2.
