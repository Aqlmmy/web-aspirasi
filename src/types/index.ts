export type KategoriAspirasi =
  | 'Fasilitas & Sarpras'
  | 'Akademik & Perkuliahan'
  | 'UKT & Finansial'
  | 'Keamanan & Lingkungan'
  | 'Kemahasiswaan & BEM';

export type StatusAspirasi =
  | 'Menunggu Verifikasi'
  | 'Sedang Ditindaklanjuti'
  | 'Selesai'
  | 'Ditolak';

export type TingkatUrgensi = 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';

export interface Penulis {
  nama: string;
  nim: string;
  fakultas: string;
  prodi: string;
}

export interface TanggapanResmi {
  penanggap: string;
  jabatan: string;
  pesan: string;
  tanggal: string;
}

export interface Komentar {
  id: string;
  nama: string;
  isAnonim: boolean;
  pesan: string;
  tanggal: string;
}

export type UserRole = 'mahasiswa' | 'admin';

export interface User {
  id: string;
  nama: string;
  email: string;
  nim?: string;
  fakultas?: string;
  prodi?: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface Aspirasi {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: KategoriAspirasi;
  status: StatusAspirasi;
  urgensi: TingkatUrgensi;
  isAnonim: boolean;
  penulis?: Penulis;
  lokasi?: string;
  tanggal: string;
  upvotes: number;
  hasUpvoted?: boolean;
  lampiranUrl?: string;
  tanggapanResmi?: TanggapanResmi;
  komentar: Komentar[];
  userId?: string;
}

