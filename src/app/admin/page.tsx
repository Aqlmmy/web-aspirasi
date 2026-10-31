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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-7 shadow-xs space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2.5">
            <div className="w-11 h-11 mx-auto rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6 text-slate-100" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Portal Advokasi & Pengurus BEM
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifikasi akses untuk meninjau dan menindaklanjuti aspirasi mahasiswa
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                PIN Pengurus
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN Admin..."
                  autoFocus
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                PIN bawaan sistem: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">bem2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !pinInput.trim()}
              className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Memverifikasi...' : 'Masuk ke Dashboard BEM'}
            </button>
          </form>

          {/* Footer link to public website */}
          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Utama Mahasiswa</span>
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Dashboard Advokasi BEM
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Pengurus Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Verifikasi tiket keluhan mahasiswa & publikasikan tanggapan resmi
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Database Status Button */}
            <button
              onClick={() => setIsDbModalOpen(true)}
              title="Cek status database Neon PostgreSQL"
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isNeon
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isNeon ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isNeon ? 'Neon PostgreSQL' : 'LocalStorage Mode'}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Web Publik</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Total Tiket Masuk</p>
            <p className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{stats.total}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-800 font-medium">Menunggu Verifikasi</p>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-amber-700 mt-1">{stats.menunggu}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-800 font-medium">Sedang Ditindaklanjuti</p>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-blue-700 mt-1">{stats.diproses}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-800 font-medium">Terselesaikan</p>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-emerald-700 mt-1">{stats.selesai}</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari aspirasi, pelapor, lokasi..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50/70 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
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
              className="px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
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
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Aspirations Management Table */}
        {!isLoaded ? (
          <div className="py-20 text-center">
            <div className="inline-block w-7 h-7 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500 font-medium">Memuat data tiket aspirasi...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-slate-300 bg-white">
            <p className="text-xs text-slate-500 font-medium">Tidak ada tiket aspirasi yang sesuai filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'Sedang Ditindaklanjuti'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : item.status === 'Ditolak'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {item.kategori}
                    </span>

                    {item.urgensi === 'Darurat' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        Darurat
                      </span>
                    )}
                    {item.urgensi === 'Tinggi' && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Urgensi Tinggi
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{item.judul}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">{item.deskripsi}</p>

                  <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-500 pt-1">
                    <span>
                      Pelapor:{' '}
                      <strong className="text-slate-800 font-medium">
                        {item.isAnonim ? 'Mahasiswa Anonim' : item.penulis?.nama || 'Resmi'}
                      </strong>
                    </span>
                    {item.lokasi && <span>Lokasi: {item.lokasi}</span>}
                    <span>Tanggal: {item.tanggal}</span>
                    <span>👍 {item.upvotes} Dukungan</span>
                    <span>💬 {item.komentar.length} Komentar</span>
                  </div>

                  {item.tanggapanResmi && (
                    <div className="mt-2 p-2.5 rounded-r-lg bg-emerald-50/50 border-l-2 border-emerald-600 text-xs text-slate-700">
                      <span className="font-semibold text-emerald-800">Tanggapan BEM: </span>
                      {item.tanggapanResmi.pesan}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => setSelectedAspirasi(item)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-200" />
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
