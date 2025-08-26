import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Arabic numbers conversion
export const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export const toArabicNumber = (num: number | string): string => {
  return num.toString().replace(/\d/g, (digit) => arabicNumbers[parseInt(digit)]);
};

export const toEnglishNumber = (arabicNum: string): number => {
  const englishNum = arabicNum.replace(/[٠-٩]/g, (digit) => {
    return arabicNumbers.indexOf(digit).toString();
  });
  return parseInt(englishNum) || 0;
};

// Format time utilities
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.floor(seconds)} ثانية`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins} دقيقة`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours} ساعة و ${mins} دقيقة`;
  }
};

// Date formatting
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'الآن';
  } else if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `منذ ${mins} دقيقة`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `منذ ${hours} ساعة`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `منذ ${days} يوم`;
  } else {
    return formatDate(d);
  }
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
};

// Surah utilities
export const getSurahType = (revelationType: string): { 
  arabic: string; 
  color: string; 
  bgColor: string; 
} => {
  if (revelationType === 'Meccan') {
    return {
      arabic: 'مكية',
      color: 'text-orange-700 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    };
  } else {
    return {
      arabic: 'مدنية',
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    };
  }
};

export const getSurahName = (surah: { name: string; englishName: string }): {
  arabic: string;
  english: string;
} => {
  return {
    arabic: surah.name,
    english: surah.englishName
  };
};

// Audio utilities
export const preloadAudio = (url: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = () => reject(new Error('فشل في تحميل الملف الصوتي'));
    
    audio.src = url;
  });
};

export const getAudioDuration = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    
    audio.onloadedmetadata = () => resolve(audio.duration);
    audio.onerror = () => reject(new Error('فشل في قراءة مدة الملف الصوتي'));
    
    audio.src = url;
  });
};

// Local Storage utilities
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// URL utilities
export const createShareUrl = (surahNumber: number, ayahNumber?: number): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const path = ayahNumber 
    ? `/surah/${surahNumber}#ayah-${ayahNumber}`
    : `/surah/${surahNumber}`;
  
  return `${baseUrl}${path}`;
};

export const generateMetaTags = (surah: { 
  name: string; 
  englishName: string; 
  numberOfAyahs: number;
  revelationType: string;
}): {
  title: string;
  description: string;
  keywords: string;
} => {
  return {
    title: `سورة ${surah.name} - ${surah.englishName} | مداد الهدي`,
    description: `اقرأ واستمع لسورة ${surah.name} (${surah.englishName}) - سورة ${getSurahType(surah.revelationType).arabic} تحتوي على ${toArabicNumber(surah.numberOfAyahs)} آية`,
    keywords: `سورة ${surah.name}, ${surah.englishName}, القرآن الكريم, تلاوة, تفسير, ترجمة, ${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}`
  };
};

// Validation utilities
export const isValidSurahNumber = (num: number): boolean => {
  return Number.isInteger(num) && num >= 1 && num <= 114;
};

export const isValidAyahNumber = (ayahNum: number, surahNum: number): boolean => {
  // This would ideally check against actual ayah counts per surah
  // For now, basic validation
  return Number.isInteger(ayahNum) && ayahNum >= 1;
};

// Search utilities
export const normalizeArabicText = (text: string): string => {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[ًٌٍَُِْ]/g, '') // Remove diacritics
    .trim();
};

export const fuzzySearch = (query: string, text: string): boolean => {
  const normalizedQuery = normalizeArabicText(query.toLowerCase());
  const normalizedText = normalizeArabicText(text.toLowerCase());
  
  return normalizedText.includes(normalizedQuery);
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

// Error utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'حدث خطأ غير معروف';
};

// Constants
export const QURAN_CONSTANTS = {
  TOTAL_SURAHS: 114,
  TOTAL_AYAHS: 6236,
  TOTAL_WORDS: 77449,
  TOTAL_LETTERS: 323015,
  SAJDA_AYAHS: 15,
} as const;