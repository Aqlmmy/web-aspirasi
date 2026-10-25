'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Aspirasi } from '@/types';
import {
  fetchAllAspirasi,
  createNewAspirasi,
  toggleAspirasiVote,
  addAspirasiComment,
} from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { StatsBanner } from '@/components/StatsBanner';
import { FilterBar } from '@/components/FilterBar';
import { AspirasiCard } from '@/components/AspirasiCard';
import { FormAspirasiModal } from '@/components/FormAspirasiModal';
import { AspirasiDetailModal } from '@/components/AspirasiDetailModal';
import { MessageSquareDashed, Plus } from 'lucide-react';

export default function HomePage() {
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNeon, setIsNeon] = useState(false);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'urgent'>('popular');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailAspirasi, setDetailAspirasi] = useState<Aspirasi | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    const result = await fetchAllAspirasi();
    setAspirasiList(result.data);
    setIsNeon(result.isNeon);
    setIsLoaded(true);

    if (detailAspirasi) {
      const refreshed = result.data.find((a) => a.id === detailAspirasi.id);
      if (refreshed) setDetailAspirasi(refreshed);
    }
  }, [detailAspirasi]);

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleVote = async (id: string) => {
    const target = aspirasiList.find((a) => a.id === id);
    if (!target) return;

    // Optimistic UI update
    const prevHasUpvoted = !!target.hasUpvoted;
    const prevUpvotes = target.upvotes;
    const nextHasUpvoted = !prevHasUpvoted;
    const nextUpvotes = nextHasUpvoted ? prevUpvotes + 1 : Math.max(0, prevUpvotes - 1);

    setAspirasiList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hasUpvoted: nextHasUpvoted, upvotes: nextUpvotes } : item
      )
    );

    if (detailAspirasi && detailAspirasi.id === id) {
      setDetailAspirasi((prev) =>
        prev ? { ...prev, hasUpvoted: nextHasUpvoted, upvotes: nextUpvotes } : null
      );
    }

    // Call API / LocalStorage
    const res = await toggleAspirasiVote(id, isNeon, prevHasUpvoted, prevUpvotes);

    // Sync with real result
    setAspirasiList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hasUpvoted: res.hasUpvoted, upvotes: res.upvotes } : item
      )
    );

    if (detailAspirasi && detailAspirasi.id === id) {
      setDetailAspirasi((prev) =>
        prev ? { ...prev, hasUpvoted: res.hasUpvoted, upvotes: res.upvotes } : null
      );
    }
  };

  const handleCreate = async (
    payload: Omit<Aspirasi, 'id' | 'tanggal' | 'upvotes' | 'hasUpvoted' | 'status' | 'komentar'>
  ) => {
    const created = await createNewAspirasi(payload, isNeon);
    setAspirasiList((prev) => [created, ...prev]);
  };

  const handleAddComment = async (
    aspirasiId: string,
    data: { nama: string; isAnonim: boolean; pesan: string }
  ) => {
    const newComment = await addAspirasiComment(aspirasiId, data, isNeon);

    if (newComment) {
      setAspirasiList((prev) =>
        prev.map((item) =>
          item.id === aspirasiId
            ? { ...item, komentar: [...item.komentar, newComment] }
            : item
        )
      );

      if (detailAspirasi && detailAspirasi.id === aspirasiId) {
        setDetailAspirasi((prev) =>
          prev ? { ...prev, komentar: [...prev.komentar, newComment] } : null
        );
      }
    }
  };

  // Filtered & Sorted List
  const filteredList = useMemo(() => {
    let list = [...aspirasiList];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.judul.toLowerCase().includes(q) ||
          item.deskripsi.toLowerCase().includes(q) ||
          (item.lokasi && item.lokasi.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedKategori !== 'Semua Kategori') {
      list = list.filter((item) => item.kategori === selectedKategori);
    }

    // Status filter
    if (selectedStatus !== 'Semua Status') {
      list = list.filter((item) => item.status === selectedStatus);
    }

    // Sorting
    if (sortBy === 'popular') {
      list.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'latest') {
      list.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    } else if (sortBy === 'urgent') {
      const urgencyRank: Record<string, number> = {
        Darurat: 4,
        Tinggi: 3,
        Sedang: 2,
        Rendah: 1,
      };
      list.sort((a, b) => (urgencyRank[b.urgensi] || 0) - (urgencyRank[a.urgensi] || 0));
    }

    return list;
  }, [aspirasiList, searchQuery, selectedKategori, selectedStatus, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onOpenCreateModal={() => setIsCreateOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero & Statistics */}
        <StatsBanner aspirasiList={aspirasiList} />

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedKategori={selectedKategori}
          onSelectKategori={setSelectedKategori}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* Content Aspirations Grid */}
        {!isLoaded ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500">Memuat data aspirasi...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
              <MessageSquareDashed className="w-7 h-7" />
            </div>
            <div className="max-w-sm mx-auto mb-5">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Tidak ada aspirasi yang cocok
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Coba ubah kata kunci pencarian atau ganti filter kategori/status untuk melihat
                aspirasi lainnya.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedKategori('Semua Kategori');
                setSelectedStatus('Semua Status');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredList.map((aspirasi) => (
              <AspirasiCard
                key={aspirasi.id}
                aspirasi={aspirasi}
                isAdminMode={false}
                onVote={handleVote}
                onOpenDetail={setDetailAspirasi}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
              SM
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              SuaraMahasiswa © 2026
            </span>
            <span>— Portal Terbuka Aspirasi & Advokasi Kampus</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-indigo-600 cursor-pointer">Panduan Advokasi</span>
            <span className="hover:text-indigo-600 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-indigo-600 cursor-pointer">BEM Universitas</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-30">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modals */}
      <FormAspirasiModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <AspirasiDetailModal
        aspirasi={detailAspirasi}
        isOpen={!!detailAspirasi}
        onClose={() => setDetailAspirasi(null)}
        onVote={handleVote}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
