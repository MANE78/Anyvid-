import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedRecitations = () => {
  const [recitations, setRecitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecitations = async () => {
      try {
        const response = await axios.get('https://mp3quran.net/api/v3/recent_reads?language=ar');
        setRecitations(response.data.reads.slice(0, 5));
      } catch (err) {
        setError('فشل في تحميل التلاوات المميزة');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecitations();
  }, []);

  const containerStyle = {
    padding: '20px',
    margin: '2rem 0',
    background: '#fff8e1',
    border: '1px solid #ffecb3',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '1200px',
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
  };

  const listItemStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee',
  };


  if (loading) return <div style={containerStyle}><p>جاري تحميل أحدث التلاوات...</p></div>;
  if (error) return <div style={containerStyle}><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div className="featured-recitations" style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>أحدث التلاوات المضافة</h2>
      <ul style={listStyle}>
        {recitations.map((recitation) => (
          <li key={recitation.id} style={listItemStyle}>
            <p><strong>سورة {recitation.sura_name}</strong></p>
            <p>بصوت القارئ: {recitation.reciter_name}</p>
            {/* We can add an audio player here in a future step */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturedRecitations;
