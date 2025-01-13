import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loading = () => {
  return (
    <PuffLoader
      cssOverride={{
        margin: '0 auto',
        textAlign: 'center',
        color: '#fff',
      }}
      color="#7556ff"
    />
  );
};

export default Loading;
