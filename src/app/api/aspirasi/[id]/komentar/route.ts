import { NextRequest, NextResponse } from 'next/server';
import { getDb, addCommentInDb } from '@/lib/db';

export async function POST(
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
    const { nama, isAnonim, pesan } = body;

    if (!pesan || !pesan.trim()) {
      return NextResponse.json({ error: 'Pesan komentar tidak boleh kosong' }, { status: 400 });
    }

    const newComment = await addCommentInDb(id, {
      nama: nama || (isAnonim ? 'Mahasiswa' : 'Pengguna'),
      isAnonim: Boolean(isAnonim),
      pesan,
    });

    return NextResponse.json({ success: true, data: newComment, isNeon: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal menambahkan komentar' },
      { status: 500 }
    );
  }
}
