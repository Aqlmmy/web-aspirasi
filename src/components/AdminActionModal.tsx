'use client';

import React, { useState } from 'react';
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
  if (!isOpen || !aspirasi) return null;

  return (
    <AdminActionModalContent
      key={aspirasi.id}
      aspirasi={aspirasi}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

const AdminActionModalContent: React.FC<{
  aspirasi: Aspirasi;
  onClose: () => void;
  onSave: (id: string, newStatus: StatusAspirasi, tanggapan?: TanggapanResmi) => void;
}> = ({ aspirasi, onClose, onSave }) => {
  const [status, setStatus] = useState<StatusAspirasi>(aspirasi.status);
  const [penanggap, setPenanggap] = useState(
    aspirasi.tanggapanResmi?.penanggap || 'BEM KM — Departemen Advokasi & Kesejahteraan'
  );
  const [jabatan, setJabatan] = useState(
    aspirasi.tanggapanResmi?.jabatan || 'Tim Advokasi Kebijakan Kampus'
  );
  const [pesanTanggapan, setPesanTanggapan] = useState(
    aspirasi.tanggapanResmi?.pesan || ''
  );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl p-6 my-8 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tindak Lanjut Aspirasi Mahasiswa
              </h3>
              <p className="text-xs text-slate-500">
                Aksi pengurus advokasi & koordinasi dekanat/sarpras
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Aspiration Info */}
        <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Tiket: {aspirasi.kategori}
          </span>
          <p className="font-bold text-slate-900 mt-0.5 line-clamp-1">
            {aspirasi.judul}
          </p>
          <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {aspirasi.deskripsi}
          </p>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-3.5">
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Perbarui Status Tiket
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
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                    status === st
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    {st === 'Selesai' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    {st === 'Sedang Ditindaklanjuti' && (
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    {st === 'Ditolak' && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                    {st === 'Menunggu Verifikasi' && (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{st}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Official Response Form */}
          <div className="pt-2 space-y-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Tanggapan Resmi BEM / Unit Terkait
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Nama Biro / Tim Pengurus
                </label>
                <input
                  type="text"
                  value={penanggap}
                  onChange={(e) => setPenanggap(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Jabatan / Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Isi Tanggapan & Penjelasan Tindak Lanjut
              </label>
              <textarea
                rows={3}
                value={pesanTanggapan}
                onChange={(e) => setPesanTanggapan(e.target.value)}
                placeholder="Contoh: Laporan telah kami serahkan ke Biro Sarpras pada tanggal 28 Oktober. Perbaikan AC ruang kelas direncanakan selesai minggu ini..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 leading-relaxed"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
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

