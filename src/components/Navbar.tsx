'use client';

import React from 'react';
import Link from 'next/link';
import { Megaphone, Plus, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Institution Info */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
            <Megaphone className="w-4 h-4 text-slate-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-slate-900">
                Suara Mahasiswa
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                BEM KM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Portal Aspirasi, Keluhan, & Advokasi Kampus
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Portal BEM</span>
          </Link>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Aspirasi</span>
          </button>
        </div>
      </div>
    </header>
  );
};

