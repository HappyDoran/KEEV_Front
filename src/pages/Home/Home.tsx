import React, { useCallback, useEffect, useState } from 'react';
import imgFile from '../../assets/HomeLogo.png';

const Home = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const friction = 1 / 16;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const followX = window.innerWidth / 2 - e.clientX;
      const followY = window.innerHeight / 2 - e.clientY;

      const x = -followX * friction;
      const y = followY * friction;

      setOffset({ x, y });
    },
    [friction],
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const cardStyle: React.CSSProperties = {
    transform: `translate(-50%, -50%) perspective(600px) 
                rotateY(${offset.x}deg) 
                rotateX(${offset.y}deg)`,
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: '300px',
    height: 'auto',
    transition: 'transform 0.1s ease-out',
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <img src={imgFile} alt="Interactive" style={cardStyle} />
    </div>
  );
};

export default Home;
