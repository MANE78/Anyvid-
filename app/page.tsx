'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Users, 
  Search, 
  Play, 
  TrendingUp, 
  Globe, 
  Heart,
  Shuffle,
  ArrowLeft,
  Star
} from 'lucide-react';
import { getQuranStats, getRandomSurah, getReciters } from '../lib/api/quran';
import { toArabicNumber, getSurahType, cn } from '../lib/utils';
import type { QuranStats, Surah, Reciter } from '../lib/types';

// Stats Component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  isLoading = false 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color?: string;
  isLoading?: boolean;
}) => (
  <div className="islamic-card group cursor-default">
    <div className="flex items-center gap-4">
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110',
        color === 'blue' && 'bg-gradient-to-br from-blue-500 to-blue-600',
        color === 'purple' && 'bg-gradient-to-br from-purple-500 to-purple-600',
        color === 'green' && 'bg-gradient-to-br from-green-500 to-green-600',
        color === 'orange' && 'bg-gradient-to-br from-orange-500 to-orange-600',
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
          {title}
        </p>
        {isLoading ? (
          <div className="loading-pulse h-8 w-20 rounded-lg" />
        ) : (
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {typeof value === 'number' ? toArabicNumber(value) : value}
          </p>
        )}
      </div>
    </div>
  </div>
);

