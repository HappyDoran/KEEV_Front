import React from 'react';
import HomeTitle from '../../../assets/HomeTitle.png';

const Title = () => {
  return (
    <div>
      <img
        src={HomeTitle}
        style={{
          width: '500px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '7%',
        }}
      />
    </div>
  );
};

export default Title;
