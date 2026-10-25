'use client';

import React, { useState, useEffect } from 'react';
import { Aspirasi, StatusAspirasi, TanggapanResmi } from '@/types';
import { X, ShieldCheck, CheckCircle2, Clock, XCircle, AlertCircle, Save } from 'lucide-react';

interface AdminActionModalProps {
  aspirasi: Aspirasi | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newStatus: StatusAspirasi, tanggapan?: TanggapanResmi) => void;
}

export const AdminActionModal: React.FC<AdminActionModalProps> = ({
  aspirasi,
  isOpen,
  onClose,
  onSave,
}) => {
  const [status, setStatus] = useState<StatusAspirasi>('Menunggu Verifikasi');
  const [penanggap, setPenanggap] = useState('BEM Universitas - Dept. Advokasi Mahasiswa');
  const [jabatan, setJabatan] = useState('Menteri Advokasi & Kesejahteraan');
  const [pesanTanggapan, setPesanTanggapan] = useState('');

  useEffect(() => {
    if (aspirasi) {
      setStatus(aspirasi.status);
      if (aspirasi.tanggapanResmi) {
        setPenanggap(aspirasi.tanggapanResmi.penanggap);
        setJabatan(aspirasi.tanggapanResmi.jabatan);
        setPesanTanggapan(aspirasi.tanggapanResmi.pesan);
      } else {
        setPesanTanggapan('');
      }
    }
  }, [aspirasi]);

  if (!isOpen || !aspirasi) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    const tanggapanPayload: TanggapanResmi | undefined = pesanTanggapan.trim()
      ? {
          penanggap: penanggap.trim(),
          jabatan: jabatan.trim(),
          pesan: pesanTanggapan.trim(),
          tanggal: today,
        }
      : undefined;

    onSave(aspirasi.id, status, tanggapanPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Kelola Tindak Lanjut Aspirasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aksi Pengelola: BEM & Biro Terkait
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Aspiration Info */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
            Tiket Aspirasi
          </span>
          <p className="font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
            {aspirasi.judul}
          </p>
          <p className="text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
            {aspirasi.deskripsi}
          </p>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Ubah Status Penanganan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  'Menunggu Verifikasi',
                  'Sedang Ditindaklanjuti',
                  'Selesai',
                  'Ditolak',
                ] as StatusAspirasi[]
              ).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    status === st
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    {st === 'Selesai' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {st === 'Sedang Ditindaklanjuti' && (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {st === 'Ditolak' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    {st === 'Menunggu Verifikasi' && (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{st}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Official Response Form */}
          <div className="pt-2 space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tulis / Perbarui Tanggapan Resmi
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Nama Biro / Organisasi Penanggap
                </label>
                <input
                  type="text"
                  value={penanggap}
                  onChange={(e) => setPenanggap(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Jabatan / Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Pernyataan Tindak Lanjut / Solusi yang Diberikan
              </label>
              <textarea
                rows={3}
                value={pesanTanggapan}
                onChange={(e) => setPesanTanggapan(e.target.value)}
                placeholder="Contoh: Laporan telah kami teruskan ke Biro Sarpras. Rencana perbaikan dijadwalkan pada hari Jumat..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
