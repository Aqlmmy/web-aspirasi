import { neon } from '@neondatabase/serverless';
import { INITIAL_ASPIRASI } from './mockData';
import { Aspirasi, StatusAspirasi, TanggapanResmi } from '@/types';

// Helper to get Neon SQL client if DATABASE_URL is configured
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.trim() === '') {
    return null;
  }
  return neon(databaseUrl);
}

// Check connection status
export async function testConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const sql = getDb();
    if (!sql) {
      return { connected: false, error: 'DATABASE_URL belum diatur di file .env.local atau Vercel' };
    }
    await sql`SELECT 1;`;
    return { connected: true };
  } catch (error: any) {
    return { connected: false, error: error?.message || 'Gagal terhubung ke Neon PostgreSQL' };
  }
}

// Initialize tables and seed initial mock data if empty
export async function initDatabase(): Promise<{ success: boolean; message: string }> {
  const sql = getDb();
  if (!sql) {
    return { success: false, message: 'DATABASE_URL belum dikonfigurasi' };
  }

  try {
    // 1. Table aspirasi
    await sql`
      CREATE TABLE IF NOT EXISTS aspirasi (
        id VARCHAR(100) PRIMARY KEY,
        judul TEXT NOT NULL,
        deskripsi TEXT NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Menunggu Verifikasi',
        urgensi VARCHAR(50) NOT NULL DEFAULT 'Sedang',
        is_anonim BOOLEAN NOT NULL DEFAULT false,
        penulis JSONB DEFAULT NULL,
        lokasi TEXT,
        tanggal VARCHAR(50) NOT NULL,
        upvotes INTEGER NOT NULL DEFAULT 0,
        lampiran_url TEXT,
        tanggapan_resmi JSONB DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 2. Table komentar
    await sql`
      CREATE TABLE IF NOT EXISTS komentar (
        id VARCHAR(100) PRIMARY KEY,
        aspirasi_id VARCHAR(100) NOT NULL REFERENCES aspirasi(id) ON DELETE CASCADE,
        nama VARCHAR(255) NOT NULL,
        is_anonim BOOLEAN NOT NULL DEFAULT false,
        pesan TEXT NOT NULL,
        tanggal VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 3. Table upvotes (mencegah upvote ganda dari perangkat yang sama)
    await sql`
      CREATE TABLE IF NOT EXISTS aspirasi_upvotes (
        aspirasi_id VARCHAR(100) NOT NULL REFERENCES aspirasi(id) ON DELETE CASCADE,
        client_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (aspirasi_id, client_id)
      );
    `;

    // Check if initial data needs to be seeded
    const countResult = await sql`SELECT COUNT(*)::int as count FROM aspirasi;`;
    const count = countResult[0]?.count ?? 0;

    if (count === 0) {
      for (const item of INITIAL_ASPIRASI) {
        await sql`
          INSERT INTO aspirasi (
            id, judul, deskripsi, kategori, status, urgensi, 
            is_anonim, penulis, lokasi, tanggal, upvotes, 
            lampiran_url, tanggapan_resmi
          ) VALUES (
            ${item.id},
            ${item.judul},
            ${item.deskripsi},
            ${item.kategori},
            ${item.status},
            ${item.urgensi},
            ${item.isAnonim},
            ${item.penulis ? JSON.stringify(item.penulis) : null},
            ${item.lokasi || null},
            ${item.tanggal},
            ${item.upvotes},
            ${item.lampiranUrl || null},
            ${item.tanggapanResmi ? JSON.stringify(item.tanggapanResmi) : null}
          );
        `;

        // Insert mock comments
        if (item.komentar && item.komentar.length > 0) {
          for (const kom of item.komentar) {
            await sql`
              INSERT INTO komentar (
                id, aspirasi_id, nama, is_anonim, pesan, tanggal
              ) VALUES (
                ${kom.id},
                ${item.id},
                ${kom.nama},
                ${kom.isAnonim},
                ${kom.pesan},
                ${kom.tanggal}
              );
            `;
          }
        }
      }
      return { success: true, message: 'Tabel berhasil dibuat dan data awal berhasil di-seed!' };
    }

    return { success: true, message: 'Database siap digunakan.' };
  } catch (error: any) {
    console.error('Error initDatabase:', error);
    return { success: false, message: error?.message || 'Gagal inisialisasi database' };
  }
}

// Fetch all aspirasi
export async function getAllAspirasiFromDb(clientId?: string): Promise<Aspirasi[]> {
  const sql = getDb();
  if (!sql) throw new Error('Database tidak terhubung');

  const safeClientId = clientId || 'anonymous';

  const rows = await sql`
    SELECT 
      a.id,
      a.judul,
      a.deskripsi,
      a.kategori,
      a.status,
      a.urgensi,
      a.is_anonim AS "isAnonim",
      a.penulis,
      a.lokasi,
      a.tanggal,
      a.upvotes,
      a.lampiran_url AS "lampiranUrl",
      a.tanggapan_resmi AS "tanggapanResmi",
      COALESCE(
        json_agg(
          json_build_object(
            'id', k.id,
            'nama', k.nama,
            'isAnonim', k.is_anonim,
            'pesan', k.pesan,
            'tanggal', k.tanggal
          ) ORDER BY k.created_at ASC
        ) FILTER (WHERE k.id IS NOT NULL),
        '[]'::json
      ) AS komentar,
      EXISTS(
        SELECT 1 FROM aspirasi_upvotes u 
        WHERE u.aspirasi_id = a.id AND u.client_id = ${safeClientId}
      ) AS "hasUpvoted"
    FROM aspirasi a
    LEFT JOIN komentar k ON a.id = k.aspirasi_id
    GROUP BY a.id
    ORDER BY a.created_at DESC;
  `;

  return rows.map((r: any) => ({
    id: r.id,
    judul: r.judul,
    deskripsi: r.deskripsi,
    kategori: r.kategori,
    status: r.status,
    urgensi: r.urgensi,
    isAnonim: Boolean(r.isAnonim),
    penulis: r.penulis || undefined,
    lokasi: r.lokasi || undefined,
    tanggal: r.tanggal,
    upvotes: Number(r.upvotes) || 0,
    hasUpvoted: Boolean(r.hasUpvoted),
    lampiranUrl: r.lampiranUrl || undefined,
    tanggapanResmi: r.tanggapanResmi || undefined,
    komentar: Array.isArray(r.komentar) ? r.komentar : [],
  }));
}

// Create new aspirasi
export async function createAspirasiInDb(payload: {
  judul: string;
  deskripsi: string;
  kategori: string;
  urgensi: string;
  isAnonim: boolean;
  penulis?: any;
  lokasi?: string;
  lampiranUrl?: string;
  clientId?: string;
}): Promise<Aspirasi> {
  const sql = getDb();
  if (!sql) throw new Error('Database tidak terhubung');

  const id = `asp-${Date.now()}`;
  const today = new Date().toISOString().split('T')[0];
  const safeClientId = payload.clientId || `client-${Date.now()}`;

  await sql`
    INSERT INTO aspirasi (
      id, judul, deskripsi, kategori, status, urgensi, 
      is_anonim, penulis, lokasi, tanggal, upvotes, lampiran_url
    ) VALUES (
      ${id},
      ${payload.judul},
      ${payload.deskripsi},
      ${payload.kategori},
      'Menunggu Verifikasi',
      ${payload.urgensi},
      ${payload.isAnonim},
      ${payload.penulis ? JSON.stringify(payload.penulis) : null},
      ${payload.lokasi || null},
      ${today},
      1,
      ${payload.lampiranUrl || null}
    );
  `;

  // Auto upvote by creator
  await sql`
    INSERT INTO aspirasi_upvotes (aspirasi_id, client_id)
    VALUES (${id}, ${safeClientId})
    ON CONFLICT DO NOTHING;
  `;

  return {
    id,
    judul: payload.judul,
    deskripsi: payload.deskripsi,
    kategori: payload.kategori as any,
    status: 'Menunggu Verifikasi',
    urgensi: payload.urgensi as any,
    isAnonim: payload.isAnonim,
    penulis: payload.penulis,
    lokasi: payload.lokasi,
    tanggal: today,
    upvotes: 1,
    hasUpvoted: true,
    lampiranUrl: payload.lampiranUrl,
    komentar: [],
  };
}

// Toggle upvote
export async function toggleVoteInDb(aspirasiId: string, clientId: string) {
  const sql = getDb();
  if (!sql) throw new Error('Database tidak terhubung');

  // Check if client already upvoted
  const check = await sql`
    SELECT 1 FROM aspirasi_upvotes 
    WHERE aspirasi_id = ${aspirasiId} AND client_id = ${clientId};
  `;

  const alreadyUpvoted = check.length > 0;

  if (alreadyUpvoted) {
    await sql`
      DELETE FROM aspirasi_upvotes 
      WHERE aspirasi_id = ${aspirasiId} AND client_id = ${clientId};
    `;
    await sql`
      UPDATE aspirasi 
      SET upvotes = GREATEST(0, upvotes - 1) 
      WHERE id = ${aspirasiId};
    `;
    return { hasUpvoted: false };
  } else {
    await sql`
      INSERT INTO aspirasi_upvotes (aspirasi_id, client_id)
      VALUES (${aspirasiId}, ${clientId})
      ON CONFLICT DO NOTHING;
    `;
    await sql`
      UPDATE aspirasi 
      SET upvotes = upvotes + 1 
      WHERE id = ${aspirasiId};
    `;
    return { hasUpvoted: true };
  }
}

// Add comment
export async function addCommentInDb(
  aspirasiId: string,
  data: { nama: string; isAnonim: boolean; pesan: string }
) {
  const sql = getDb();
  if (!sql) throw new Error('Database tidak terhubung');

  const id = `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const today = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO komentar (id, aspirasi_id, nama, is_anonim, pesan, tanggal)
    VALUES (${id}, ${aspirasiId}, ${data.nama}, ${data.isAnonim}, ${data.pesan}, ${today});
  `;

  return {
    id,
    nama: data.nama,
    isAnonim: data.isAnonim,
    pesan: data.pesan,
    tanggal: today,
  };
}

// Update status & response (admin action)
export async function updateStatusInDb(
  aspirasiId: string,
  newStatus: StatusAspirasi,
  tanggapan?: TanggapanResmi
) {
  const sql = getDb();
  if (!sql) throw new Error('Database tidak terhubung');

  if (tanggapan) {
    await sql`
      UPDATE aspirasi 
      SET status = ${newStatus}, tanggapan_resmi = ${JSON.stringify(tanggapan)}
      WHERE id = ${aspirasiId};
    `;
  } else {
    await sql`
      UPDATE aspirasi 
      SET status = ${newStatus}
      WHERE id = ${aspirasiId};
    `;
  }

  return { success: true };
}
