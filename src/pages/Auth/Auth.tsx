import { Button, TextField } from '@mui/material';
import React, { ChangeEvent, Dispatch, MouseEvent, useState } from 'react';
import imgfile from '../../assets/Logo.png';

interface AuthProps {
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>;
}

const Auth: React.FC<AuthProps> = ({ setIsAuthenticated }) => {
  const [usercode, setUsercode] = useState<string>('');

  const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (usercode === process.env.REACT_APP_ADMIN_CODE) {
      localStorage.setItem('admin', JSON.stringify({ usercode }));
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="loginMain-container">
      <img src={imgfile} alt="메인 이미지" className="main-image" />
      <div className="loginMain-wrapper">
        <h2 className="title">관리자 확인 코드</h2>
        <div className="inputField">
          <TextField
            label="Code"
            variant="outlined"
            type="password"
            fullWidth
            value={usercode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsercode(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#2A2830',
                '& input': {
                  color: '#eaeaea',
                },
              },
            }}
          />
        </div>
        <div className="buttonContainer">
          <Button
            sx={{
              backgroundColor: '#7556ff',
              '&:hover': {
                backgroundColor: '#292346',
              },
            }}
            onClick={handleLogin}
            variant="contained"
          >
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
