import axios from 'axios';
import type { 
  QuranApiResponse, 
  Surah, 
  Translation, 
  SearchResult, 
  Reciter, 
  Tafsir, 
  TafsirText,
  QuranStats 
} from '../types';

// API Base URLs
const ALQURAN_API = 'https://api.alquran.cloud/v1';
const MP3QURAN_API = 'https://mp3quran.net/api/v3';
const QURAN_COM_API = 'https://api.quran.com/api/v4';

// Create axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleApiError = (error: any, context: string) => {
  console.error(`API Error in ${context}:`, error);
  throw new Error(`خطأ في تحميل ${context}: ${error.message}`);
};

// Quran Statistics API
export const getQuranStats = async (): Promise<QuranStats> => {
  try {
    const response = await api.get(`${ALQURAN_API}/meta`);
    const data = response.data.data;
    
    return {
      numberOfSurahs: data.surahs?.count || 114,
      numberOfAyahs: data.ayahs?.count || 6236,
      numberOfWords: data.words?.count || 77449,
      numberOfLetters: data.letters?.count || 323015,
      numberOfSajdas: data.sajdas?.count || 15,
    };
  } catch (error) {
    handleApiError(error, 'إحصائيات القرآن');
    // Return default stats as fallback
    return {
      numberOfSurahs: 114,
      numberOfAyahs: 6236,
      numberOfWords: 77449,
      numberOfLetters: 323015,
      numberOfSajdas: 15,
    };
  }
};

// Get all Surahs
export const getAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await api.get(`${ALQURAN_API}/surah`);
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'قائمة السور');
    return [];
  }
};

// Get specific Surah with Ayahs
export const getSurah = async (surahNumber: number): Promise<Surah> => {
  try {
    const response = await api.get(`${ALQURAN_API}/surah/${surahNumber}`);
    return response.data.data;
  } catch (error) {
    handleApiError(error, `السورة رقم ${surahNumber}`);
    throw error;
  }
};

// Get random Surah (client-side implementation)
export const getRandomSurah = async (): Promise<Surah> => {
  const randomNumber = Math.floor(Math.random() * 114) + 1;
  return getSurah(randomNumber);
};

// Get Surah with specific translation
export const getSurahWithTranslation = async (
  surahNumber: number, 
  edition: string = 'en.sahih'
): Promise<Surah> => {
  try {
    const response = await api.get(`${ALQURAN_API}/surah/${surahNumber}/${edition}`);
    return response.data.data;
  } catch (error) {
    handleApiError(error, `ترجمة السورة رقم ${surahNumber}`);
    throw error;
  }
};

// Get available translations
export const getTranslations = async (): Promise<Translation[]> => {
  try {
    const response = await api.get(`${ALQURAN_API}/edition`);
    return response.data.data.filter((edition: Translation) => 
      edition.type === 'translation'
    );
  } catch (error) {
    handleApiError(error, 'قائمة الترجمات');
    return [];
  }
};

// Search in Quran
export const searchQuran = async (
  query: string, 
  edition: string = 'ar',
  page: number = 1
): Promise<SearchResult> => {
  try {
    const response = await api.get(
      `${ALQURAN_API}/search/${encodeURIComponent(query)}/all/${edition}?page=${page}`
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'البحث في القرآن');
    return {
      count: 0,
      totalResults: 0,
      totalPages: 0,
      currentPage: 1,
      matches: []
    };
  }
};

// Get all reciters
export const getReciters = async (): Promise<Reciter[]> => {
  try {
    const response = await api.get(`${MP3QURAN_API}/reciters?language=ar`);
    return response.data.reciters || [];
  } catch (error) {
    handleApiError(error, 'قائمة القراء');
    return [];
  }
};

// Get reciter details
export const getReciter = async (reciterId: number): Promise<Reciter | null> => {
  try {
    const reciters = await getReciters();
    return reciters.find(reciter => reciter.id === reciterId) || null;
  } catch (error) {
    handleApiError(error, `تفاصيل القارئ ${reciterId}`);
    return null;
  }
};

// Get audio URL for specific recitation
export const getAudioUrl = (reciter: Reciter, surahNumber: number): string => {
  const paddedSurahNumber = surahNumber.toString().padStart(3, '0');
  return `${reciter.server}${reciter.subfolder}${paddedSurahNumber}.mp3`;
};

// Get available Tafasir
export const getTafasir = async (): Promise<Tafsir[]> => {
  try {
    const response = await api.get(`${QURAN_COM_API}/resources/tafsirs`);
    return response.data.tafsirs || [];
  } catch (error) {
    handleApiError(error, 'قائمة التفاسير');
    return [];
  }
};

// Get Tafsir for specific Surah
export const getSurahTafsir = async (
  surahNumber: number, 
  tafsirId: string = 'ar-tafsir-ibn-kathir'
): Promise<TafsirText[]> => {
  try {
    const response = await api.get(
      `${QURAN_COM_API}/chapters/${surahNumber}/tafsirs?tafsir_id=${tafsirId}`
    );
    return response.data.tafsirs || [];
  } catch (error) {
    handleApiError(error, `تفسير السورة رقم ${surahNumber}`);
    return [];
  }
};

// Get Tafsir for specific verse
export const getVerseTafsir = async (
  verseKey: string, // Format: "1:1" (surah:ayah)
  tafsirId: string = 'ar-tafsir-ibn-kathir'
): Promise<TafsirText | null> => {
  try {
    const response = await api.get(
      `${QURAN_COM_API}/verses/${verseKey}/tafsirs?tafsir_id=${tafsirId}`
    );
    return response.data.tafsirs?.[0] || null;
  } catch (error) {
    handleApiError(error, `تفسير الآية ${verseKey}`);
    return null;
  }
};

// Get Ayah by number (global ayah number)
export const getAyah = async (
  ayahNumber: number, 
  edition: string = 'ar'
): Promise<any> => {
  try {
    const response = await api.get(`${ALQURAN_API}/ayah/${ayahNumber}/${edition}`);
    return response.data.data;
  } catch (error) {
    handleApiError(error, `الآية رقم ${ayahNumber}`);
    throw error;
  }
};

// Utility function to get Surah info by number
export const getSurahInfo = async (surahNumber: number): Promise<Surah> => {
  try {
    const surahs = await getAllSurahs();
    const surah = surahs.find(s => s.number === surahNumber);
    if (!surah) {
      throw new Error(`السورة رقم ${surahNumber} غير موجودة`);
    }
    return surah;
  } catch (error) {
    handleApiError(error, `معلومات السورة رقم ${surahNumber}`);
    throw error;
  }
};

// Get multiple Surahs with translations (batch request)
export const getSurahsWithTranslation = async (
  surahNumbers: number[], 
  edition: string = 'en.sahih'
): Promise<Surah[]> => {
  try {
    const promises = surahNumbers.map(num => getSurahWithTranslation(num, edition));
    return await Promise.all(promises);
  } catch (error) {
    handleApiError(error, 'الترجمات المتعددة');
    return [];
  }
};