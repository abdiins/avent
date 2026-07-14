# Product Requirement Document (PRD)

## 1. Project Overview
- **Nama Aplikasi:** Avent 
- **Latar Belakang Masalah:** Pengelolaan acara (event) seringkali terkendala oleh proses pendaftaran yang manual dan pelacakan tiket yang tidak efisien. Penyelenggara kesulitan memantau sisa kuota dan daftar peserta secara realtime, sementara peserta membutuhkan platform yang mudah dan cepat untuk menemukan event serta mendapatkan tiket digital secara instan.
- **Target Pengguna:**
  - **Penyelenggara Event (Admin):** Pihak yang ingin mempublikasikan, memanajemen, dan memonitor jalannya sebuah acara.
  - **Peserta (User):** Individu yang ingin mencari, mendaftar, dan mendapatkan tiket digital untuk berpartisipasi dalam suatu acara.

## 2. User Personas & User Flow
**User Personas:**
1. **Admin (Penyelenggara):** Membutuhkan akses untuk membuat event baru, mengelola detail acara, menentukan kapasitas/kuota, dan melihat daftar peserta yang telah mendaftar.
2. **Peserta (User):** Membutuhkan antarmuka yang modern dan responsif untuk melihat daftar event yang tersedia, melakukan pendaftaran (booking), dan mendapatkan kode tiket digital.

**User Flow:**
- **Alur Peserta (User):**
  1. Pengguna membuka halaman utama (Landing Page).
  2. Pengguna menavigasi ke halaman 'Jelajahi Event' untuk melihat daftar event yang sedang aktif.
  3. Pengguna melakukan pembuatan akun (Register) atau Masuk (Login).
  4. Pengguna memilih salah satu event dan mengklik tombol pendaftaran.
  5. Sistem memvalidasi ketersediaan kuota dan mencatat pendaftaran.
  6. Pengguna menerima kode tiket unik (Ticket Code) sebagai bukti pendaftaran.
- **Alur Admin:**
  1. Admin melakukan Login dengan akun ber-role ADMIN.
  2. Admin masuk ke halaman Dashboard Manajemen.
  3. Admin dapat membuat event baru (Create), mengedit detail event (Update), atau menghapus event (Delete).
  4. Admin dapat melihat daftar peserta yang mendaftar pada setiap event dan melacak status check-in.

## 3. Functional Requirements
| ID Fitur | Nama Fitur | Deskripsi Perilaku | Status |
|---|---|---|---|
| FR-01 | Autentikasi Pengguna | Pengguna dapat melakukan registrasi dan login. Memiliki pemisahan hak akses (Role: Admin & Peserta). | Wajib |
| FR-02 | Manajemen Event (CRUD) | Admin dapat membuat, membaca detail, memperbarui, dan menghapus data event. | Wajib |
| FR-03 | Katalog Event | Peserta dapat melihat daftar seluruh event yang tersedia dengan tampilan grid yang interaktif. | Wajib |
| FR-04 | Pendaftaran Event | Peserta dapat mendaftar ke suatu event dan sistem mengurangi/memvalidasi kuota secara otomatis. | Wajib |
| FR-05 | Pembuatan Tiket Digital | Sistem men-generate kode tiket unik (`ticketCode`) untuk setiap pendaftaran yang berhasil. | Wajib |
| FR-06 | Dashboard Admin | Halaman khusus admin untuk memonitor daftar event dan partisipasi peserta. | Wajib |

## 4. Non-Functional Requirements
- **Teknologi (Stack):**
  - **Frontend:** Next.js (React.js) dengan App Router, CSS murni dengan pendekatan desain Glassmorphism dan tipografi modern (Space Grotesk, Bebas Neue, Syne).
  - **Backend:** Next.js API Routes / Server Actions.
  - **Database:** MySQL (Relational Database).
  - **ORM (Object-Relational Mapping):** Prisma.
  - **Autentikasi:** NextAuth.js.
- **Ketentuan Keamanan:**
  - **Enkripsi Password:** Menggunakan algoritma *hashing* untuk mengenkripsi password pengguna sebelum disimpan di database (misalnya bcrypt).
  - **Validasi Input:** Validasi form di sisi klien untuk UX dan validasi di sisi server untuk mencegah serangan injeksi data.
  - **Proteksi Rute (Protected Routes):** Pembatasan akses halaman dashboard hanya untuk pengguna dengan role ADMIN, serta pengamanan endpoint API.
  - **Integritas Data:** Penggunaan *unique constraints* pada database (misal: satu user hanya bisa mendaftar satu kali pada event yang sama).

## 5. Database Schema (Rancangan Tabel)
Berikut adalah struktur tabel berdasarkan Prisma Schema yang mendasari aplikasi ini:

**1. Tabel `User`**
Menyimpan data autentikasi dan profil pengguna.
- `id` (String, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `passwordHash` (String) - *Password yang telah di-hash*
- `role` (Enum: `ADMIN`, `PESERTA`) - *Default: PESERTA*
- `createdAt` (DateTime)

**2. Tabel `Event`**
Menyimpan informasi detail mengenai acara yang dibuat oleh Admin.
- `id` (String, Primary Key)
- `name` (String)
- `description` (Text)
- `date` (DateTime) - *Tanggal pelaksanaan acara*
- `time` (String) - *Waktu acara (format HH:MM)*
- `location` (String)
- `quota` (Int) - *Kapasitas maksimal peserta*
- `createdAt` (DateTime)
- `createdById` (String, Foreign Key ke `User.id`) - *Relasi ke pembuat acara*

**3. Tabel `Registration`**
Menyimpan data transaksi/pendaftaran peserta ke suatu event.
- `id` (String, Primary Key)
- `userId` (String, Foreign Key ke `User.id`)
- `eventId` (String, Foreign Key ke `Event.id`)
- `ticketCode` (String, Unique) - *Kode unik tiket untuk check-in*
- `status` (Enum: `REGISTERED`, `CHECKED_IN`) - *Default: REGISTERED*
- `registeredAt` (DateTime)
- **Constraint:** Kombinasi `userId` dan `eventId` bersifat *unique* (Peserta tidak bisa mendaftar dua kali di event yang sama).

---
*Dokumen ini disusun sebagai Product Requirement Document (PRD) untuk memenuhi persyaratan Ujian Akhir Semester (UAS).*
