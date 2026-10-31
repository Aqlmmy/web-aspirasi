'use client';

import React from 'react';
import { Aspirasi } from '@/types';
import { CheckCircle2, Clock, ThumbsUp, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

interface StatsBannerProps {
  aspirasiList: Aspirasi[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ aspirasiList }) => {
  const total = aspirasiList.length;
  const selesai = aspirasiList.filter((a) => a.status === 'Selesai').length;
  const diproses = aspirasiList.filter((a) => a.status === 'Sedang Ditindaklanjuti').length;
  const totalVotes = aspirasiList.reduce((acc, curr) => acc + curr.upvotes, 0);

  const stats = [
    {
      label: 'Aspirasi Masuk',
      value: total,
      icon: FileText,
      accent: 'text-slate-900 bg-slate-100',
    },
    {
      label: 'Dalam Tindak Lanjut',
      value: diproses,
      icon: Clock,
      accent: 'text-amber-700 bg-amber-50',
    },
    {
      label: 'Tuntas & Terealisasi',
      value: selesai,
      icon: CheckCircle2,
      accent: 'text-emerald-700 bg-emerald-50',
    },
    {
      label: 'Dukungan Mahasiswa',
      value: totalVotes,
      icon: ThumbsUp,
      accent: 'text-blue-700 bg-blue-50',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Editorial University Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Kanal Resmi Advokasi BEM Mahasiswa</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              Ruang Aspirasi & Pengawalan Kebijakan Kampus
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              Sampaikan keluhan fasilitas, usulan akademik, atau aspirasi kesejahteraan mahasiswa.
              Setiap laporan dapat disampaikan secara terbuka maupun anonim, dan dipantau tindak
              lanjutnya secara transparan oleh pengurus advokasi.
            </p>
          </div>

          {/* Workflow guide pill */}
          <div className="lg:w-80 shrink-0 p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-2">
            <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
              Alur Penanganan Laporan:
            </span>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">1</span>
              <span>Lapor / Tulis Aspirasi</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Verifikasi & Upvote</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">3</span>
              <span className="font-medium text-slate-800">Advokasi ke Pimpinan Kampus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex items-center space-x-3.5"
            >
              <div className={`p-2.5 rounded-lg ${stat.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

