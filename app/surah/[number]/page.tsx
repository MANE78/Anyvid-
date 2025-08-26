'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Share, 
  Eye, 
  EyeOff,
  Settings,
  Download
} from 'lucide-react';
import { 
  getSurah, 
  getSurahWithTranslation, 
  getSurahTafsir, 
  getReciters 
} from '../../../lib/api/quran';
import { 
  toArabicNumber, 
  getSurahType, 
  generateMetaTags, 
  isValidSurahNumber, 
  cn 
} from '../../../lib/utils';
import { useApp } from '../../../components/providers/Providers';
import type { Surah, Reciter, TafsirText } from '../../../lib/types';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-lg text-slate-600 dark:text-slate-400">جاري تحميل السورة...</p>
    </div>
  </div>
);

// Ayah Component
const AyahCard = ({ 
  ayah, 
  surahNumber, 
  showTranslation, 
  showTafsir, 
  translation,
  tafsir,
  isPlaying,
  onPlay 
}: { 
  ayah: any; 
  surahNumber: number;
  showTranslation: boolean; 
  showTafsir: boolean;
  translation?: any;
  tafsir?: TafsirText[];
  isPlaying: boolean;
  onPlay: () => void;
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useApp();
  const favoriteId = `verse-${surahNumber}-${ayah.numberInSurah}`;
  const isFav = isFavorite(favoriteId);
  
  const handleToggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(favoriteId);
    } else {
      addToFavorites({
        id: favoriteId,
        type: 'verse',
        surahNumber,
        ayahNumber: ayah.numberInSurah,
        title: `سورة ${surahNumber} - آية ${ayah.numberInSurah}`,
        subtitle: ayah.text.slice(0, 50) + '...',
        dateAdded: new Date().toISOString(),
      });
    }
  };

  const ayahTafsir = tafsir?.find(t => 
    t.verse_key === `${surahNumber}:${ayah.numberInSurah}`
  );

  return (
    <div className="islamic-card group hover:shadow-xl transition-all duration-300" id={`ayah-${ayah.numberInSurah}`}>
      {/* Ayah Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="verse-number">
            {toArabicNumber(ayah.numberInSurah)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPlay}
              className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center justify-center transition-colors"
              title="تشغيل الآية"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-blue-600" />
              ) : (
                <Play className="w-4 h-4 text-blue-600" />
              )}
            </button>
            
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
            
            <button
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
              title="مشاركة الآية"
            >
              <Share className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
        
        <div className="text-xs text-slate-500 dark:text-slate-500">
          الآية {toArabicNumber(ayah.numberInSurah)}
        </div>
      </div>

      {/* Arabic Text */}
      <div className="mb-6">
        <p className="quran-text text-2xl md:text-3xl leading-loose text-slate-800 dark:text-slate-200 text-right">
          {ayah.text}
        </p>
      </div>

      {/* Translation */}
      {showTranslation && translation && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
            الترجمة
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {translation.text}
          </p>
        </div>
      )}

      {/* Tafsir */}
      {showTafsir && ayahTafsir && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
            التفسير
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {ayahTafsir.text}
          </p>
        </div>
      )}
    </div>
  );
};

// Surah Navigation
const SurahNavigation = ({ currentSurah }: { currentSurah: number }) => {
  const router = useRouter();
  
  const goToPrevious = () => {
    if (currentSurah > 1) {
      router.push(`/surah/${currentSurah - 1}`);
    }
  };
  
  const goToNext = () => {
    if (currentSurah < 114) {
      router.push(`/surah/${currentSurah + 1}`);
    }
  };
  
  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={goToPrevious}
        disabled={currentSurah <= 1}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
          currentSurah <= 1 
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
            : "btn-secondary hover:scale-105"
        )}
      >
        <ArrowRight className="w-4 h-4" />
        السورة السابقة
      </button>
      
      <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          سورة {toArabicNumber(currentSurah)} من {toArabicNumber(114)}
        </p>
      </div>
      
      <button
        onClick={goToNext}
        disabled={currentSurah >= 114}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
          currentSurah >= 114 
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
            : "btn-secondary hover:scale-105"
        )}
      >
        السورة التالية
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

