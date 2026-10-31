'use client';

import React, { useState } from 'react';
import { Aspirasi } from '@/types';
import {
  X,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import Image from 'next/image';

interface AspirasiDetailModalProps {
  aspirasi: Aspirasi | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (id: string) => void;
  onAddComment: (aspirasiId: string, data: { nama: string; isAnonim: boolean; pesan: string }) => void;
}

export const AspirasiDetailModal: React.FC<AspirasiDetailModalProps> = ({
  aspirasi,
  isOpen,
  onClose,
  onVote,
  onAddComment,
}) => {
  const [komentarText, setKomentarText] = useState('');
  const [isAnonimComment, setIsAnonimComment] = useState(true);
  const [commenterName, setCommenterName] = useState('');

  if (!isOpen || !aspirasi) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!komentarText.trim()) return;

    onAddComment(aspirasi.id, {
      nama: isAnonimComment ? 'Mahasiswa Anonim' : commenterName.trim() || 'Mahasiswa',
      isAnonim: isAnonimComment,
      pesan: komentarText.trim(),
    });

    setKomentarText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-xl p-6 my-8 max-h-[90vh] overflow-y-auto transition-all">
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {aspirasi.kategori}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Status: {aspirasi.status}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {aspirasi.judul}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reporter info & Metadata */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3.5 py-2.5 text-xs text-slate-500 border-b border-slate-100">
          <div className="flex items-center space-x-1.5 font-medium">
            {aspirasi.isAnonim ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-700 font-medium">
                  Mahasiswa Anonim
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 font-medium">
                  {aspirasi.penulis?.nama} ({aspirasi.penulis?.nim}) - {aspirasi.penulis?.prodi}
                </span>
              </>
            )}
          </div>

          {aspirasi.lokasi && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{aspirasi.lokasi}</span>
            </div>
          )}

          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{aspirasi.tanggal}</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {aspirasi.deskripsi}
          </p>

          {/* Photo attachment if available */}
          {aspirasi.lampiranUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-200 max-h-64">
              <Image
                src={aspirasi.lampiranUrl}
                alt="Foto Bukti Aspirasi"
                width={800}
                height={400}
                className="w-full h-56 object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Upvote & Engagement Bar */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="text-xs text-slate-600">
              <strong className="text-slate-900 font-semibold">{aspirasi.upvotes} Mahasiswa</strong> telah mendukung laporan ini
            </div>
            <button
              onClick={() => onVote(aspirasi.id)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                aspirasi.hasUpvoted
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${aspirasi.hasUpvoted ? 'fill-current' : ''}`} />
              <span>{aspirasi.hasUpvoted ? 'Didukung' : 'Beri Dukungan'}</span>
            </button>
          </div>

          {/* Official University / BEM Response */}
          {aspirasi.tanggapanResmi ? (
            <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tanggapan Resmi Pihak Kampus / BEM</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Oleh: {aspirasi.tanggapanResmi.penanggap} ({aspirasi.tanggapanResmi.jabatan}) • {aspirasi.tanggapanResmi.tanggal}
              </p>
              <p className="text-xs text-slate-800 bg-white p-2.5 rounded-md border border-emerald-100 leading-relaxed italic">
                &quot;{aspirasi.tanggapanResmi.pesan}&quot;
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center space-x-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Aspirasi ini sedang dalam proses verifikasi tim advokasi BEM dan belum memiliki tanggapan resmi.
              </span>
            </div>
          )}
        </div>

        {/* Discussion / Comments Section */}
        <div className="pt-3.5 border-t border-slate-100 space-y-3">
          <div className="flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-900">
              Komentar & Penguatan Mahasiswa ({aspirasi.komentar.length})
            </h3>
          </div>

          {/* Comment list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {aspirasi.komentar.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">
                Belum ada tanggapan rekan mahasiswa.
              </p>
            ) : (
              aspirasi.komentar.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-semibold text-slate-800">
                      {c.isAnonim ? 'Mahasiswa Anonim' : c.nama}
                    </span>
                    <span>{c.tanggal}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{c.pesan}</p>
                </div>
              ))
            )}
          </div>

          {/* Add comment form */}
          <form onSubmit={handleCommentSubmit} className="pt-1.5 space-y-2">
            <textarea
              rows={2}
              value={komentarText}
              onChange={(e) => setKomentarText(e.target.value)}
              placeholder="Tuliskan pengalaman atau fakta pendukung..."
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonimComment}
                  onChange={(e) => setIsAnonimComment(e.target.checked)}
                  className="rounded text-slate-900 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px]">Anonim</span>
              </label>

              {!isAnonimComment && (
                <input
                  type="text"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  placeholder="Nama Anda"
                  className="px-2 py-1 text-xs rounded border border-slate-200 bg-white w-32"
                />
              )}

              <button
                type="submit"
                disabled={!komentarText.trim()}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Kirim</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

