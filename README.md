# 📢 SuaraMahasiswa — Portal Aspirasi & Advokasi Mahasiswa Kampus

Aplikasi web modern untuk menampung kritik, saran, laporan fasilitas, dan aspirasi kebijakan kampus secara transparan dengan perlindungan privasi dan hak bersuara mahasiswa.

Dibuat dengan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, dan **Lucide React**.

---

## ✨ Fitur Utama

1. **Feed Aspirasi Interaktif:**
   - Pencarian real-time berdasarkan kata kunci, judul, deskripsi, atau nama gedung.
   - Filter Kategori: *Fasilitas & Sarpras*, *Akademik & Perkuliahan*, *UKT & Finansial*, *Keamanan & Lingkungan*, *Kemahasiswaan & BEM*.
   - Filter Status: *Menunggu Verifikasi*, *Sedang Ditindaklanjuti*, *Selesai*, *Ditolak*.
   - Pengurutan (*Sorting*): Terpopuler (*Upvotes* terbanyak), Terbaru, dan Paling Mendesak (*Urgensi Darurat/Tinggi*).

2. **Sistem Upvote / Dukungan Suara:**
   - Satu klik untuk memberikan dukungan pada aspirasi mahasiswa lain agar naik ke jajaran prioritas advokasi.

3. **Formulir Aspirasi Ramah Privasi:**
   - **Fitur 100% Anonim:** Mahasiswa dapat menyembunyikan identitas diri (Nama & NIM tidak dipublikasikan).
   - Opsi pengisian identitas resmi (Nama, NIM, Fakultas, Prodi) bagi yang berkenan.
   - Lampiran foto bukti keluhan (dengan pilihan preset foto fasilitas kampus).

4. **Ruang Diskusi & Komentar:**
   - Mahasiswa lain dapat memberikan masukan tambahan atau memperkuat fakta lapangan (bisa anonim maupun bernama).

5. **Panel Pengelola / Mode Admin BEM:**
   - Tombol toggle **"Masuk Mode Admin"** di Navbar untuk simulasi peran pihak advokasi kampus/BEM.
   - Ubah status tiket aspirasi secara langsung (*Menunggu Verifikasi* ➔ *Sedang Ditindaklanjuti* ➔ *Selesai*).
   - Kirimkan **Tanggapan Resmi** yang akan berlabel terverifikasi di kartu dan detail aspirasi.

6. **Database Cloud Neon PostgreSQL & Auto-Fallback:**
   - Terintegrasi penuh dengan **Neon Serverless PostgreSQL** via `@neondatabase/serverless`.
   - Auto-migration & auto-seed: tabel SQL (`aspirasi`, `komentar`, `aspirasi_upvotes`) dan data sampel akan otomatis terbuat saat pertama kali terhubung.
   - Dilengkapi *smart fallback*: jika `DATABASE_URL` belum diisi, aplikasi otomatis berjalan dalam mode *LocalStorage*, sehingga web tidak pernah error/blank.

---

## 🗄️ Konfigurasi Database (Neon PostgreSQL)

1. Buka [neon.tech](https://neon.tech) dan buat akun gratis.
2. Buat project baru (misal: `suara-mahasiswa`).
3. Salin **Connection String** PostgreSQL yang diberikan oleh Neon.
4. Buat file `.env.local` di root folder (bisa copy dari `.env.example`) dan isi:
   ```env
   DATABASE_URL="postgresql://neondb_owner:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
5. Simpan file, lalu restart server dev (`npm run dev`). Status di Navbar akan otomatis berubah menjadi `🟢 Neon DB`.

---

## 🚀 Cara Menjalankan Secara Lokal

1. Buka terminal di folder project:
   ```bash
   npm run dev
   ```

2. Buka browser dan akses:
   [http://localhost:3000](http://localhost:3000)

---

## 🌐 Panduan Deploy Gratis ke Vercel

Karena aplikasi ini dibangun dengan **Next.js**, deployment ke Vercel sangat mudah:

1. Buat repositori baru di GitHub (misal: `web-aspirasi-mahasiswa`).
2. Masukkan kode ke GitHub:
   ```bash
   git add .
   git commit -m "feat: integrasi Neon PostgreSQL dan portal aspirasi mahasiswa"
   git branch -M main
   git remote add origin https://github.com/USERNAME_KAMU/web-aspirasi-mahasiswa.git
   git push -u origin main
   ```
3. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub kamu.
4. Klik tombol **"Add New Project"** ➔ Pilih repositori GitHub tadi.
5. Pada bagian **Environment Variables** di halaman setup Vercel, tambahkan:
   - Key: `DATABASE_URL`
   - Value: *(Paste connection string Neon PostgreSQL kamu)*
6. Klik **"Deploy"**.
7. Web kamu langsung aktif dengan link publik gratis (contoh: `https://web-aspirasi-mahasiswa.vercel.app`)! 🎉

