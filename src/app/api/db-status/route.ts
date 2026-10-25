import { NextResponse } from 'next/server';
import { testConnection, initDatabase, getDb } from '@/lib/db';

export async function GET() {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({
      connected: false,
      isNeon: false,
      message: 'DATABASE_URL belum diatur. Berjalan dalam mode LocalStorage.',
    });
  }

  const conn = await testConnection();
  if (!conn.connected) {
    return NextResponse.json({
      connected: false,
      isNeon: false,
      message: conn.error || 'Gagal tersambung ke Neon PostgreSQL.',
    });
  }

  // Ensure tables and seed exist
  const init = await initDatabase();

  return NextResponse.json({
    connected: true,
    isNeon: true,
    message: init.message || 'Terkoneksi ke Neon PostgreSQL.',
  });
}
