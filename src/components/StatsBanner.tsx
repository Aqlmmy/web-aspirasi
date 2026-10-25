'use client';

import React from 'react';
import { Aspirasi } from '@/types';
import { CheckCircle2, Clock, ThumbsUp, ShieldAlert, Sparkles } from 'lucide-react';

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
      label: 'Total Aspirasi Terhimpun',
      value: total,
      icon: Sparkles,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Sedang Ditindaklanjuti',
      value: diproses,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Selesai & Terealisasi',
      value: selesai,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Total Suara Dukungan',
      value: totalVotes,
      icon: ThumbsUp,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-200 border border-white/15 mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-300" />
            <span>Kanal Suara Resmi & Terbuka Mahasiswa</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Sampaikan Kritik, Laporkan Fasilitas, Wujudkan Kampus yang Lebih Baik.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Setiap suara mahasiswa memiliki dampak nyata. Dukung aspirasi rekanmu melalui sistem
            upvote, pantau tindak lanjut secara transparan, atau sampaikan keluhan dengan jaminan
            perlindungan privasi anonim 100%.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center space-x-3.5"
            >
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
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
