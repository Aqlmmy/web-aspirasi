'use client';

import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, ExternalLink, RefreshCw, X, Server } from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNeon: boolean;
  onRefreshStatus: () => Promise<void>;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  isNeon,
  onRefreshStatus,
}) => {
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const exampleEnv = `DATABASE_URL="postgresql://neondb_owner:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheck = async () => {
    setIsChecking(true);
    await onRefreshStatus();
    setIsChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${isNeon ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'}`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Status Database: {isNeon ? 'Neon PostgreSQL (Cloud)' : 'Mode LocalStorage (Demo)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penyimpanan data aspirasi mahasiswa & advokasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Status Alert */}
          {isNeon ? (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50 flex items-start space-x-3 text-emerald-900 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs sm:text-sm">Neon PostgreSQL Aktif & Terkoneksi!</p>
                <p className="text-xs text-emerald-800/90 dark:text-emerald-400 mt-1">
                  Semua aspirasi, upvote mahasiswa, dan komentar tersimpan di cloud database Neon secara terpusat dan real-time.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50 flex items-start space-x-3 text-amber-900 dark:text-amber-300">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs sm:text-sm">Sedang Berjalan di Mode Browser (LocalStorage)</p>
                <p className="text-xs text-amber-800/90 dark:text-amber-400 mt-1">
                  Website tetap berfungsi normal, namun data hanya tersimpan di browser Anda saat ini. Ikuti panduan di bawah untuk menghubungkan ke <strong>Neon PostgreSQL</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Setup Guide */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Cara Menghubungkan ke Neon PostgreSQL:</span>
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
              <li>
                Buka situs <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5">neon.tech <ExternalLink className="w-3 h-3" /></a> dan buat akun gratis.
              </li>
              <li>
                Buat project baru (misal: <code>aspirasi-kampus</code>).
              </li>
              <li>
                Di Dashboard Neon, salin <strong>Connection string</strong> (format PostgreSQL).
              </li>
              <li>
                Tambahkan variabel <code>DATABASE_URL</code> ke dalam file <code>.env.local</code> di folder project ini (atau di pengaturan Environment Variables Vercel).
              </li>
            </ol>

            {/* Code Snippet Example */}
            <div className="mt-2 relative">
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                {exampleEnv}
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium flex items-center space-x-1 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              *Tabel SQL dan data sampel awal akan otomatis dibuatkan (auto-migrate) saat pertama kali terhubung ke Neon!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isChecking ? 'Memeriksa...' : 'Cek Ulang Koneksi'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
