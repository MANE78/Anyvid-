import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookQuran } from '@fortawesome/free-solid-svg-icons';

// We will create this CSS file in the next step
// import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#f8f8f8',
      borderBottom: '1px solid #ddd'
    }}>
      <div className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FontAwesomeIcon icon={faBookQuran} size="2x" />
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>موقع القرآن الكريم</h1>
      </div>
      <ul className="navbar-links" style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0 }}>
        <li><a href="/">الرئيسية</a></li>
        <li><a href="/surahs">السور</a></li>
        <li><a href="/reciters">القراء</a></li>
        <li><a href="/tafsir">التفسير</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
