import axios from 'axios';

// Helper function to fetch data with error handling
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    return null; // Return null on error
  }
}

// Component for the Daily Surah section
function DailySurah({ surah }) {
  if (!surah) return <div className="w-full p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-2">سورة اليوم</h2>
    <p>تعذر تحميل البيانات</p>
  </div>;
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">سورة اليوم (مثال: الفاتحة)</h2>
      <h3 className="text-xl font-semibold">{surah.name} ({surah.englishName})</h3>
      <p className="mt-2 text-gray-600">{surah.englishNameTranslation}</p>
      <p className="mt-4 text-lg text-right">"{surah.ayahs[0].text}"</p>
    </div>
  );
}

// Component for the Featured Recitation section
function FeaturedRecitation({ recitations }) {
  if (!recitations || recitations.length === 0) return <div className="w-full p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-2">تلاوة مميزة</h2>
    <p>تعذر تحميل البيانات</p>
    </div>;
  const recentRead = recitations[0];
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">تلاوة مميزة</h2>
      <p className="text-xl">{recentRead.sura_name_ar}</p>
      <p className="text-gray-600">القارئ: {recentRead.reciter_name_ar}</p>
      <audio controls className="w-full mt-4">
        <source src={recentRead.sura_url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

// Component for the Site Stats section
function SiteStats({ stats }) {
  if (!stats) return <div className="w-full p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-2">إحصائيات</h2>
    <p>تعذر تحميل البيانات</p>
    </div>;
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">إحصائيات</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-3xl font-bold">{stats.surahs.count}</p>
          <p className="text-gray-600">سورة</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{stats.ayahs.count}</p>
          <p className="text-gray-600">آية</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{stats.pages.count}</p>
          <p className="text-gray-600">صفحة</p>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  // Fetch all data in parallel
  const [surahData, recitationsData, metaData] = await Promise.all([
    fetchData('https://api.alquran.cloud/v1/surah/1'), // Using surah 1 for predictability
    fetchData('https://mp3quran.net/api/v3/recent_reads?language=ar'),
    fetchData('https://api.alquran.cloud/v1/meta')
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8 md:p-12 lg:p-24 bg-gray-50">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
            <h1 className="text-4xl font-bold text-green-700">موقع القرآن الكريم</h1>
            <p className="text-xl text-gray-500 mt-2">بوابتك لسماع وتدبر القرآن</p>
        </header>

        <DailySurah surah={surahData?.data} />
        <FeaturedRecitation recitations={recitationsData?.recitations} />
        <SiteStats stats={metaData?.data} />

        <div className="w-full p-6 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">أقسام الموقع</h2>
            <div className="flex justify-center gap-4">
                <a href="/surahs" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">تصفح السور</a>
                {/* Add other links as they are built */}
            </div>
        </div>
      </div>
    </main>
  );
}
