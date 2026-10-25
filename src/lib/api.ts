import { Aspirasi, StatusAspirasi, TanggapanResmi } from '@/types';
import {
  getStoredAspirasi,
  createAspirasi as createLocalAspirasi,
  toggleVoteAspirasi as toggleLocalVote,
  updateStatusAndResponse as updateLocalStatus,
  addKomentarToAspirasi as addLocalKomentar,
} from './storage';

// Get or generate a persistent anonymous client ID for vote tracking
export function getClientId(): string {
  if (typeof window === 'undefined') return 'anon';
  let clientId = localStorage.getItem('suara_mahasiswa_client_id');
  if (!clientId) {
    clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem('suara_mahasiswa_client_id', clientId);
  }
  return clientId;
}

export interface DbStatus {
  connected: boolean;
  isNeon: boolean;
  message: string;
}

export async function checkDatabaseStatus(): Promise<DbStatus> {
  try {
    const res = await fetch('/api/db-status', { cache: 'no-store' });
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (error) {
    return {
      connected: false,
      isNeon: false,
      message: 'Berjalan di mode LocalStorage',
    };
  }
}

export async function fetchAllAspirasi(): Promise<{ data: Aspirasi[]; isNeon: boolean }> {
  const clientId = getClientId();

  try {
    const res = await fetch(`/api/aspirasi?clientId=${encodeURIComponent(clientId)}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.isNeon && Array.isArray(json.data)) {
        return { data: json.data, isNeon: true };
      }
    }
  } catch (error) {
    console.warn('API /api/aspirasi gagal atau offline, beralih ke LocalStorage:', error);
  }

  // Fallback to localStorage
  return { data: getStoredAspirasi(), isNeon: false };
}

export async function createNewAspirasi(
  payload: Omit<Aspirasi, 'id' | 'tanggal' | 'upvotes' | 'hasUpvoted' | 'status' | 'komentar'>,
  isNeon: boolean
): Promise<Aspirasi> {
  const clientId = getClientId();

  if (isNeon) {
    try {
      const res = await fetch('/api/aspirasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, clientId }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.warn('Gagal menyimpan ke Neon, fallback ke LocalStorage:', err);
    }
  }

  // Fallback
  return createLocalAspirasi(payload);
}

export async function toggleAspirasiVote(
  id: string,
  isNeon: boolean,
  currentHasUpvoted: boolean,
  currentUpvotes: number
): Promise<{ hasUpvoted: boolean; upvotes: number }> {
  const clientId = getClientId();

  if (isNeon) {
    try {
      const res = await fetch(`/api/aspirasi/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.isNeon) {
          const newHasUpvoted = Boolean(json.hasUpvoted);
          const newUpvotes = newHasUpvoted
            ? currentUpvotes + 1
            : Math.max(0, currentUpvotes - 1);
          return { hasUpvoted: newHasUpvoted, upvotes: newUpvotes };
        }
      }
    } catch (err) {
      console.warn('Gagal vote ke Neon, fallback ke LocalStorage:', err);
    }
  }

  // Fallback
  toggleLocalVote(id);
  const newHasUpvoted = !currentHasUpvoted;
  const newUpvotes = newHasUpvoted ? currentUpvotes + 1 : Math.max(0, currentUpvotes - 1);
  return { hasUpvoted: newHasUpvoted, upvotes: newUpvotes };
}

export async function addAspirasiComment(
  aspirasiId: string,
  commentData: { nama: string; isAnonim: boolean; pesan: string },
  isNeon: boolean
) {
  if (isNeon) {
    try {
      const res = await fetch(`/api/aspirasi/${aspirasiId}/komentar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.warn('Gagal komentar ke Neon, fallback ke LocalStorage:', err);
    }
  }

  // Fallback
  const updatedList = addLocalKomentar(aspirasiId, commentData);
  const found = updatedList.find((a) => a.id === aspirasiId);
  return found?.komentar[found.komentar.length - 1];
}

export async function updateAspirasiStatus(
  aspirasiId: string,
  newStatus: StatusAspirasi,
  tanggapan: TanggapanResmi | undefined,
  isNeon: boolean
) {
  if (isNeon) {
    try {
      const res = await fetch(`/api/aspirasi/${aspirasiId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, tanggapan }),
      });

      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.warn('Gagal update status ke Neon, fallback ke LocalStorage:', err);
    }
  }

  // Fallback
  updateLocalStatus(aspirasiId, newStatus, tanggapan);
  return true;
}
