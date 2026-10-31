'use client';

import React from 'react';
import { KategoriAspirasi, StatusAspirasi } from '@/types';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
    <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-3.5">
      {/* Top Row: Search & Segmented Sort */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari aspirasi, fasilitas, lokasi..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors"
          />
        </div>

        {/* Sort Segmented Control */}
        <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-100 border border-slate-200/80 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-slate-500 px-2 hidden lg:inline flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            Urutan:
          </span>

          <button
            onClick={() => onSortByChange('popular')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sortBy === 'popular'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dukungan Terbanyak
          </button>

          <button
            onClick={() => onSortByChange('latest')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sortBy === 'latest'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terbaru
          </button>

          <button
            onClick={() => onSortByChange('urgent')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sortBy === 'urgent'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prioritas Darurat
          </button>
        </div>
      </div>

      {/* Bottom Row: Category Chips & Status Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Horizontal Category Scroll */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {KATEGORI_OPTIONS.map((kat) => (
            <button
              key={kat}
              onClick={() => onSelectKategori(kat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedKategori === kat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
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
            className="text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
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

