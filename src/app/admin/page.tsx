'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Aspirasi, StatusAspirasi, TanggapanResmi } from '@/types';
import { fetchAllAspirasi, updateAspirasiStatus } from '@/lib/api';
import { AdminActionModal } from '@/components/AdminActionModal';
import { DatabaseModal } from '@/components/DatabaseModal';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  UserCheck,
  RefreshCw,
  Database,
} from 'lucide-react';

const ADMIN_PIN_SESSION_KEY = 'suara_mahasiswa_admin_pin';

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Dashboard Data
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNeon, setIsNeon] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [kategoriFilter, setKategoriFilter] = useState('Semua Kategori');

  // Modal
  const [selectedAspirasi, setSelectedAspirasi] = useState<Aspirasi | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Check saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPin = sessionStorage.getItem(ADMIN_PIN_SESSION_KEY);
      if (savedPin) {
        setPinInput(savedPin);
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Load data once authenticated
  const loadData = useCallback(async () => {
    setIsLoaded(false);
    const result = await fetchAllAspirasi();
    setAspirasiList(result.data);
    setIsNeon(result.isNeon);
    setIsLoaded(true);

    if (selectedAspirasi) {
      const refreshed = result.data.find((a) => a.id === selectedAspirasi.id);
      if (refreshed) setSelectedAspirasi(refreshed);
    }
  }, [selectedAspirasi]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setLoginError('Harap masukkan PIN Admin.');
      return;
    }

    setIsVerifying(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(ADMIN_PIN_SESSION_KEY, pinInput.trim());
        }
      } else {
        setLoginError(data.error || 'PIN Admin yang Anda masukkan salah.');
      }
    } catch (err) {
      setLoginError('Gagal memverifikasi PIN. Silakan periksa jaringan Anda.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_PIN_SESSION_KEY);
    }
  };

  // Handle Save Status & Tanggapan
  const handleSaveStatus = async (
    id: string,
    newStatus: StatusAspirasi,
    tanggapan?: TanggapanResmi
  ) => {
    try {
      await updateAspirasiStatus(id, newStatus, tanggapan, isNeon, pinInput);

      setAspirasiList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
                tanggapanResmi: tanggapan || item.tanggapanResmi,
              }
            : item
        )
      );

      setSelectedAspirasi(null);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan status aspirasi.');
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = aspirasiList.length;
    const menunggu = aspirasiList.filter((a) => a.status === 'Menunggu Verifikasi').length;
    const diproses = aspirasiList.filter((a) => a.status === 'Sedang Ditindaklanjuti').length;
    const selesai = aspirasiList.filter((a) => a.status === 'Selesai').length;
    return { total, menunggu, diproses, selesai };
  }, [aspirasiList]);

  // Filtered List
  const filteredList = useMemo(() => {
    let list = [...aspirasiList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.judul.toLowerCase().includes(q) ||
          a.deskripsi.toLowerCase().includes(q) ||
          (a.lokasi && a.lokasi.toLowerCase().includes(q)) ||
          (a.penulis?.nama && a.penulis.nama.toLowerCase().includes(q)) ||
          (a.penulis?.nim && a.penulis.nim.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'Semua Status') {
      list = list.filter((a) => a.status === statusFilter);
    }

    if (kategoriFilter !== 'Semua Kategori') {
      list = list.filter((a) => a.kategori === kategoriFilter);
    }

    return list;
  }, [aspirasiList, searchQuery, statusFilter, kategoriFilter]);

  // ==========================================
  // VIEW 1: GATEKEEPER / LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/25">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Portal Advokasi & Pengelola BEM
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Area khusus otentikasi pengurus advokasi & kebijakan kampus
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                PIN Admin Rahasia
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN Admin..."
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                *PIN bawaan default: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">bem2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !pinInput.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-600/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Memverifikasi Akses...' : 'Masuk ke Dashboard BEM'}
            </button>
          </form>

          {/* Footer link to public website */}
          <div className="text-center pt-2 border-t border-slate-700/60">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Mahasiswa</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Dashboard Advokasi BEM
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Pengelola Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Verifikasi tiket keluhan & publikasikan tanggapan resmi
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Database Status Button */}
            <button
              onClick={() => setIsDbModalOpen(true)}
              title="Cek status database Neon PostgreSQL"
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isNeon
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                  : 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isNeon ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <Database className="w-3.5 h-3.5" />
              <span>{isNeon ? 'Neon PostgreSQL' : 'LocalStorage Mode'}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-900/70 text-red-300 border border-red-800/80 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">Total Tiket Masuk</p>
            <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40">
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-400 font-semibold">Menunggu Verifikasi</p>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-300 mt-1">{stats.menunggu}</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-400 font-semibold">Sedang Ditindaklanjuti</p>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-blue-300 mt-1">{stats.diproses}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-400 font-semibold">Terselesaikan</p>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-300 mt-1">{stats.selesai}</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari aspirasi, nama mahasiswa, lokasi..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Sedang Ditindaklanjuti">Sedang Ditindaklanjuti</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="Fasilitas & Sarpras">Fasilitas & Sarpras</option>
              <option value="Akademik & Perkuliahan">Akademik & Perkuliahan</option>
              <option value="UKT & Finansial">UKT & Finansial</option>
              <option value="Keamanan & Lingkungan">Keamanan & Lingkungan</option>
              <option value="Kemahasiswaan & BEM">Kemahasiswaan & BEM</option>
            </select>

            <button
              onClick={loadData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Aspirations Management Table */}
        {!isLoaded ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500">Memuat data tiket aspirasi...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50">
            <p className="text-sm text-slate-400 font-semibold">Tidak ada aspirasi ditemukan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : item.status === 'Sedang Ditindaklanjuti'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : item.status === 'Ditolak'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.kategori}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.urgensi === 'Darurat'
                          ? 'bg-red-500/20 text-red-400'
                          : item.urgensi === 'Tinggi'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Urgensi: {item.urgensi}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{item.judul}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.deskripsi}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>
                      Pelapor:{' '}
                      <strong className="text-slate-300">
                        {item.isAnonim ? 'Mahasiswa Anonim' : item.penulis?.nama || 'Resmi'}
                      </strong>
                    </span>
                    {item.lokasi && <span>Lokasi: {item.lokasi}</span>}
                    <span>Tanggal: {item.tanggal}</span>
                    <span>👍 {item.upvotes} Dukungan</span>
                    <span>💬 {item.komentar.length} Komentar</span>
                  </div>

                  {item.tanggapanResmi && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-amber-400">Tanggapan BEM: </span>
                      {item.tanggapanResmi.pesan}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => setSelectedAspirasi(item)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-600/20 transition-all active:scale-95 flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Tindak Lanjuti</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Action Modal */}
      <AdminActionModal
        aspirasi={selectedAspirasi}
        isOpen={!!selectedAspirasi}
        onClose={() => setSelectedAspirasi(null)}
        onSave={handleSaveStatus}
      />

      {/* Database Status Modal */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        isNeon={isNeon}
        onRefreshStatus={loadData}
      />
    </div>
  );
}
