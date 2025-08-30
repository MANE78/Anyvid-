import React from 'react';

import Navbar from './Navbar';
import Statistics from './Statistics';
import DailySurah from './DailySurah';
import FeaturedRecitations from './FeaturedRecitations';
import Footer from './Footer';

const HomePage = () => {
  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '0 1rem'
  };

  return (
    <>
      <Navbar />
      <main style={mainContainerStyle}>
        <Statistics />
        <DailySurah />
        <FeaturedRecitations />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
