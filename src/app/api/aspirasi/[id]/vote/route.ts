import { NextRequest, NextResponse } from 'next/server';
import { getDb, toggleVoteInDb } from '@/lib/db';

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
    const body = await request.json().catch(() => ({}));
    const clientId = body.clientId || 'anonymous';

    const result = await toggleVoteInDb(id, clientId);
    return NextResponse.json({ success: true, ...result, isNeon: true });
  } catch (error: any) {
    console.error('Error voting:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal update vote' },
      { status: 500 }
    );
  }
}
