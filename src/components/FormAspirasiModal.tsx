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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Sampaikan Aspirasi Baru
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Suaramu akan diteruskan ke perwakilan BEM dan unit kampus terkait
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 flex items-center space-x-2 text-xs text-red-600 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Judul Aspirasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Judul Aspirasi / Pokok Keluhan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: AC Gedung B Lantai 2 Sering Mati dan Bocor"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Kategori & Urgensi Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as KategoriAspirasi)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Fasilitas & Sarpras">Fasilitas & Sarpras</option>
                <option value="Akademik & Perkuliahan">Akademik & Perkuliahan</option>
                <option value="UKT & Finansial">UKT & Finansial</option>
                <option value="Keamanan & Lingkungan">Keamanan & Lingkungan</option>
                <option value="Kemahasiswaan & BEM">Kemahasiswaan & BEM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tingkat Urgensi
              </label>
              <select
                value={urgensi}
                onChange={(e) => setUrgensi(e.target.value as TingkatUrgensi)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Rendah">Rendah (Usulan Santai)</option>
                <option value="Sedang">Sedang (Perlu Perhatian)</option>
                <option value="Tinggi">Tinggi (Mengganggu Perkuliahan)</option>
                <option value="Darurat">Darurat (Membahayakan/Kritis)</option>
              </select>
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Lokasi Kejadian / Ruang (Opsional)
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Gedung Kuliah Bersama Lt. 3 Ruang 304"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Deskripsi Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Deskripsi Masalah & Harapan Solusi <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan secara kronologis masalah yang dihadapi dan apa yang diharapkan dari pihak kampus..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Lampiran Gambar (URL / Preset) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              <span>Foto Bukti Lampiran (Opsional)</span>
            </div>
            <input
              type="url"
              value={lampiranUrl}
              onChange={(e) => setLampiranUrl(e.target.value)}
              placeholder="Tempel tautan gambar (https://...) atau pilih contoh di bawah"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
            {/* Quick preset picker */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_IMAGES.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setLampiranUrl(img.url)}
                  className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                    lampiranUrl === img.url
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Anonim Toggle */}
          <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Kirim sebagai Mahasiswa Anonim
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nama & NIM Anda tidak akan ditampilkan ke publik maupun pengelola
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonim}
                onChange={(e) => setIsAnonim(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </label>

            {/* Non-anonymous Inputs */}
            {!isAnonim && (
              <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama mahasiswa"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    NIM / Nomor Pokok Mahasiswa *
                  </label>
                  <input
                    type="text"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 2201849102"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Fakultas
                  </label>
                  <input
                    type="text"
                    value={fakultas}
                    onChange={(e) => setFakultas(e.target.value)}
                    placeholder="Contoh: Fakultas Teknik"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Program Studi
                  </label>
                  <input
                    type="text"
                    value={prodi}
                    onChange={(e) => setProdi(e.target.value)}
                    placeholder="Contoh: Teknik Informatika"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Aspirasi Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
