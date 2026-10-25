import { NextRequest, NextResponse } from 'next/server';
import { getDb, updateStatusInDb } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
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
