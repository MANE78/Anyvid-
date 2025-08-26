// API Response Types
export interface QuranApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

// Surah Types
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  ayahs?: Ayah[];
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda?: boolean | { id: number; recommended: boolean; obligatory: boolean; };
  audio?: string;
  audioSecondary?: string[];
}

// Reciter Types
export interface Reciter {
  id: number;
  name: string;
  letter: string;
  server: string;
  subfolder: string;
  bitrate: number;
  count: number;
  rewaya: Rewaya;
}

export interface Rewaya {
  id: number;
  name: string;
  letter: string;
}

// Translation Types
export interface Translation {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction?: string;
}

// Tafsir Types
export interface Tafsir {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
}

export interface TafsirText {
  verse_id: number;
  verse_key: string;
  text: string;
  language_name: string;
  resource_name: string;
}

// Search Types
export interface SearchResult {
  count: number;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  number: number;
  text: string;
  edition: Translation;
  surah: Surah;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
}

// Favorites Types
export interface FavoriteItem {
  id: string;
  type: 'verse' | 'surah' | 'recitation';
  surahNumber: number;
  ayahNumber?: number;
  reciterId?: number;
  title: string;
  subtitle?: string;
  dateAdded: string;
}

// Settings Types
export interface UserSettings {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  defaultReciter: number;
  defaultTranslation: string;
  defaultTafsir: string;
  playbackSpeed: number;
  autoPlay: boolean;
  showTranslation: boolean;
  showTafsir: boolean;
}

// Local Storage Types
export interface LocalStorageData {
  favorites: FavoriteItem[];
  settings: UserSettings;
  recentlyViewed: {
    type: 'surah' | 'search';
    id: number;
    title: string;
    date: string;
  }[];
  lastPosition?: {
    surahNumber: number;
    ayahNumber: number;
    scrollPosition: number;
  };
}

// Statistics Types
export interface QuranStats {
  numberOfSurahs: number;
  numberOfAyahs: number;
  numberOfWords: number;
  numberOfLetters: number;
  numberOfSajdas: number;
}

// Audio Types
export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  isLoading: boolean;
  error: string | null;
}

export interface AudioPlaylist {
  currentIndex: number;
  items: AudioPlaylistItem[];
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface AudioPlaylistItem {
  surahNumber: number;
  ayahNumber?: number;
  reciterId: number;
  title: string;
  duration?: number;
  url: string;
}