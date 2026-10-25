import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAllAspirasiFromDb, createAspirasiInDb, initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json(
      { fallback: true, message: 'DATABASE_URL not set' },
      { status: 200 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || undefined;

    // Ensure database tables exist
    await initDatabase();

    const data = await getAllAspirasiFromDb(clientId);
    return NextResponse.json({ success: true, data, isNeon: true });
  } catch (error: any) {
    console.error('Error fetching aspirasi:', error);
    return NextResponse.json(
      { fallback: true, error: error?.message || 'Database error' },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json(
      { fallback: true, message: 'DATABASE_URL not set' },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const { judul, deskripsi, kategori, urgensi, isAnonim, penulis, lokasi, lampiranUrl, clientId } = body;

    if (!judul || !deskripsi || !kategori) {
      return NextResponse.json(
        { error: 'Judul, deskripsi, dan kategori wajib diisi' },
        { status: 400 }
      );
    }

    const created = await createAspirasiInDb({
      judul,
      deskripsi,
      kategori,
      urgensi: urgensi || 'Sedang',
      isAnonim: Boolean(isAnonim),
      penulis,
      lokasi,
      lampiranUrl,
      clientId,
    });

    return NextResponse.json({ success: true, data: created, isNeon: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating aspirasi:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal menyimpan ke database' },
      { status: 500 }
    );
  }
}
