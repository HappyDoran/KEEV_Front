import React from 'react';
import Title from './components/Title';
import Logo from './components/Logo';

const Home = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Logo />
      <Title />
    </div>
  );
};

export default Home;
