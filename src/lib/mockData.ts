import { Aspirasi } from '@/types';

export const INITIAL_ASPIRASI: Aspirasi[] = [
  {
    id: 'asp-1',
    judul: 'AC Gedung Kuliah Bersama (GKB) Lantai 3 Sering Mati dan Bocor',
    deskripsi:
      'Sudah 3 minggu terakhir pendingin ruangan di ruang 302 dan 304 mati saat jam kuliah siang hari. Suhu ruangan sangat panas dan airnya menetes ke kursi baris belakang sehingga mengganggu konsentrasi belajar mahasiswa.',
    kategori: 'Fasilitas & Sarpras',
    status: 'Sedang Ditindaklanjuti',
    urgensi: 'Tinggi',
    isAnonim: true,
    lokasi: 'Gedung Kuliah Bersama (GKB) Lt. 3 Ruang 302-304',
    tanggal: '2026-10-23',
    upvotes: 48,
    hasUpvoted: false,
    lampiranUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    tanggapanResmi: {
      penanggap: 'Biro Sarana dan Prasarana (Sarpras)',
      jabatan: 'Koordinator Pemeliharaan Gedung',
      pesan:
        'Laporan telah diterima. Teknisi AC telah dijadwalkan untuk melakukan servis kompresor dan penggantian pipa freon pada hari Sabtu akhir pekan ini.',
      tanggal: '2026-10-24',
    },
    komentar: [
      {
        id: 'c-1',
        nama: 'Mahasiswa FEB',
        isAnonim: true,
        pesan: 'Bener banget, pas ujian kemarin gerah banget sampe baju basah kuyup.',
        tanggal: '2026-10-23',
      },
      {
        id: 'c-2',
        nama: 'Rifki Pratama',
        isAnonim: false,
        pesan: 'Semoga segera diperbaiki sebelum minggu UTS dimulai.',
        tanggal: '2026-10-24',
      },
    ],
  },
  {
    id: 'asp-2',
    judul: 'Permohonan Transparansi dan Skema Cicilan Penurunan Golongan UKT Semester Genap',
    deskripsi:
      'Banyak rekan mahasiswa yang orang tuanya terdampak pemutusan kerja belum mendapatkan kejelasan syarat banding UKT. Kami memohon pihak Rektorat dan Bagian Keuangan memberikan SOP terbuka serta opsi cicilan bertahap.',
    kategori: 'UKT & Finansial',
    status: 'Menunggu Verifikasi',
    urgensi: 'Darurat',
    isAnonim: false,
    penulis: {
      nama: 'Dimas Satria',
      nim: '2201849102',
      fakultas: 'Ilmu Sosial & Ilmu Politik',
      prodi: 'Administrasi Publik',
    },
    lokasi: 'Gedung Rektorat & Portal Akademik',
    tanggal: '2026-10-24',
    upvotes: 112,
    hasUpvoted: false,
    komentar: [
      {
        id: 'c-3',
        nama: 'Anonim',
        isAnonim: true,
        pesan: 'Dukung penuh! Batas bayar mepet tapi pengumuman verifikasi dokumen lama banget.',
        tanggal: '2026-10-24',
      },
      {
        id: 'c-4',
        nama: 'Siti Nurhaliza',
        isAnonim: false,
        pesan: 'Tolong BEM Universitas bantu audiensi langsung ke bagian keuangan.',
        tanggal: '2026-10-25',
      },
    ],
  },
  {
    id: 'asp-3',
    judul: 'Koneksi Wi-Fi Kampus "Edu-Connect" di Perpustakaan Pusat Sangat Lemot',
    deskripsi:
      'Kecepatan download sering di bawah 1 Mbps dan login portal sering looping (*session timeout*). Padahal perpustakaan menjadi tempat utama mahasiswa mencari referensi jurnal dan mengerjakan skripsi.',
    kategori: 'Fasilitas & Sarpras',
    status: 'Selesai',
    urgensi: 'Sedang',
    isAnonim: true,
    lokasi: 'Perpustakaan Pusat Lantai 1 & 2',
    tanggal: '2026-10-18',
    upvotes: 76,
    hasUpvoted: false,
    tanggapanResmi: {
      penanggap: 'Pusat Teknologi Informasi & Komunikasi (PTIK)',
      jabatan: 'Kepala Infrastruktur Jaringan',
      pesan:
        'Bandwidth access point perpustakaan telah dinaikkan dari 100 Mbps menjadi 500 Mbps dan switch router telah direfresh per 21 Oktober. Silakan login ulang menggunakan akun SSO kampus.',
      tanggal: '2026-10-21',
    },
    komentar: [
      {
        id: 'c-5',
        nama: 'Bayu A.',
        isAnonim: false,
        pesan: 'Sekarang sudah lancar buat buka IEEE dan ScienceDirect. Terima kasih respon cepatnya!',
        tanggal: '2026-10-22',
      },
    ],
  },
  {
    id: 'asp-4',
    judul: 'Penerangan Minim di Area Parkir Timur Menjelang Malam Hari',
    deskripsi:
      'Lampu sorot tiang di dekat pintu keluar parkir timur sudah padam berhari-hari. Area tersebut sangat gelap selepas pukul 18.00 WIB dan rawan tindak pencurian helm maupun insiden tersandung.',
    kategori: 'Keamanan & Lingkungan',
    status: 'Sedang Ditindaklanjuti',
    urgensi: 'Tinggi',
    isAnonim: true,
    lokasi: 'Area Parkir Timur Motor Kampus',
    tanggal: '2026-10-22',
    upvotes: 39,
    hasUpvoted: false,
    tanggapanResmi: {
      penanggap: 'Unit Satpam & Tata Usaha Umum',
      jabatan: 'Komandan Regu Keamanan Kampus',
      pesan:
        'Penggantian bohlam LED 100W sudah diajukan ke logistik. Sementara waktu, petugas pos 2 diinstruksikan melakukan patroli berkala setiap 45 menit.',
      tanggal: '2026-10-23',
    },
    komentar: [],
  },
  {
    id: 'asp-5',
    judul: 'Jadwal Ujian Akhir Semester (UAS) Bentrok Antara Mata Kuliah Wajib dan Pilihan',
    deskripsi:
      'Terdapat jadwal ujian di hari yang sama dan jam yang persis sama (Kamis 08.00 WIB) untuk MK Riset Operasional dan MK Pemrograman Web Lanjut bagi angkatan 2023. Mohon penyesuaian jadwal agar mahasiswa tidak dirugikan.',
    kategori: 'Akademik & Perkuliahan',
    status: 'Selesai',
    urgensi: 'Tinggi',
    isAnonim: false,
    penulis: {
      nama: 'Nabila Azzahra',
      nim: '2301992011',
      fakultas: 'Ilmu Komputer',
      prodi: 'Teknik Informatika',
    },
    lokasi: 'Subbag Akademik Fakultas',
    tanggal: '2026-10-15',
    upvotes: 64,
    hasUpvoted: false,
    tanggapanResmi: {
      penanggap: 'Tim Penjadwalan Akademik Fasilkom',
      jabatan: 'Sekretaris Program Studi',
      pesan:
        'Jadwal ujian MK Riset Operasional telah dipindahkan ke hari Jumat pukul 13.30 WIB. Kartu peserta ujian telah diperbarui di SIAKAD masing-masing.',
      tanggal: '2026-10-17',
    },
    komentar: [],
  },
];
