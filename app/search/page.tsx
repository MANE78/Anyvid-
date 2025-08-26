'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  BookOpen, 
  Filter, 
  ChevronDown,
  MapPin,
  Hash,
  ArrowLeft
} from 'lucide-react';
import { searchQuran } from '../../lib/api/quran';
import { toArabicNumber, getSurahType, highlightSearchTerm, cn } from '../../lib/utils';
import type { SearchResult, SearchMatch } from '../../lib/types';

// Search Result Component
const SearchResultCard = ({ match, searchQuery }: { match: SearchMatch; searchQuery: string }) => {
  const surahType = getSurahType(match.surah.revelationType);
  
  return (
    <div className="islamic-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              سورة {match.surah.name}
            </h3>
            <span className="verse-number text-sm">
              {toArabicNumber(match.numberInSurah)}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
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
              الآية {toArabicNumber(match.numberInSurah)}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-slate-500 dark:text-slate-500">
          السورة {toArabicNumber(match.surah.number)}
        </div>
      </div>

      <div className="mb-4">
        <p 
          className="quran-text text-xl leading-relaxed text-slate-800 dark:text-slate-200"
          dangerouslySetInnerHTML={{ 
            __html: highlightSearchTerm(match.text, searchQuery) 
          }}
        />
      </div>

      <div className="flex gap-2">
        <Link 
          href={`/surah/${match.surah.number}#ayah-${match.numberInSurah}`}
          className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          اقرأ في السياق
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

// Search Stats Component
const SearchStats = ({ result, searchQuery, searchTime }: { 
  result: SearchResult | null; 
  searchQuery: string;
  searchTime: number;
}) => {
  if (!result || !searchQuery) return null;

  return (
    <div className="islamic-card mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            نتائج البحث عن: <span className="text-blue-600">"{searchQuery}"</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            تم العثور على {toArabicNumber(result.totalResults)} نتيجة في {searchTime.toFixed(2)} ثانية
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            الصفحة {toArabicNumber(result.currentPage)} من {toArabicNumber(result.totalPages)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Advanced Search Options
const AdvancedSearchOptions = ({ 
  isOpen, 
  onToggle,
  edition,
  onEditionChange
}: {
  isOpen: boolean;
  onToggle: () => void;
  edition: string;
  onEditionChange: (edition: string) => void;
}) => (
  <div className="islamic-card mb-6">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left"
    >
      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-blue-600" />
        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          خيارات البحث المتقدم
        </span>
      </div>
      <ChevronDown className={cn(
        "w-5 h-5 text-slate-500 transition-transform",
        isOpen && "rotate-180"
      )} />
    </button>
    
    {isOpen && (
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              البحث في:
            </label>
            <select
              value={edition}
              onChange={(e) => onEditionChange(e.target.value)}
              className="search-input"
            >
              <option value="ar">النص العربي</option>
              <option value="en.sahih">الترجمة الإنجليزية (صحيح)</option>
              <option value="en.pickthall">الترجمة الإنجليزية (بيكتال)</option>
              <option value="fr.hamidullah">الترجمة الفرنسية</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              نوع البحث:
            </label>
            <select className="search-input">
              <option value="contains">يحتوي على</option>
              <option value="exact">مطابقة تامة</option>
              <option value="starts">يبدأ بـ</option>
              <option value="ends">ينتهي بـ</option>
            </select>
          </div>
        </div>
      </div>
    )}
  </div>
);

// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          "px-3 py-2 rounded-lg text-sm font-medium transition-all",
          currentPage <= 1
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            : "btn-secondary hover:scale-105"
        )}
      >
        السابق
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={cn(
            "px-3 py-2 rounded-lg text-sm font-medium transition-all",
            page === currentPage
              ? "bg-blue-600 text-white"
              : page === '...'
              ? "cursor-default text-slate-400"
              : "btn-secondary hover:scale-105"
          )}
        >
          {typeof page === 'number' ? toArabicNumber(page) : page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          "px-3 py-2 rounded-lg text-sm font-medium transition-all",
          currentPage >= totalPages
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            : "btn-secondary hover:scale-105"
        )}
      >
        التالي
      </button>
    </div>
  );
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [edition, setEdition] = useState('ar');

  // Search function
  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const result = await searchQuran(query.trim(), edition, page);
      setSearchResult(result);
      setCurrentPage(page);
      setSearchTime((Date.now() - startTime) / 1000);
    } catch (err) {
      setError('فشل في البحث. يرجى المحاولة مرة أخرى.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      // Debounced search would be better here
      const timeoutId = setTimeout(() => {
        performSearch(value, 1);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResult(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery, 1);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (searchQuery.trim()) {
      performSearch(searchQuery, page);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            البحث في القرآن الكريم
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            ابحث في آيات القرآن الكريم والترجمات المختلفة واعثر على ما تبحث عنه بسهولة
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="islamic-card">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث في القرآن الكريم... (مثال: الحمد لله، الرحمن الرحيم، الصلاة)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-4 pr-12 text-lg bg-transparent border-none focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500"
                autoFocus
              />
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="submit"
                disabled={!searchQuery.trim() || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري البحث...
                  </div>
                ) : (
                  <>
                    <Search className="w-4 h-4 ml-2" />
                    بحث
                  </>
                )}
              </button>
              
              <div className="text-sm text-slate-600 dark:text-slate-400">
                اكتب كلمتين على الأقل للبحث
              </div>
            </div>
          </div>
        </form>

        {/* Advanced Search Options */}
        <AdvancedSearchOptions
          isOpen={showAdvanced}
          onToggle={() => setShowAdvanced(!showAdvanced)}
          edition={edition}
          onEditionChange={setEdition}
        />

        {/* Error Message */}
        {error && (
          <div className="islamic-card mb-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResult && (
          <>
            <SearchStats 
              result={searchResult} 
              searchQuery={searchQuery}
              searchTime={searchTime}
            />

            {searchResult.matches.length > 0 ? (
              <div className="space-y-4">
                {searchResult.matches.map((match, index) => (
                  <SearchResultCard
                    key={`${match.surah.number}-${match.numberInSurah}-${index}`}
                    match={match}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  لم نعثر على نتائج
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  جرب استخدام كلمات أخرى أو تحقق من الإملاء
                </p>
              </div>
            )}

            {/* Pagination */}
            {searchResult.totalPages > 1 && (
              <Pagination
                currentPage={searchResult.currentPage}
                totalPages={searchResult.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Search Tips */}
        {!searchQuery && !searchResult && (
          <div className="islamic-card">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              نصائح للبحث
            </h3>
            <div className="space-y-3 text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>استخدم كلمات واضحة ومحددة للحصول على نتائج أفضل</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>يمكنك البحث في النص العربي أو في الترجمات المختلفة</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>جرب البحث بكلمات مختلفة إذا لم تجد ما تبحث عنه</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>استخدم الخيارات المتقدمة للبحث في ترجمات محددة</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}