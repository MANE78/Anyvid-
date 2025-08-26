'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Play, 
  Heart, 
  ArrowLeft,
  MapPin,
  Hash
} from 'lucide-react';
import { getAllSurahs } from '../../lib/api/quran';
import { toArabicNumber, getSurahType, fuzzySearch, cn } from '../../lib/utils';
import { useApp } from '../../components/providers/Providers';
import type { Surah } from '../../lib/types';

// Loading Skeleton Component
const SurahCardSkeleton = () => (
  <div className="islamic-card">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="loading-pulse h-6 w-32 rounded-lg mb-2" />
        <div className="loading-pulse h-4 w-24 rounded-lg mb-2" />
        <div className="loading-pulse h-3 w-20 rounded-lg" />
      </div>
      <div className="loading-pulse w-12 h-12 rounded-full" />
    </div>
    <div className="loading-pulse h-10 w-full rounded-xl" />
  </div>
);

// Surah Card Component
const SurahCard = ({ surah }: { surah: Surah }) => {
  const { isFavorite } = useApp();
  const surahType = getSurahType(surah.revelationType);
  
  return (
    <div className="islamic-card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 quran-text">
              {surah.name}
            </h3>
            {isFavorite(`surah-${surah.number}`) && (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            )}
          </div>
          
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-1">
            {surah.englishName}
          </p>
          
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-3">
            {surah.englishNameTranslation}
          </p>
          
          <div className="flex items-center gap-3">
            <span className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1',
              surahType.bgColor,
              surahType.color
            )}>
              <MapPin className="w-3 h-3" />
              {surahType.arabic}
            </span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {toArabicNumber(surah.numberOfAyahs)} آية
            </span>
          </div>
        </div>
        
        <div className="verse-number group-hover:scale-110 transition-transform">
          {toArabicNumber(surah.number)}
        </div>
      </div>

      <div className="flex gap-2">
        <Link 
          href={`/surah/${surah.number}`}
          className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          قراءة
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <button 
          className="btn-secondary px-4 py-2 flex items-center justify-center"
          title="تشغيل التلاوة"
        >
          <Play className="w-4 h-4" />
        </button>
        <button 
          className="btn-secondary px-4 py-2 flex items-center justify-center"
          title="إضافة للمفضلة"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Filter Component
const FilterSection = ({ 
  searchQuery, 
  onSearchChange, 
  revelationType, 
  onRevelationTypeChange,
  sortBy,
  onSortByChange 
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  revelationType: string;
  onRevelationTypeChange: (type: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
}) => (
  <div className="islamic-card mb-8">
    <div className="flex items-center gap-3 mb-4">
      <Filter className="w-5 h-5 text-blue-600" />
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        البحث والفلترة
      </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="ابحث عن السورة..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input pr-10"
        />
      </div>
      
      {/* Revelation Type Filter */}
      <select
        value={revelationType}
        onChange={(e) => onRevelationTypeChange(e.target.value)}
        className="search-input"
      >
        <option value="">جميع السور</option>
        <option value="Meccan">السور المكية</option>
        <option value="Medinan">السور المدنية</option>
      </select>
      
      {/* Sort By */}
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="search-input"
      >
        <option value="number">ترتيب المصحف</option>
        <option value="name">الترتيب الأبجدي</option>
        <option value="ayahs">عدد الآيات</option>
        <option value="revelation">نوع السورة</option>
      </select>
    </div>
  </div>
);

// Stats Component
const SurahStats = ({ surahs, filteredSurahs }: { surahs: Surah[]; filteredSurahs: Surah[] }) => {
  const meccanCount = filteredSurahs.filter(s => s.revelationType === 'Meccan').length;
  const medinanCount = filteredSurahs.filter(s => s.revelationType === 'Medinan').length;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-blue-600 mb-1">
          {toArabicNumber(filteredSurahs.length)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          السور المعروضة
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-orange-600 mb-1">
          {toArabicNumber(meccanCount)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          سورة مكية
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-green-600 mb-1">
          {toArabicNumber(medinanCount)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          سورة مدنية
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-purple-600 mb-1">
          {toArabicNumber(filteredSurahs.reduce((sum, s) => sum + s.numberOfAyahs, 0))}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          مجموع الآيات
        </p>
      </div>
    </div>
  );
};

export default function SurahPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationType, setRevelationType] = useState('');
  const [sortBy, setSortBy] = useState('number');

  // Load surahs
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        const surahsData = await getAllSurahs();
        setSurahs(surahsData);
      } catch (err) {
        setError('فشل في تحميل السور. يرجى المحاولة مرة أخرى.');
        console.error('Error loading surahs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  // Filter and sort surahs
  const filteredSurahs = useMemo(() => {
    let filtered = surahs.filter(surah => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim();
        const matchesName = fuzzySearch(query, surah.name);
        const matchesEnglish = fuzzySearch(query, surah.englishName);
        const matchesTranslation = fuzzySearch(query, surah.englishNameTranslation);
        const matchesNumber = surah.number.toString().includes(query);
        
        if (!matchesName && !matchesEnglish && !matchesTranslation && !matchesNumber) {
          return false;
        }
      }
      
      // Revelation type filter
      if (revelationType && surah.revelationType !== revelationType) {
        return false;
      }
      
      return true;
    });

    // Sort surahs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        case 'ayahs':
          return b.numberOfAyahs - a.numberOfAyahs;
        case 'revelation':
          return a.revelationType.localeCompare(b.revelationType);
        default: // 'number'
          return a.number - b.number;
      }
    });

    return filtered;
  }, [surahs, searchQuery, revelationType, sortBy]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="islamic-card text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            خطأ في التحميل
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            سور القرآن الكريم
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            تصفح واقرأ واستمع لجميع سور القرآن الكريم مع التفسير والترجمة
          </p>
        </div>

        {/* Filters */}
        <FilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          revelationType={revelationType}
          onRevelationTypeChange={setRevelationType}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* Statistics */}
        {!loading && surahs.length > 0 && (
          <SurahStats surahs={surahs} filteredSurahs={filteredSurahs} />
        )}

        {/* Surahs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <SurahCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredSurahs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurahs.map((surah) => (
              <SurahCard key={surah.number} surah={surah} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              لم نجد أي سور تطابق معايير البحث الخاصة بك
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setRevelationType('');
                setSortBy('number');
              }}
              className="btn-primary"
            >
              مسح الفلاتر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}