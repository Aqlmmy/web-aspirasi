'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('Masukkan PIN Admin terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess(pin.trim());
        setPin('');
        onClose();
      } else {
        setErrorMsg(data.error || 'PIN yang Anda masukkan salah.');
      }
    } catch (err) {
      setErrorMsg('Gagal memverifikasi PIN. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Verifikasi Pengelola (BEM)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Akses khusus pengurus & advokasi
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPin('');
              setErrorMsg('');
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Halaman ini dilindungi. Masukkan PIN Admin rahasia untuk memverifikasi identitas Anda sebagai pengurus advokasi.
          </p>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800/60 flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              PIN / Sandi Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN Admin..."
                autoFocus
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              *PIN bawaan: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">bem2026</code> (bisa diubah via env)
            </p>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setPin('');
                setErrorMsg('');
                onClose();
              }}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !pin.trim()}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
