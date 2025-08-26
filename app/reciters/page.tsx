'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  Play, 
  Pause,
  Heart, 
  Star,
  Volume2,
  Download
} from 'lucide-react';
import { getReciters } from '../../lib/api/quran';
import { toArabicNumber, fuzzySearch, cn } from '../../lib/utils';
import { useApp } from '../../components/providers/Providers';
import type { Reciter } from '../../lib/types';

// Loading Skeleton
const ReciterCardSkeleton = () => (
  <div className="islamic-card">
    <div className="flex items-center gap-4 mb-4">
      <div className="loading-pulse w-16 h-16 rounded-full" />
      <div className="flex-1">
        <div className="loading-pulse h-5 w-32 rounded-lg mb-2" />
        <div className="loading-pulse h-4 w-24 rounded-lg" />
      </div>
      <div className="loading-pulse w-8 h-8 rounded-full" />
    </div>
    <div className="loading-pulse h-10 w-full rounded-xl" />
  </div>
);

// Reciter Card Component
const ReciterCard = ({ 
  reciter, 
  isPlaying, 
  onPlay, 
  onPause 
}: { 
  reciter: Reciter; 
  isPlaying: boolean; 
  onPlay: () => void; 
  onPause: () => void; 
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useApp();
  const favoriteId = `reciter-${reciter.id}`;
  const isFav = isFavorite(favoriteId);
  
  const handleToggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(favoriteId);
    } else {
      addToFavorites({
        id: favoriteId,
        type: 'recitation',
        surahNumber: 1, // Default to Al-Fatiha
        reciterId: reciter.id,
        title: reciter.name,
        subtitle: `رواية ${reciter.rewaya?.name || 'حفص عن عاصم'}`,
        dateAdded: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="islamic-card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8 text-white" />
          </div>
          
          {/* Reciter Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {reciter.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              رواية {reciter.rewaya?.name || 'حفص عن عاصم'}
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium">
                {toArabicNumber(reciter.count || 114)} سورة
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                {reciter.bitrate} كيلوبت/ثانية
              </span>
            </div>
          </div>
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
            isFav 
              ? "bg-red-100 dark:bg-red-900/30 text-red-600" 
              : "bg-slate-100 dark:bg-slate-700 text-slate-600 hover:bg-red-100 hover:text-red-600"
          )}
          title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        >
          <Heart className={cn("w-4 h-4", isFav && "fill-current")} />
        </button>
      </div>

      {/* Quality Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "w-4 h-4",
                i < Math.floor(reciter.bitrate / 32) ? "text-yellow-500 fill-current" : "text-slate-300"
              )} 
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-500">
          جودة الصوت
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link 
          href={`/reciters/${reciter.id}`}
          className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4" />
          عرض التلاوات
        </Link>
        
        <button 
          onClick={isPlaying ? onPause : onPlay}
          className="btn-secondary px-4 py-2 flex items-center justify-center"
          title={isPlaying ? "إيقاف التشغيل" : "تشغيل عينة"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
        
        <button 
          className="btn-secondary px-4 py-2 flex items-center justify-center"
          title="تحميل التلاوات"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Filter Component
const FilterSection = ({ 
  searchQuery, 
  onSearchChange, 
  selectedRewaya, 
  onRewayaChange,
  sortBy,
  onSortByChange,
  rewayas
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRewaya: string;
  onRewayaChange: (rewaya: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  rewayas: string[];
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
          placeholder="ابحث عن القارئ..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input pr-10"
        />
      </div>
      
      {/* Rewaya Filter */}
      <select
        value={selectedRewaya}
        onChange={(e) => onRewayaChange(e.target.value)}
        className="search-input"
      >
        <option value="">جميع الروايات</option>
        {rewayas.map(rewaya => (
          <option key={rewaya} value={rewaya}>{rewaya}</option>
        ))}
      </select>
      
      {/* Sort By */}
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="search-input"
      >
        <option value="name">ترتيب أبجدي</option>
        <option value="quality">حسب الجودة</option>
        <option value="count">عدد السور</option>
        <option value="popularity">الأكثر شهرة</option>
      </select>
    </div>
  </div>
);

// Stats Component
const RecitersStats = ({ reciters, filteredReciters }: { reciters: Reciter[]; filteredReciters: Reciter[] }) => {
  const avgBitrate = filteredReciters.length > 0 
    ? Math.round(filteredReciters.reduce((sum, r) => sum + r.bitrate, 0) / filteredReciters.length)
    : 0;
  
  const uniqueRewayas = new Set(filteredReciters.map(r => r.rewaya?.name).filter(Boolean)).size;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-blue-600 mb-1">
          {toArabicNumber(filteredReciters.length)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          قارئ متاح
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-purple-600 mb-1">
          {toArabicNumber(uniqueRewayas)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          رواية مختلفة
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-green-600 mb-1">
          {toArabicNumber(avgBitrate)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          متوسط الجودة
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-orange-600 mb-1">
          {toArabicNumber(filteredReciters.reduce((sum, r) => sum + (r.count || 0), 0))}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          مجموع التلاوات
        </p>
      </div>
    </div>
  );
};

export default function RecitersPage() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingReciter, setPlayingReciter] = useState<number | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRewaya, setSelectedRewaya] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Load reciters
  useEffect(() => {
    const loadReciters = async () => {
      try {
        setLoading(true);
        const recitersData = await getReciters();
        setReciters(recitersData);
      } catch (err) {
        setError('فشل في تحميل القراء. يرجى المحاولة مرة أخرى.');
        console.error('Error loading reciters:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReciters();
  }, []);

  // Get unique rewayas
  const rewayas = useMemo(() => {
    const uniqueRewayas = new Set(reciters.map(r => r.rewaya?.name).filter(Boolean));
    return Array.from(uniqueRewayas).sort();
  }, [reciters]);

  // Filter and sort reciters
  const filteredReciters = useMemo(() => {
    let filtered = reciters.filter(reciter => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim();
        const matchesName = fuzzySearch(query, reciter.name);
        const matchesRewaya = reciter.rewaya?.name && fuzzySearch(query, reciter.rewaya.name);
        
        if (!matchesName && !matchesRewaya) {
          return false;
        }
      }
      
      // Rewaya filter
      if (selectedRewaya && reciter.rewaya?.name !== selectedRewaya) {
        return false;
      }
      
      return true;
    });

    // Sort reciters
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'quality':
          return b.bitrate - a.bitrate;
        case 'count':
          return (b.count || 0) - (a.count || 0);
        case 'popularity':
          // Simple popularity based on bitrate and count
          return (b.bitrate * (b.count || 1)) - (a.bitrate * (a.count || 1));
        default: // 'name'
          return a.name.localeCompare(b.name, 'ar');
      }
    });

    return filtered;
  }, [reciters, searchQuery, selectedRewaya, sortBy]);

  const handlePlayReciter = (reciterId: number) => {
    if (playingReciter === reciterId) {
      setPlayingReciter(null);
    } else {
      setPlayingReciter(reciterId);
      // In a real app, you would start playing audio here
      // For demo purposes, we'll auto-stop after 3 seconds
      setTimeout(() => {
        setPlayingReciter(null);
      }, 3000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="islamic-card text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
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
            قراء القرآن الكريم
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            استمع لتلاوات القرآن الكريم بأصوات أشهر القراء من جميع أنحاء العالم الإسلامي
          </p>
        </div>

        {/* Filters */}
        <FilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRewaya={selectedRewaya}
          onRewayaChange={setSelectedRewaya}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          rewayas={rewayas}
        />

        {/* Statistics */}
        {!loading && reciters.length > 0 && (
          <RecitersStats reciters={reciters} filteredReciters={filteredReciters} />
        )}

        {/* Reciters Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ReciterCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredReciters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReciters.map((reciter) => (
              <ReciterCard
                key={reciter.id}
                reciter={reciter}
                isPlaying={playingReciter === reciter.id}
                onPlay={() => handlePlayReciter(reciter.id)}
                onPause={() => setPlayingReciter(null)}
              />
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
              لم نجد أي قراء يطابقون معايير البحث الخاصة بك
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRewaya('');
                setSortBy('name');
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