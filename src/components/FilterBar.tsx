'use client';

import React from 'react';
import { KategoriAspirasi, StatusAspirasi } from '@/types';
import { Search, SlidersHorizontal, Flame, Sparkles, AlertTriangle } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedKategori: string;
  onSelectKategori: (val: string) => void;
  selectedStatus: string;
  onSelectStatus: (val: string) => void;
  sortBy: 'popular' | 'latest' | 'urgent';
  onSortByChange: (val: 'popular' | 'latest' | 'urgent') => void;
}

const KATEGORI_OPTIONS: (KategoriAspirasi | 'Semua Kategori')[] = [
  'Semua Kategori',
  'Fasilitas & Sarpras',
  'Akademik & Perkuliahan',
  'UKT & Finansial',
  'Keamanan & Lingkungan',
  'Kemahasiswaan & BEM',
];

const STATUS_OPTIONS: (StatusAspirasi | 'Semua Status')[] = [
  'Semua Status',
  'Menunggu Verifikasi',
  'Sedang Ditindaklanjuti',
  'Selesai',
  'Ditolak',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedKategori,
  onSelectKategori,
  selectedStatus,
  onSelectStatus,
  sortBy,
  onSortByChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 space-y-4">
      {/* Search Input & Sort Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari aspirasi, fasilitas, atau kata kunci..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 hidden lg:inline">
            Urutkan:
          </span>
          <button
            onClick={() => onSortByChange('popular')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === 'popular'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Terpopuler</span>
          </button>

          <button
            onClick={() => onSortByChange('latest')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === 'latest'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Terbaru</span>
          </button>

          <button
            onClick={() => onSortByChange('urgent')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === 'urgent'
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Mendesak</span>
          </button>
        </div>
      </div>

      {/* Filters: Category pills & Status select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {/* Category horizontal scroll */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {KATEGORI_OPTIONS.map((kat) => (
            <button
              key={kat}
              onClick={() => onSelectKategori(kat)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedKategori === kat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-700/80'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            className="text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
