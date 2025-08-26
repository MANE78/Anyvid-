'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  BookOpen, 
  Users, 
  Trash2, 
  Share, 
  Filter,
  Calendar,
  ArrowLeft,
  Search
} from 'lucide-react';
import { useApp } from '../../components/providers/Providers';
import { toArabicNumber, formatRelativeTime, cn } from '../../lib/utils';
import type { FavoriteItem } from '../../lib/types';

// Favorite Card Component
const FavoriteCard = ({ 
  favorite, 
  onRemove 
}: { 
  favorite: FavoriteItem; 
  onRemove: () => void; 
}) => {
  const getIcon = () => {
    switch (favorite.type) {
      case 'verse':
        return BookOpen;
      case 'surah':
        return BookOpen;
      case 'recitation':
        return Users;
      default:
        return Heart;
    }
  };

  const getColor = () => {
    switch (favorite.type) {
      case 'verse':
        return 'text-blue-600';
      case 'surah':
        return 'text-green-600';
      case 'recitation':
        return 'text-purple-600';
      default:
        return 'text-red-600';
    }
  };

  const getBgColor = () => {
    switch (favorite.type) {
      case 'verse':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'surah':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'recitation':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'bg-red-100 dark:bg-red-900/30';
    }
  };

  const getLink = () => {
    switch (favorite.type) {
      case 'verse':
        return `/surah/${favorite.surahNumber}#ayah-${favorite.ayahNumber}`;
      case 'surah':
        return `/surah/${favorite.surahNumber}`;
      case 'recitation':
        return `/reciters/${favorite.reciterId}`;
      default:
        return '#';
    }
  };

  const getTypeText = () => {
    switch (favorite.type) {
      case 'verse':
        return 'آية';
      case 'surah':
        return 'سورة';
      case 'recitation':
        return 'تلاوة';
      default:
        return 'مفضلة';
    }
  };

  const Icon = getIcon();

  return (
    <div className="islamic-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
            getBgColor()
          )}>
            <Icon className={cn('w-6 h-6', getColor())} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              {favorite.title}
            </h3>
            {favorite.subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {favorite.subtitle}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className={cn(
                'px-2 py-1 rounded-lg text-xs font-medium',
                getBgColor(),
                getColor()
              )}>
                {getTypeText()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatRelativeTime(favorite.dateAdded)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center transition-colors"
            title="مشاركة"
          >
            <Share className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
          
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors"
            title="حذف من المفضلة"
          >
            <Trash2 className="w-4 h-4 text-slate-600 dark:text-slate-400 hover:text-red-600" />
          </button>
        </div>
      </div>

      <Link 
        href={getLink()}
        className="btn-primary w-full text-center flex items-center justify-center gap-2"
      >
        {favorite.type === 'verse' && <BookOpen className="w-4 h-4" />}
        {favorite.type === 'surah' && <BookOpen className="w-4 h-4" />}
        {favorite.type === 'recitation' && <Users className="w-4 h-4" />}
        {favorite.type === 'verse' && 'اقرأ الآية'}
        {favorite.type === 'surah' && 'اقرأ السورة'}
        {favorite.type === 'recitation' && 'استمع للتلاوة'}
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
};

// Filter Component
const FilterSection = ({ 
  searchQuery, 
  onSearchChange, 
  filterType, 
  onFilterTypeChange,
  sortBy,
  onSortByChange 
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
}) => (
  <div className="islamic-card mb-6">
    <div className="flex items-center gap-3 mb-4">
      <Filter className="w-5 h-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        تصفية المفضلة
      </h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="ابحث في المفضلة..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input pr-10"
        />
      </div>
      
      {/* Type Filter */}
      <select
        value={filterType}
        onChange={(e) => onFilterTypeChange(e.target.value)}
        className="search-input"
      >
        <option value="">جميع الأنواع</option>
        <option value="verse">الآيات</option>
        <option value="surah">السور</option>
        <option value="recitation">التلاوات</option>
      </select>
      
      {/* Sort By */}
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="search-input"
      >
        <option value="newest">الأحدث أولاً</option>
        <option value="oldest">الأقدم أولاً</option>
        <option value="title">ترتيب أبجدي</option>
        <option value="type">حسب النوع</option>
      </select>
    </div>
  </div>
);

// Stats Component
const FavoritesStats = ({ favorites }: { favorites: FavoriteItem[] }) => {
  const verseCount = favorites.filter(f => f.type === 'verse').length;
  const surahCount = favorites.filter(f => f.type === 'surah').length;
  const recitationCount = favorites.filter(f => f.type === 'recitation').length;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-red-600 mb-1">
          {toArabicNumber(favorites.length)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          إجمالي المفضلة
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-blue-600 mb-1">
          {toArabicNumber(verseCount)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          آية محفوظة
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-green-600 mb-1">
          {toArabicNumber(surahCount)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          سورة محفوظة
        </p>
      </div>
      
      <div className="islamic-card text-center">
        <p className="text-2xl font-bold text-purple-600 mb-1">
          {toArabicNumber(recitationCount)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          تلاوة محفوظة
        </p>
      </div>
    </div>
  );
};

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useApp();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(favorite => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = favorite.title.toLowerCase().includes(query);
        const matchesSubtitle = favorite.subtitle?.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesSubtitle) {
          return false;
        }
      }
      
      // Type filter
      if (filterType && favorite.type !== filterType) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'title':
          return a.title.localeCompare(b.title, 'ar');
        case 'type':
          return a.type.localeCompare(b.type);
        default: // 'newest'
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  const handleRemoveFavorite = (favoriteId: string) => {
    if (confirm('هل تريد حذف هذا العنصر من المفضلة؟')) {
      removeFromFavorites(favoriteId);
    }
  };

  const handleClearAll = () => {
    if (confirm('هل تريد حذف جميع المفضلة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      favorites.forEach(favorite => removeFromFavorites(favorite.id));
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            المفضلة
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            الآيات والسور والتلاوات التي أضفتها لمفضلتك لسهولة الوصول إليها لاحقاً
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Statistics */}
            <FavoritesStats favorites={favorites} />

            {/* Filters */}
            <FilterSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />

            {/* Clear All Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleClearAll}
                className="btn-secondary text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف جميع المفضلة
              </button>
            </div>

            {/* Favorites Grid */}
            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((favorite) => (
                  <FavoriteCard
                    key={favorite.id}
                    favorite={favorite}
                    onRemove={() => handleRemoveFavorite(favorite.id)}
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
                  لم نجد أي عناصر تطابق معايير البحث والفلترة
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('');
                    setSortBy('newest');
                  }}
                  className="btn-primary"
                >
                  مسح الفلاتر
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              لا توجد مفضلة بعد
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              ابدأ بإضافة الآيات والسور والتلاوات المفضلة لديك لتجدها هنا
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/surah" className="btn-primary">
                <BookOpen className="w-5 h-5 ml-2" />
                تصفح السور
              </Link>
              <Link href="/reciters" className="btn-secondary">
                <Users className="w-5 h-5 ml-2" />
                استمع للقراء
              </Link>
            </div>
            
            {/* How to add favorites */}
            <div className="islamic-card mt-12 text-right max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                كيفية إضافة المفضلة
              </h4>
              <div className="space-y-3 text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p>اضغط على أيقونة القلب بجانب أي آية لإضافتها للمفضلة</p>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p>احفظ السور المفضلة لديك للوصول السريع إليها</p>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p>أضف تلاوات القراء المفضلين لديك</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}