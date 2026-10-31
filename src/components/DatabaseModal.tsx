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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg ${isNeon ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Status Database: {isNeon ? 'Neon PostgreSQL (Cloud)' : 'Mode LocalStorage'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Penyimpanan data aspirasi mahasiswa & advokasi
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status Alert */}
          {isNeon ? (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start space-x-2.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs">Neon PostgreSQL Terhubung</p>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  Semua tiket aspirasi, upvote mahasiswa, dan komentar tersimpan di cloud database Neon secara terpusat.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start space-x-2.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs">Mode LocalStorage Aktif</p>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Data saat ini tersimpan di browser Anda. Hubungkan ke <strong>Neon PostgreSQL</strong> agar tersimpan di cloud terpusat.
                </p>
              </div>
            </div>
          )}

          {/* Setup Guide */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span>Cara Menghubungkan ke Neon PostgreSQL:</span>
            </h4>

            <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed pl-1 text-[11px]">
              <li>
                Buka <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-semibold underline inline-flex items-center gap-0.5">neon.tech <ExternalLink className="w-2.5 h-2.5" /></a> dan buat akun gratis.
              </li>
              <li>
                Buat database project baru (misal: <code>aspirasi-kampus</code>).
              </li>
              <li>
                Salin <strong>Connection string</strong> (format PostgreSQL).
              </li>
              <li>
                Tambahkan <code>DATABASE_URL</code> ke file <code>.env.local</code>.
              </li>
            </ol>

            {/* Code Snippet Example */}
            <div className="mt-2 relative">
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                {exampleEnv}
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium flex items-center space-x-1 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Memeriksa...' : 'Cek Ulang'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
