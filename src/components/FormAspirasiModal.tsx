'use client';

import React, { useState } from 'react';
import { KategoriAspirasi, TingkatUrgensi, Aspirasi } from '@/types';
import { X, ShieldCheck, Send, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface FormAspirasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: Omit<Aspirasi, 'id' | 'tanggal' | 'upvotes' | 'hasUpvoted' | 'status' | 'komentar'>) => void;
}

const PRESET_IMAGES = [
  { label: 'Fasilitas Kelas / Meja Kursi', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pendingin Ruangan / AC', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
  { label: 'Area Parkir & Jalan Kampus', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80' },
  { label: 'Perpustakaan & Laboratorium', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80' },
];

export const FormAspirasiModal: React.FC<FormAspirasiModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<KategoriAspirasi>('Fasilitas & Sarpras');
  const [urgensi, setUrgensi] = useState<TingkatUrgensi>('Sedang');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isAnonim, setIsAnonim] = useState(true);
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [fakultas, setFakultas] = useState('');
  const [prodi, setProdi] = useState('');
  const [lampiranUrl, setLampiranUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !deskripsi.trim()) {
      setErrorMsg('Mohon isi Judul Aspirasi dan Deskripsi Keluhan.');
      return;
    }

    if (!isAnonim && (!nama.trim() || !nim.trim())) {
      setErrorMsg('Jika tidak anonim, Nama Lengkap dan NIM wajib diisi.');
      return;
    }

    setErrorMsg('');
    onSubmit({
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      kategori,
      urgensi,
      isAnonim,
      lokasi: lokasi.trim() || undefined,
      lampiranUrl: lampiranUrl.trim() || undefined,
      penulis: isAnonim
        ? undefined
        : {
            nama: nama.trim(),
            nim: nim.trim(),
            fakultas: fakultas.trim() || 'Fakultas Umum',
            prodi: prodi.trim() || 'Program Studi',
          },
    });

    // Reset Form
    setJudul('');
    setDeskripsi('');
    setLokasi('');
    setNama('');
    setNim('');
    setFakultas('');
    setProdi('');
    setLampiranUrl('');
    setIsAnonim(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-xl p-6 my-8 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Formulir Aspirasi Mahasiswa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Laporan akan diterima oleh departemen advokasi BEM KM
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3.5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Judul Aspirasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Aspirasi / Pokok Masalah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Lampu dan Proyektor Ruang 304 Gedung B Rusak"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Kategori & Urgensi Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as KategoriAspirasi)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="Fasilitas & Sarpras">Fasilitas & Sarpras</option>
                <option value="Akademik & Perkuliahan">Akademik & Perkuliahan</option>
                <option value="UKT & Finansial">UKT & Finansial</option>
                <option value="Keamanan & Lingkungan">Keamanan & Lingkungan</option>
                <option value="Kemahasiswaan & BEM">Kemahasiswaan & BEM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Urgensi
              </label>
              <select
                value={urgensi}
                onChange={(e) => setUrgensi(e.target.value as TingkatUrgensi)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="Rendah">Rendah (Usulan Biasa)</option>
                <option value="Sedang">Sedang (Perlu Perhatian)</option>
                <option value="Tinggi">Tinggi (Mengganggu Belajar)</option>
                <option value="Darurat">Darurat (Membahayakan/Kritis)</option>
              </select>
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lokasi / Ruang Spesifik (Opsional)
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Gedung Kuliah Bersama Lt. 3 Ruang 304"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Deskripsi Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Detail & Harapan Solusi <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan kendala yang dialami secara rinci dan apa perbaikan yang diharapkan dari pihak kampus..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 leading-relaxed"
            />
          </div>

          {/* Lampiran Gambar */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span>Foto / Bukti Lampiran (Opsional)</span>
            </div>
            <input
              type="url"
              value={lampiranUrl}
              onChange={(e) => setLampiranUrl(e.target.value)}
              placeholder="Tempel link URL foto atau pilih contoh di bawah"
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            {/* Quick preset picker */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {PRESET_IMAGES.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setLampiranUrl(img.url)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    lampiranUrl === img.url
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Anonim Toggle */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Sampaikan secara Anonim
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Identitas Anda tidak akan dicantumkan pada tiket publik
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonim}
                onChange={(e) => setIsAnonim(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
            </label>

            {/* Non-anonymous Inputs */}
            {!isAnonim && (
              <div className="pt-2.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama mahasiswa"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    NIM *
                  </label>
                  <input
                    type="text"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Nomor Pokok Mahasiswa"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Fakultas
                  </label>
                  <input
                    type="text"
                    value={fakultas}
                    onChange={(e) => setFakultas(e.target.value)}
                    placeholder="Contoh: Fakultas Teknik"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Program Studi
                  </label>
                  <input
                    type="text"
                    value={prodi}
                    onChange={(e) => setProdi(e.target.value)}
                    placeholder="Contoh: Teknik Informatika"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Aspirasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
