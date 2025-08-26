import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { Providers } from '../components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'مداد الهدي - القرآن الكريم',
  description: 'موقع مداد الهدي للقرآن الكريم - اقرأ واستمع وتدبر القرآن الكريم مع التفسير والترجمة',
  keywords: ['القرآن الكريم', 'تلاوة', 'تفسير', 'ترجمة', 'إسلام', 'quran', 'recitation', 'tafsir'],
  authors: [{ name: 'فريق مداد الهدي' }],
  creator: 'مداد الهدي',
  publisher: 'مداد الهدي',
  robots: 'index, follow',
  openGraph: {
    title: 'مداد الهدي - القرآن الكريم',
    description: 'اقرأ واستمع وتدبر القرآن الكريم مع التفسير والترجمة',
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    siteName: 'مداد الهدي',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مداد الهدي - القرآن الكريم',
    description: 'اقرأ واستمع وتدبر القرآن الكريم مع التفسير والترجمة',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Sans+Arabic:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            {/* Navigation */}
            <Navigation />
            
            {/* Main Content */}
            <main className="flex-1 relative z-10">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}