// Controls Panel
const ControlsPanel = ({
  showTranslation,
  showTafsir,
  onToggleTranslation,
  onToggleTafsir,
  currentReciter,
  reciters,
  onReciterChange,
}: {
  showTranslation: boolean;
  showTafsir: boolean;
  onToggleTranslation: () => void;
  onToggleTafsir: () => void;
  currentReciter: number;
  reciters: Reciter[];
  onReciterChange: (reciterId: number) => void;
}) => (
  <div className="islamic-card mb-8">
    <div className="flex items-center gap-3 mb-4">
      <Settings className="w-5 h-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        خيارات العرض
      </h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Translation Toggle */}
      <button
        onClick={onToggleTranslation}
        className={cn(
          "flex items-center justify-between p-3 rounded-xl transition-all",
          showTranslation 
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        )}
      >
        <span className="flex items-center gap-2">
          {showTranslation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          الترجمة
        </span>
        <div className={cn(
          "w-4 h-4 rounded-full border-2",
          showTranslation ? "bg-blue-600 border-blue-600" : "border-slate-400"
        )} />
      </button>
      
      {/* Tafsir Toggle */}
      <button
        onClick={onToggleTafsir}
        className={cn(
          "flex items-center justify-between p-3 rounded-xl transition-all",
          showTafsir 
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        )}
      >
        <span className="flex items-center gap-2">
          {showTafsir ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          التفسير
        </span>
        <div className={cn(
          "w-4 h-4 rounded-full border-2",
          showTafsir ? "bg-green-600 border-green-600" : "border-slate-400"
        )} />
      </button>
      
      {/* Reciter Selection */}
      <select
        value={currentReciter}
        onChange={(e) => onReciterChange(Number(e.target.value))}
        className="search-input"
      >
        <option value={0}>اختر القارئ</option>
        {reciters.slice(0, 10).map(reciter => (
          <option key={reciter.id} value={reciter.id}>
            {reciter.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default function SurahDetailPage() {
  const params = useParams();
  const surahNumber = parseInt(params.number as string);
  
  const [surah, setSurah] = useState<Surah | null>(null);
  const [translation, setTranslation] = useState<Surah | null>(null);
  const [tafsir, setTafsir] = useState<TafsirText[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Display options
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [currentReciter, setCurrentReciter] = useState(1);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  
  const { settings } = useApp();

  // Validate surah number
  if (!isValidSurahNumber(surahNumber)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="islamic-card text-center max-w-md w-full">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            سورة غير موجودة
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            رقم السورة غير صحيح. يرجى اختيار رقم بين ١ و ١١٤.
          </p>
          <button onClick={() => window.history.back()} className="btn-primary">
            العودة للخلف
          </button>
        </div>
      </div>
    );
  }

  // Load surah data
  useEffect(() => {
    const loadSurahData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load Arabic text
        const surahData = await getSurah(surahNumber);
        setSurah(surahData);
        
        // Load translation if enabled
        if (showTranslation) {
          try {
            const translationData = await getSurahWithTranslation(
              surahNumber, 
              settings.defaultTranslation
            );
            setTranslation(translationData);
          } catch (err) {
            console.warn('Translation loading failed:', err);
          }
        }
        
        // Load tafsir if enabled
        if (showTafsir) {
          try {
            const tafsirData = await getSurahTafsir(surahNumber, settings.defaultTafsir);
            setTafsir(tafsirData);
          } catch (err) {
            console.warn('Tafsir loading failed:', err);
          }
        }
        
        // Load reciters
        try {
          const recitersData = await getReciters();
          setReciters(recitersData);
          if (settings.defaultReciter && recitersData.find(r => r.id === settings.defaultReciter)) {
            setCurrentReciter(settings.defaultReciter);
          }
        } catch (err) {
          console.warn('Reciters loading failed:', err);
        }
        
      } catch (err) {
        setError('فشل في تحميل السورة. يرجى المحاولة مرة أخرى.');
        console.error('Error loading surah:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahData();
  }, [surahNumber, settings.defaultTranslation, settings.defaultTafsir, settings.defaultReciter]);

  // Reload translation when toggled
  useEffect(() => {
    if (showTranslation && !translation && surah) {
      getSurahWithTranslation(surahNumber, settings.defaultTranslation)
        .then(setTranslation)
        .catch(console.error);
    }
  }, [showTranslation, translation, surah, surahNumber, settings.defaultTranslation]);

  // Reload tafsir when toggled
  useEffect(() => {
    if (showTafsir && tafsir.length === 0 && surah) {
      getSurahTafsir(surahNumber, settings.defaultTafsir)
        .then(setTafsir)
        .catch(console.error);
    }
  }, [showTafsir, tafsir.length, surah, surahNumber, settings.defaultTafsir]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="islamic-card text-center max-w-md w-full">
          <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            خطأ في التحميل
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!surah) return null;

  const surahType = getSurahType(surah.revelationType);
  const metaTags = generateMetaTags(surah);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <SurahNavigation currentSurah={surahNumber} />
        
        {/* Surah Header */}
        <div className="islamic-card mb-8 text-center">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold quran-text text-slate-900 dark:text-slate-100 mb-4">
              سورة {surah.name}
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-2">
              {surah.englishName}
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {surah.englishNameTranslation}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium',
              surahType.bgColor,
              surahType.color
            )}>
              {surahType.arabic}
            </span>
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-medium">
              {toArabicNumber(surah.numberOfAyahs)} آية
            </span>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-xl text-sm font-medium">
              السورة رقم {toArabicNumber(surah.number)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <ControlsPanel
          showTranslation={showTranslation}
          showTafsir={showTafsir}
          onToggleTranslation={() => setShowTranslation(!showTranslation)}
          onToggleTafsir={() => setShowTafsir(!showTafsir)}
          currentReciter={currentReciter}
          reciters={reciters}
          onReciterChange={setCurrentReciter}
        />

        {/* Ayahs */}
        <div className="space-y-6">
          {surah.ayahs?.map((ayah, index) => (
            <AyahCard
              key={ayah.numberInSurah}
              ayah={ayah}
              surahNumber={surahNumber}
              showTranslation={showTranslation}
              showTafsir={showTafsir}
              translation={translation?.ayahs?.[index]}
              tafsir={tafsir}
              isPlaying={playingAyah === ayah.numberInSurah}
              onPlay={() => {
                setPlayingAyah(
                  playingAyah === ayah.numberInSurah ? null : ayah.numberInSurah
                );
              }}
            />
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12">
          <SurahNavigation currentSurah={surahNumber} />
        </div>
      </div>
    </div>
  );
}