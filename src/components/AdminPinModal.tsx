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
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden font-sans">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Verifikasi Pengurus BEM
              </h3>
              <p className="text-[11px] text-slate-500">
                Akses khusus advokasi & pengelola
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPin('');
              setErrorMsg('');
              onClose();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Masukkan PIN pengurus untuk membuka akses pengelolaan status aspirasi mahasiswa.
          </p>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIN Admin
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
                className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              PIN bawaan: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">bem2026</code>
            </p>
          </div>

          <div className="pt-1 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setPin('');
                setErrorMsg('');
                onClose();
              }}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !pin.trim()}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
            >
              {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
