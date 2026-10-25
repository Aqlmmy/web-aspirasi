import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { pin } = body;
    const expectedPin = (process.env.ADMIN_PIN || 'bem2026').trim();

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Harap masukkan PIN Admin.' },
        { status: 400 }
      );
    }

    if (pin.trim() === expectedPin) {
      return NextResponse.json({
        success: true,
        message: 'Autentikasi Admin BEM berhasil.',
      });
    }

    return NextResponse.json(
      { success: false, error: 'PIN Admin salah. Akses ditolak.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal memverifikasi PIN.' },
      { status: 500 }
    );
  }
}