// Random Surah Component
const RandomSurahCard = ({ surah, isLoading }: { surah: Surah | null; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="islamic-card">
        <div className="flex items-center justify-between mb-4">
          <div className="loading-pulse h-6 w-32 rounded-lg" />
          <div className="loading-pulse h-8 w-8 rounded-full" />
        </div>
        <div className="loading-pulse h-4 w-full rounded-lg mb-2" />
        <div className="loading-pulse h-4 w-3/4 rounded-lg mb-4" />
        <div className="loading-pulse h-10 w-full rounded-xl" />
      </div>
    );
  }

  if (!surah) return null;

  const surahType = getSurahType(surah.revelationType);

  return (
    <div className="islamic-card group hover:shadow-2xl transition-all duration-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            سورة اليوم
          </h3>
          <div className="flex items-center gap-2">
            <span className={cn('px-2 py-1 rounded-lg text-xs font-medium', surahType.bgColor, surahType.color)}>
              {surahType.arabic}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {toArabicNumber(surah.numberOfAyahs)} آية
            </span>
          </div>
        </div>
        <div className="verse-number">
          {toArabicNumber(surah.number)}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 quran-text">
          {surah.name}
        </h4>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {surah.englishName}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          {surah.englishNameTranslation}
        </p>
      </div>

      <div className="flex gap-3">
        <Link 
          href={`/surah/${surah.number}`}
          className="btn-primary flex-1 text-center"
        >
          <BookOpen className="w-4 h-4 inline-block ml-2" />
          قراءة السورة
        </Link>
        <button className="btn-secondary px-4 py-3 flex items-center justify-center">
          <Play className="w-4 h-4" />
        </button>
        <button className="btn-secondary px-4 py-3 flex items-center justify-center">
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Featured Reciter Component
const FeaturedReciterCard = ({ reciter, isLoading }: { reciter: Reciter | null; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="islamic-card">
        <div className="flex items-center gap-4">
          <div className="loading-pulse w-16 h-16 rounded-full" />
          <div className="flex-1">
            <div className="loading-pulse h-5 w-32 rounded-lg mb-2" />
            <div className="loading-pulse h-4 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!reciter) return null;

  return (
    <div className="islamic-card group hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {reciter.name}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            رواية {reciter.rewaya?.name || 'حفص عن عاصم'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            قارئ مميز
          </span>
        </div>
        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg">
          {toArabicNumber(reciter.count || 114)} سورة
        </span>
      </div>

      <Link 
        href={`/reciters/${reciter.id}`}
        className="btn-secondary w-full text-center flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4" />
        استمع للتلاوة
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default function HomePage() {
  const [stats, setStats] = useState<QuranStats | null>(null);
  const [randomSurah, setRandomSurah] = useState<Surah | null>(null);
  const [featuredReciter, setFeaturedReciter] = useState<Reciter | null>(null);
  const [loading, setLoading] = useState({
    stats: true,
    surah: true,
    reciter: true,
  });

  // Load data on component mount
  useEffect(() => {
    const loadHomeData = async () => {
      // Load stats
      try {
        const quranStats = await getQuranStats();
        setStats(quranStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }

      // Load random surah
      try {
        const surah = await getRandomSurah();
        setRandomSurah(surah);
      } catch (error) {
        console.error('Failed to load random surah:', error);
      } finally {
        setLoading(prev => ({ ...prev, surah: false }));
      }

      // Load featured reciter
      try {
        const reciters = await getReciters();
        if (reciters.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(reciters.length, 10));
          setFeaturedReciter(reciters[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to load reciters:', error);
      } finally {
        setLoading(prev => ({ ...prev, reciter: false }));
      }
    };

    loadHomeData();
  }, []);

  const refreshRandomSurah = async () => {
    setLoading(prev => ({ ...prev, surah: true }));
    try {
      const surah = await getRandomSurah();
      setRandomSurah(surah);
    } catch (error) {
      console.error('Failed to refresh surah:', error);
    } finally {
      setLoading(prev => ({ ...prev, surah: false }));
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-500/5 dark:to-purple-500/5" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مداد الهدي
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              منصة شاملة لقراءة والاستماع وتدبر القرآن الكريم مع التفسير والترجمة والتلاوات المتنوعة
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/surah" className="btn-primary">
              <BookOpen className="w-5 h-5 ml-2" />
              تصفح السور
            </Link>
            <Link href="/search" className="btn-secondary">
              <Search className="w-5 h-5 ml-2" />
              البحث في القرآن
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link 
              href="/surah" 
              className="glass-effect p-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">السور</span>
            </Link>
            <Link 
              href="/reciters" 
              className="glass-effect p-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">القراء</span>
            </Link>
            <Link 
              href="/search" 
              className="glass-effect p-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <Search className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">البحث</span>
            </Link>
            <Link 
              href="/favorites" 
              className="glass-effect p-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">المفضلة</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              إحصائيات القرآن الكريم
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              أرقام وحقائق عن كتاب الله العزيز
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="عدد السور"
              value={stats?.numberOfSurahs || 114}
              icon={BookOpen}
              color="blue"
              isLoading={loading.stats}
            />
            <StatsCard
              title="عدد الآيات"
              value={stats?.numberOfAyahs || 6236}
              icon={TrendingUp}
              color="purple"
              isLoading={loading.stats}
            />
            <StatsCard
              title="عدد الكلمات"
              value={stats?.numberOfWords || 77449}
              icon={Globe}
              color="green"
              isLoading={loading.stats}
            />
            <StatsCard
              title="عدد الحروف"
              value={stats?.numberOfLetters || 323015}
              icon={Star}
              color="orange"
              isLoading={loading.stats}
            />
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Random Surah */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  سورة مقترحة
                </h2>
                <button
                  onClick={refreshRandomSurah}
                  disabled={loading.surah}
                  className="btn-secondary px-4 py-2 flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  تغيير
                </button>
              </div>
              <RandomSurahCard surah={randomSurah} isLoading={loading.surah} />
            </div>

            {/* Featured Reciter */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                قارئ مميز
              </h2>
              <FeaturedReciterCard reciter={featuredReciter} isLoading={loading.reciter} />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="islamic-card">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              ابدأ رحلتك مع القرآن الكريم
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              استكشف السور، استمع للتلاوات، واقرأ التفاسير لتعميق فهمك وتدبرك لكتاب الله
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/surah/1" className="btn-primary">
                <BookOpen className="w-5 h-5 ml-2" />
                ابدأ بسورة الفاتحة
              </Link>
              <Link href="/surah" className="btn-secondary">
                تصفح جميع السور
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}