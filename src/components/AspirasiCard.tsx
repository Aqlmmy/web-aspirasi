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
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  Settings,
} from 'lucide-react';

interface AspirasiCardProps {
  aspirasi: Aspirasi;
  isAdminMode?: boolean;
  onVote: (id: string) => void;
  onOpenDetail: (aspirasi: Aspirasi) => void;
  onOpenAdminAction?: (aspirasi: Aspirasi) => void;
}

export const AspirasiCard: React.FC<AspirasiCardProps> = ({
  aspirasi,
  isAdminMode = false,
  onVote,
  onOpenDetail,
  onOpenAdminAction,
}) => {
  const getStatusBadge = (status: Aspirasi['status']) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Selesai</span>
          </span>
        );
      case 'Sedang Ditindaklanjuti':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Sedang Ditindaklanjuti</span>
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200/80">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Menunggu Verifikasi</span>
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgensi: Aspirasi['urgensi']) => {
    if (urgensi === 'Darurat') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          <span>Darurat</span>
        </span>
      );
    }
    if (urgensi === 'Tinggi') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          Urgensi Tinggi
        </span>
      );
    }
    return null;
  };

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        {/* Top Header: Category, Status, Urgency */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {aspirasi.kategori}
            </span>
            {getUrgencyBadge(aspirasi.urgensi)}
          </div>
          <div>{getStatusBadge(aspirasi.status)}</div>
        </div>

        {/* Title */}
        <h2
          onClick={() => onOpenDetail(aspirasi)}
          className="text-base font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors line-clamp-2 mb-2 leading-snug"
        >
          {aspirasi.judul}
        </h2>

        {/* Description Excerpt */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {aspirasi.deskripsi}
        </p>

        {/* Official Response Callout (if available) */}
        {aspirasi.tanggapanResmi && (
          <div className="mb-4 p-3 rounded-r-lg bg-emerald-50/50 border-l-2 border-emerald-600 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tanggapan: {aspirasi.tanggapanResmi.penanggap}</span>
            </div>
            <p className="text-slate-700 line-clamp-2 italic">
              &quot;{aspirasi.tanggapanResmi.pesan}&quot;
            </p>
          </div>
        )}

        {/* Meta Info (Lokasi, Tanggal, Penulis) */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3.5 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
          {/* Penulis Info */}
          <div className="flex items-center space-x-1.5">
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
                  {aspirasi.penulis?.nama} ({aspirasi.penulis?.prodi})
                </span>
              </>
            )}
          </div>

          {/* Lokasi */}
          {aspirasi.lokasi && (
            <div className="flex items-center space-x-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="line-clamp-1">{aspirasi.lokasi}</span>
            </div>
          )}

          {/* Tanggal */}
          <div className="flex items-center space-x-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{aspirasi.tanggal}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions: Upvote Button, Comments, & Details */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          {/* Upvote Button */}
          <button
            onClick={() => onVote(aspirasi.id)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              aspirasi.hasUpvoted
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${aspirasi.hasUpvoted ? 'fill-current' : ''}`} />
            <span>{aspirasi.upvotes}</span>
            <span className="hidden sm:inline font-normal">Dukungan</span>
          </button>

          {/* Comment Count */}
          <button
            onClick={() => onOpenDetail(aspirasi)}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{aspirasi.komentar.length}</span>
          </button>
        </div>

        {/* Right Buttons: Admin Action or View Detail */}
        <div className="flex items-center space-x-2">
          {isAdminMode && onOpenAdminAction && (
            <button
              onClick={() => onOpenAdminAction(aspirasi)}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Kelola Status</span>
            </button>
          )}

          <button
            onClick={() => onOpenDetail(aspirasi)}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span>Buka</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </article>
  );
};

