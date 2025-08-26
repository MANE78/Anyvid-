'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Palette, 
  Type, 
  Volume2, 
  Languages, 
  User,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useApp } from '../../components/providers/Providers';
import { getReciters, getTranslations } from '../../lib/api/quran';
import { cn } from '../../lib/utils';
import type { Reciter, Translation, UserSettings } from '../../lib/types';

// Settings Section Component
const SettingsSection = ({ 
  title, 
  description, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  children: React.ReactNode; 
}) => (
  <div className="islamic-card">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Setting Item Component
const SettingItem = ({ 
  label, 
  description, 
  children 
}: { 
  label: string; 
  description?: string; 
  children: React.ReactNode; 
}) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
    <div className="flex-1">
      <label className="text-sm font-medium text-slate-900 dark:text-slate-100 block">
        {label}
      </label>
      {description && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {description}
        </p>
      )}
    </div>
    <div className="ml-4">
      {children}
    </div>
  </div>
);

// Theme Selector Component
const ThemeSelector = ({ 
  value, 
  onChange 
}: { 
  value: 'light' | 'dark' | 'auto'; 
  onChange: (theme: 'light' | 'dark' | 'auto') => void; 
}) => {
  const themes = [
    { key: 'light', label: 'فاتح', icon: Sun },
    { key: 'dark', label: 'داكن', icon: Moon },
    { key: 'auto', label: 'تلقائي', icon: Monitor },
  ] as const;

  return (
    <div className="flex gap-2">
      {themes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            value === key
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

// Font Size Slider Component
const FontSizeSlider = ({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (size: number) => void; 
}) => (
  <div className="flex items-center gap-4">
    <div className="flex-1">
      <input
        type="range"
        min="12"
        max="32"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-[3rem]">
      {value}px
    </div>
  </div>
);

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load reciters and translations
  useEffect(() => {
    const loadData = async () => {
      try {
        const [recitersData, translationsData] = await Promise.all([
          getReciters(),
          getTranslations()
        ]);
        setReciters(recitersData.slice(0, 20)); // Limit for performance
        setTranslations(translationsData.slice(0, 10)); // Limit for performance
      } catch (error) {
        console.error('Failed to load settings data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    updateSettings({ [key]: value });
    
    // Show save status
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const resetToDefaults = () => {
    if (confirm('هل تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
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
      
      Object.entries(defaultSettings).forEach(([key, value]) => {
        updateSettings({ [key as keyof UserSettings]: value });
      });

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            الإعدادات
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            خصص تجربتك في استخدام موقع مداد الهدي حسب تفضيلاتك الشخصية
          </p>
        </div>

        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div className={cn(
            "islamic-card mb-6 border-l-4 transition-all",
            saveStatus === 'saving' && "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
            saveStatus === 'saved' && "border-green-500 bg-green-50 dark:bg-green-900/20"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                saveStatus === 'saving' && "bg-yellow-500",
                saveStatus === 'saved' && "bg-green-500"
              )} />
              <p className={cn(
                saveStatus === 'saving' && "text-yellow-700 dark:text-yellow-400",
                saveStatus === 'saved' && "text-green-700 dark:text-green-400"
              )}>
                {saveStatus === 'saving' && 'جاري حفظ الإعدادات...'}
                {saveStatus === 'saved' && 'تم حفظ الإعدادات بنجاح!'}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Appearance Settings */}
          <SettingsSection
            title="المظهر"
            description="تخصيص شكل ومظهر الموقع"
            icon={Palette}
          >
            <SettingItem
              label="المظهر العام"
              description="اختر المظهر الفاتح أو الداكن أو التلقائي"
            >
              <ThemeSelector
                value={settings.theme}
                onChange={(theme) => handleSettingChange('theme', theme)}
              />
            </SettingItem>

            <SettingItem
              label="حجم الخط"
              description="اضبط حجم النص ليناسب راحتك في القراءة"
            >
              <FontSizeSlider
                value={settings.fontSize}
                onChange={(size) => handleSettingChange('fontSize', size)}
              />
            </SettingItem>

            <SettingItem
              label="لغة الواجهة"
              description="اختر لغة عرض الواجهة"
            >
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="search-input min-w-[120px]"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </SettingItem>
          </SettingsSection>

          {/* Content Settings */}
          <SettingsSection
            title="المحتوى"
            description="إعدادات عرض النصوص والترجمات"
            icon={Type}
          >
            <SettingItem
              label="إظهار الترجمة"
              description="عرض الترجمة مع النص العربي افتراضياً"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showTranslation}
                  onChange={(e) => handleSettingChange('showTranslation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </SettingItem>

            <SettingItem
              label="إظهار التفسير"
              description="عرض التفسير مع النص العربي افتراضياً"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showTafsir}
                  onChange={(e) => handleSettingChange('showTafsir', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </SettingItem>

            <SettingItem
              label="الترجمة الافتراضية"
              description="اختر الترجمة المفضلة لك"
            >
              <select
                value={settings.defaultTranslation}
                onChange={(e) => handleSettingChange('defaultTranslation', e.target.value)}
                className="search-input min-w-[200px]"
              >
                {translations.map((translation) => (
                  <option key={translation.identifier} value={translation.identifier}>
                    {translation.name}
                  </option>
                ))}
              </select>
            </SettingItem>
          </SettingsSection>

          {/* Audio Settings */}
          <SettingsSection
            title="الصوت"
            description="إعدادات التشغيل والتلاوة"
            icon={Volume2}
          >
            <SettingItem
              label="القارئ الافتراضي"
              description="اختر القارئ المفضل لك"
            >
              <select
                value={settings.defaultReciter}
                onChange={(e) => handleSettingChange('defaultReciter', Number(e.target.value))}
                className="search-input min-w-[200px]"
              >
                {reciters.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.name}
                  </option>
                ))}
              </select>
            </SettingItem>

            <SettingItem
              label="سرعة التشغيل"
              description="اضبط سرعة تشغيل التلاوة"
            >
              <select
                value={settings.playbackSpeed}
                onChange={(e) => handleSettingChange('playbackSpeed', Number(e.target.value))}
                className="search-input min-w-[120px]"
              >
                <option value={0.5}>٠.٥×</option>
                <option value={0.75}>٠.٧٥×</option>
                <option value={1}>١×</option>
                <option value={1.25}>١.٢٥×</option>
                <option value={1.5}>١.٥×</option>
                <option value={2}>٢×</option>
              </select>
            </SettingItem>

            <SettingItem
              label="التشغيل التلقائي"
              description="تشغيل التلاوة تلقائياً عند فتح السورة"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoPlay}
                  onChange={(e) => handleSettingChange('autoPlay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </SettingItem>
          </SettingsSection>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={resetToDefaults}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-12">
          <div className="islamic-card">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              معاينة الإعدادات
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p 
                className="quran-text text-slate-800 dark:text-slate-200 leading-relaxed"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                هذا مثال على كيفية ظهور النص بالإعدادات الحالية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}