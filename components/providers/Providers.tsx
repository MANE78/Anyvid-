'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UserSettings, FavoriteItem } from '../../lib/types';
import { getLocalStorage, setLocalStorage } from '../../lib/utils';

// Default settings
const defaultSettings: UserSettings = {
  language: 'ar',
  theme: 'light',
  fontSize: 18,
  defaultReciter: 1,
  defaultTranslation: 'en.sahih',
  defaultTafsir: 'ar-tafsir-ibn-kathir',
  playbackSpeed: 1,
  autoPlay: false,
  showTranslation: true,
  showTafsir: false,
};

// Context types
interface AppContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSettings = getLocalStorage('madad-settings', defaultSettings);
    const savedFavorites = getLocalStorage<FavoriteItem[]>('madad-favorites', []);
    
    setSettings(savedSettings);
    setFavorites(savedFavorites);
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme, mounted]);

  // Update settings
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    setLocalStorage('madad-settings', updatedSettings);
  };

  // Add to favorites
  const addToFavorites = (item: FavoriteItem) => {
    const newFavorites = [...favorites, item];
    setFavorites(newFavorites);
    setLocalStorage('madad-favorites', newFavorites);
  };

  // Remove from favorites
  const removeFromFavorites = (id: string) => {
    const newFavorites = favorites.filter(item => item.id !== id);
    setFavorites(newFavorites);
    setLocalStorage('madad-favorites', newFavorites);
  };

  // Check if item is favorite
  const isFavorite = (id: string): boolean => {
    return favorites.some(item => item.id === id);
  };

  // Get current theme
  const getCurrentTheme = (): 'light' | 'dark' => {
    if (settings.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.theme;
  };

  // Toggle theme
  const toggleTheme = () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const value: AppContextType = {
    settings,
    updateSettings,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    theme: getCurrentTheme(),
    toggleTheme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};