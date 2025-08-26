import axios from 'axios';
import Link from 'next/link';
import AyahPlayer from '../../../components/AyahPlayer'; // Import the new component

async function getSurahData(surahNumber) {
  try {
    // Fetch both editions (text with audio, and translation) in parallel
    const [audioEditionRes, translationEditionRes] = await Promise.all([
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`),
        axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`)
    ]);

    // The API response for the audio edition also contains the Arabic text.
    const audioEdition = audioEditionRes.data.data;
    const translationEdition = translationEditionRes.data.data;

    // Combine the data into a single, useful structure
    const ayahs = audioEdition.ayahs.map((ayah, index) => ({
        ...ayah, // Includes number, text, audio URL, etc.
        translation: translationEdition.ayahs[index].text,
    }));

    // Return the combined data
    return { ...audioEdition, ayahs };

  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error.message);
    return null;
  }
}


export default async function SurahDetailPage({ params }) {
  const { surahNumber } = params;
  const surah = await getSurahData(surahNumber);

  if (!surah) {
    return (
        <div className="text-center p-10" dir="rtl">
            <p className="text-red-500 text-xl">حدث خطأ أثناء تحميل بيانات السورة.</p>
            <Link href="/surahs" className="mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                العودة إلى قائمة السور
            </Link>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
        <header className="bg-white shadow-md p-4 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-green-700">
                    موقع القرآن الكريم
                </Link>
                <nav>
                    <Link href="/surahs" className="text-gray-600 hover:text-green-700">قائمة السور</Link>
                </nav>
            </div>
        </header>

        <main className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold" style={{fontFamily: "'Amiri Quran', serif"}}>{surah.name}</h1>
                <p className="text-xl text-gray-600 mt-2">{surah.englishName} - {surah.englishNameTranslation}</p>
                <p className="text-md text-gray-500 mt-1">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - {surah.numberOfAyahs} آيات</p>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                {surah.ayahs.map((ayah) => (
                    <AyahPlayer key={ayah.number} ayah={ayah} />
                ))}
            </div>
        </main>
    </div>
  );
}
