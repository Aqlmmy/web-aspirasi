import { Aspirasi, StatusAspirasi, TanggapanResmi, Komentar } from '@/types';
import { INITIAL_ASPIRASI } from './mockData';

const STORAGE_KEY = 'suara_mahasiswa_aspirasi_data';

export const getStoredAspirasi = (): Aspirasi[] => {
  if (typeof window === 'undefined') {
    return INITIAL_ASPIRASI;
  }

  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASPIRASI));
      return INITIAL_ASPIRASI;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('Gagal membaca data aspirasi dari storage:', error);
    return INITIAL_ASPIRASI;
  }
};

export const saveAspirasiToStorage = (data: Aspirasi[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Gagal menyimpan data aspirasi:', error);
  }
};

export const createAspirasi = (
  payload: Omit<Aspirasi, 'id' | 'tanggal' | 'upvotes' | 'hasUpvoted' | 'status' | 'komentar'>
): Aspirasi => {
  const currentList = getStoredAspirasi();
  const today = new Date().toISOString().split('T')[0];

  const newAspirasi: Aspirasi = {
    ...payload,
    id: `asp-${Date.now()}`,
    status: 'Menunggu Verifikasi',
    tanggal: today,
    upvotes: 1,
    hasUpvoted: true,
    komentar: [],
  };

  const updatedList = [newAspirasi, ...currentList];
  saveAspirasiToStorage(updatedList);
  return newAspirasi;
};

export const toggleVoteAspirasi = (id: string): Aspirasi[] => {
  const currentList = getStoredAspirasi();
  const updated = currentList.map((item) => {
    if (item.id === id) {
      const alreadyUpvoted = !!item.hasUpvoted;
      return {
        ...item,
        hasUpvoted: !alreadyUpvoted,
        upvotes: alreadyUpvoted ? Math.max(0, item.upvotes - 1) : item.upvotes + 1,
      };
    }
    return item;
  });

  saveAspirasiToStorage(updated);
  return updated;
};

export const updateStatusAndResponse = (
  id: string,
  newStatus: StatusAspirasi,
  tanggapan?: TanggapanResmi
): Aspirasi[] => {
  const currentList = getStoredAspirasi();
  const updated = currentList.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus,
        tanggapanResmi: tanggapan || item.tanggapanResmi,
      };
    }
    return item;
  });

  saveAspirasiToStorage(updated);
  return updated;
};

export const addKomentarToAspirasi = (
  aspirasiId: string,
  komentarData: { nama: string; isAnonim: boolean; pesan: string }
): Aspirasi[] => {
  const currentList = getStoredAspirasi();
  const today = new Date().toISOString().split('T')[0];

  const updated = currentList.map((item) => {
    if (item.id === aspirasiId) {
      const newComment: Komentar = {
        id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nama: komentarData.nama,
        isAnonim: komentarData.isAnonim,
        pesan: komentarData.pesan,
        tanggal: today,
      };
      return {
        ...item,
        komentar: [...item.komentar, newComment],
      };
    }
    return item;
  });

  saveAspirasiToStorage(updated);
  return updated;
};

export const resetDataToDefault = (): Aspirasi[] => {
  saveAspirasiToStorage(INITIAL_ASPIRASI);
  return INITIAL_ASPIRASI;
};
