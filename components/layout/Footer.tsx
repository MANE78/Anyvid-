'use client';

import Link from 'next/link';
import { BookOpen, Github, Globe, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 dark:bg-slate-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  مداد الهدي
                </h3>
                <p className="text-sm text-slate-400">
                  القرآن الكريم
                </p>
              </div>
            </div>
            
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              موقع مداد الهدي للقرآن الكريم - منصة شاملة لقراءة والاستماع وتدبر القرآن الكريم
              مع التفسير والترجمة والتلاوات المتنوعة من أشهر القراء.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-300"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </Link>
              
              <Link
                href="mailto:info@madad-alhuda.com"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">تواصل معنا</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/surah"
                  className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span>السور</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/reciters"
                  className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span>القراء</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span>البحث</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span>المفضلة</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              الميزات
            </h4>
            <ul className="space-y-3">
              <li className="text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>تلاوة بأصوات متعددة</span>
              </li>
              <li className="text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>تفسير شامل</span>
              </li>
              <li className="text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>ترجمات متعددة</span>
              </li>
              <li className="text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span>بحث متقدم</span>
              </li>
              <li className="text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span>حفظ المفضلة</span>
              </li>
              <li className="text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                <span>تصميم متجاوب</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span>© {currentYear} مداد الهدي. جميع الحقوق محفوظة.</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>صُنع بـ</span>
            <div className="flex items-center gap-2">
              <span>Next.js</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>

        {/* Islamic Footer Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <Globe className="w-5 h-5 text-blue-400" />
            <p className="text-slate-300 text-sm">
              {'"'}وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ{'"'} - الإسراء: 82
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};