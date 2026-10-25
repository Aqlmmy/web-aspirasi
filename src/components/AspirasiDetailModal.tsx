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
  AlertCircle,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto transition-all">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {aspirasi.kategori}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Status: {aspirasi.status}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {aspirasi.judul}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reporter info & Metadata */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 font-medium">
            {aspirasi.isAnonim ? (
              <>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Mahasiswa Anonim
                </span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-slate-400" />
                <span>
                  {aspirasi.penulis?.nama} ({aspirasi.penulis?.nim}) - {aspirasi.penulis?.prodi}
                </span>
              </>
            )}
          </div>

          {aspirasi.lokasi && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{aspirasi.lokasi}</span>
            </div>
          )}

          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{aspirasi.tanggal}</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {aspirasi.deskripsi}
          </p>

          {/* Photo attachment if available */}
          {aspirasi.lampiranUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-72">
              <Image
                src={aspirasi.lampiranUrl}
                alt="Foto Bukti Aspirasi"
                width={800}
                height={400}
                className="w-full h-64 object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Upvote & Engagement Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">
                {aspirasi.upvotes} Mahasiswa
              </span>{' '}
              mendukung aspirasi ini
            </div>
            <button
              onClick={() => onVote(aspirasi.id)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                aspirasi.hasUpvoted
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-indigo-400'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${aspirasi.hasUpvoted ? 'fill-current' : ''}`} />
              <span>{aspirasi.hasUpvoted ? 'Didukung' : 'Beri Dukungan'}</span>
            </button>
          </div>

          {/* Official University / BEM Response */}
          {aspirasi.tanggapanResmi ? (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Tanggapan Resmi Pihak Kampus / BEM</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                Oleh: {aspirasi.tanggapanResmi.penanggap} ({aspirasi.tanggapanResmi.jabatan}) •{' '}
                {aspirasi.tanggapanResmi.tanggal}
              </p>
              <p className="text-sm text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 leading-relaxed">
                &quot;{aspirasi.tanggapanResmi.pesan}&quot;
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Aspirasi ini sedang dalam antrean verifikasi/advokasi dan belum menerima tanggapan
                resmi dari pihak biro terkait.
              </span>
            </div>
          )}
        </div>

        {/* Discussion / Comments Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ruang Diskusi & Dukungan Mahasiswa ({aspirasi.komentar.length})
            </h3>
          </div>

          {/* Comment list */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {aspirasi.komentar.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                Belum ada komentar. Jadilah yang pertama memberikan masukan atau memperkuat
                aspirasi ini!
              </p>
            ) : (
              aspirasi.komentar.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {c.isAnonim ? '🛡️ Mahasiswa Anonim' : c.nama}
                    </span>
                    <span className="text-[10px]">{c.tanggal}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{c.pesan}</p>
                </div>
              ))
            )}
          </div>

          {/* Add comment form */}
          <form onSubmit={handleCommentSubmit} className="pt-2 space-y-2.5">
            <textarea
              rows={2}
              value={komentarText}
              onChange={(e) => setKomentarText(e.target.value)}
              placeholder="Tuliskan komentar atau penguatan fakta lapangan..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonimComment}
                  onChange={(e) => setIsAnonimComment(e.target.checked)}
                  className="rounded text-indigo-600 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Komentar Anonim</span>
              </label>

              {!isAnonimComment && (
                <input
                  type="text"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  placeholder="Nama Anda"
                  className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-36"
                />
              )}

              <button
                type="submit"
                disabled={!komentarText.trim()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all"
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
