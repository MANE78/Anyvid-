import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailySurah = () => {
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailySurah = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/surah/random');
        setSurah(response.data.data);
      } catch (err) {
        setError('فشل في تحميل سورة اليوم');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDailySurah();
  }, []);

  const containerStyle = {
    padding: '20px',
    margin: '2rem 0',
    background: '#eef8ff',
    border: '1px solid #cce4f7',
    borderRadius: '8px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '1200px',
  };

  if (loading) return <div style={containerStyle}><p>جاري تحميل سورة اليوم...</p></div>;
  if (error) return <div style={containerStyle}><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div className="daily-surah" style={containerStyle}>
      <h2>سورة اليوم</h2>
      {surah && (
        <>
          <h3>{surah.name} ({surah.englishName})</h3>
          <p style={{ fontStyle: 'italic', fontSize: '1.2rem', lineHeight: '1.8' }}>
            "{surah.ayahs[0].text}"
          </p>
          <p>(الآية رقم ١)</p>
        </>
      )}
    </div>
  );
};

export default DailySurah;
