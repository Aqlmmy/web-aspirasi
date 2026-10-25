import { NextRequest, NextResponse } from 'next/server';
import { getDb, updateStatusInDb } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const expectedPin = (process.env.ADMIN_PIN || 'bem2026').trim();
  const providedPin = request.headers.get('x-admin-pin') || '';

  if (providedPin !== expectedPin) {
    return NextResponse.json(
      { error: 'Akses ditolak: Anda harus memasukkan PIN Admin yang valid untuk mengubah status.' },
      { status: 401 }
    );
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ fallback: true }, { status: 200 });
  }

  try {
    const { id } = await props.params;
    const body = await request.json();
    const { status, tanggapan } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status wajib ditentukan' }, { status: 400 });
    }

    await updateStatusInDb(id, status, tanggapan);
    return NextResponse.json({ success: true, isNeon: true });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal mengubah status aspirasi' },
      { status: 500 }
    );
  }
}
