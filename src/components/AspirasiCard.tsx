'use client';

import React from 'react';
import { Aspirasi } from '@/types';
import {
  ThumbsUp,
  MessageSquare,
  MapPin,
  Calendar,
  ShieldCheck,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  Flame,
  Settings,
} from 'lucide-react';

interface AspirasiCardProps {
  aspirasi: Aspirasi;
  isAdminMode: boolean;
  onVote: (id: string) => void;
  onOpenDetail: (aspirasi: Aspirasi) => void;
  onOpenAdminAction: (aspirasi: Aspirasi) => void;
}

export const AspirasiCard: React.FC<AspirasiCardProps> = ({
  aspirasi,
  isAdminMode,
  onVote,
  onOpenDetail,
  onOpenAdminAction,
}) => {
  const getStatusBadge = (status: Aspirasi['status']) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Selesai</span>
          </span>
        );
      case 'Sedang Ditindaklanjuti':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Sedang Ditindaklanjuti</span>
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Menunggu Verifikasi</span>
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgensi: Aspirasi['urgensi']) => {
    if (urgensi === 'Darurat') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-xs">
          <Flame className="w-3 h-3 animate-pulse" />
          <span>Darurat</span>
        </span>
      );
    }
    if (urgensi === 'Tinggi') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300">
          Urgensi Tinggi
        </span>
      );
    }
    return null;
  };

  return (
    <article className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Category, Status, Urgency */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/40">
              {aspirasi.kategori}
            </span>
            {getUrgencyBadge(aspirasi.urgensi)}
          </div>
          <div>{getStatusBadge(aspirasi.status)}</div>
        </div>

        {/* Title */}
        <h2
          onClick={() => onOpenDetail(aspirasi)}
          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors line-clamp-2 mb-2"
        >
          {aspirasi.judul}
        </h2>

        {/* Description Excerpt */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
          {aspirasi.deskripsi}
        </p>

        {/* Official Response Callout (if available) */}
        {aspirasi.tanggapanResmi && (
          <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-emerald-500 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tanggapan Resmi: {aspirasi.tanggapanResmi.penanggap}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 line-clamp-2 italic">
              &quot;{aspirasi.tanggapanResmi.pesan}&quot;
            </p>
          </div>
        )}

        {/* Meta Info (Lokasi, Tanggal, Penulis) */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Penulis Info */}
          <div className="flex items-center space-x-1.5 font-medium">
            {aspirasi.isAnonim ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  Mahasiswa Anonim
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">
                  {aspirasi.penulis?.nama} ({aspirasi.penulis?.prodi})
                </span>
              </>
            )}
          </div>

          {/* Lokasi */}
          {aspirasi.lokasi && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="line-clamp-1">{aspirasi.lokasi}</span>
            </div>
          )}

          {/* Tanggal */}
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{aspirasi.tanggal}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions: Upvote Button, Comments, & Details */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Upvote Button */}
          <button
            onClick={() => onVote(aspirasi.id)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              aspirasi.hasUpvoted
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${aspirasi.hasUpvoted ? 'fill-current' : ''}`} />
            <span>{aspirasi.upvotes}</span>
            <span className="hidden sm:inline font-normal">Dukungan</span>
          </button>

          {/* Comment Count */}
          <button
            onClick={() => onOpenDetail(aspirasi)}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{aspirasi.komentar.length}</span>
          </button>
        </div>

        {/* Right Buttons: Admin Action or View Detail */}
        <div className="flex items-center space-x-2">
          {isAdminMode && (
            <button
              onClick={() => onOpenAdminAction(aspirasi)}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Kelola Status</span>
            </button>
          )}

          <button
            onClick={() => onOpenDetail(aspirasi)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>Detail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
