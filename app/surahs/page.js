import axios from 'axios';
import Link from 'next/link';

async function getSurahs() {
  try {
    const response = await axios.get('https://mp3quran.net/api/v3/suwar?language=ar');
    return response.data.suwar;
  } catch (error) {
    console.error("Error fetching surahs:", error.message);
    return [];
  }
}

export default async function SurahsPage() {
  const surahs = await getSurahs();

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-green-700">
                موقع القرآن الكريم
            </Link>
            <nav>
                <Link href="/" className="text-gray-600 hover:text-green-700">الرئيسية</Link>
            </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">سور القرآن الكريم (114)</h1>
        {surahs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surahs.map((surah) => (
              <Link href={`/surahs/${surah.id}`} key={surah.id}>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:border-green-500 border-2 border-transparent transition-all cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-green-600 bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full">{surah.id}</span>
                        <div>
                            <h2 className="text-xl font-semibold">{surah.name}</h2>
                            <p className="text-sm text-gray-500">{surah.type === 'Meccan' ? 'مكية' : 'مدنية'}</p>
                        </div>
                    </div>
                    <span className="text-2xl font-semibold" style={{fontFamily: "'Amiri Quran', serif"}}>{surah.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-500 mt-10">
            حدث خطأ أثناء تحميل قائمة السور. يرجى المحاولة مرة أخرى لاحقًا.
          </p>
        )}
      </main>
    </div>
  );
}
