import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/meta');
        setStats(response.data.data);
      } catch (err) {
        setError('فشل في تحميل الإحصائيات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCardStyle = {
    background: '#f8f8f8',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    padding: '20px'
  };

  if (loading) return <p>جاري تحميل الإحصائيات...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="statistics" style={{ width: '100%', maxWidth: '1200px', margin: '2rem 0' }}>
      <h2 style={{ textAlign: 'center' }}>إحصائيات القرآن الكريم</h2>
      {stats && (
        <div className="stats-grid" style={gridStyle}>
          <div className="stat-item" style={statCardStyle}>
            <h3>السور</h3>
            <p>{stats.surahs.count}</p>
          </div>
          <div className="stat-item" style={statCardStyle}>
            <h3>الآيات</h3>
            <p>{stats.ayahs.count}</p>
          </div>
          <div className="stat-item" style={statCardStyle}>
            <h3>الأجزاء</h3>
            <p>{stats.juzs.count}</p>
          </div>
           <div className="stat-item" style={statCardStyle}>
            <h3>الصفحات</h3>
            <p>{stats.pages.count}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
