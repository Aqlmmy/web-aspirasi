'use client';

import React from 'react';
import { Megaphone, PlusCircle, ShieldCheck, UserCheck, RefreshCw, Database } from 'lucide-react';

interface NavbarProps {
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenCreateModal: () => void;
  onResetData: () => void;
  isNeon?: boolean;
  onOpenDbModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdminMode,
  onToggleAdminMode,
  onOpenCreateModal,
  onResetData,
  isNeon = false,
  onOpenDbModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Megaphone className="w-5 h-5 -rotate-12" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-200 bg-clip-text text-transparent">
                SuaraMahasiswa
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                Kampus Merdeka
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Portal Aspirasi & Advokasi Kebijakan Mahasiswa
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Database Status Button */}
          {onOpenDbModal && (
            <button
              onClick={onOpenDbModal}
              title="Cek status database Neon PostgreSQL"
              className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isNeon
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isNeon ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <Database className="w-3.5 h-3.5" />
              <span>{isNeon ? 'Neon DB' : 'LocalStorage'}</span>
            </button>
          )}
          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset data contoh ke bawaan"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Admin Mode Switcher */}
          <button
            onClick={onToggleAdminMode}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isAdminMode
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/60 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {isAdminMode ? (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Mode Pengelola (BEM)</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Masuk</span> Mode Admin
              </>
            )}
          </button>

          {/* New Aspiration Button */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sampaikan Aspirasi</span>
          </button>
        </div>
      </div>
    </header>
  );
};
