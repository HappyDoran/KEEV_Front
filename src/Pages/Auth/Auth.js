import React, { useState } from "react";

import "../../Styles/Layout.css";
import "../../Styles/Component.css";
import imgfile from "../../assets/Logo.png";
import { TextField, Button } from "@mui/material";

const Auth = ({ setIsAuthenticated }) => {
  // 구조 분해 할당으로 수정
  const [usercode, setUsercode] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 간단한 사용자 인증 로직
    if (usercode === process.env.React_APP_ADMIN_CODE) {
      // 로그인 성공 시 로컬 스토리지에 정보 저장
      localStorage.setItem("admin", JSON.stringify({ usercode }));
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="loginMain-container">
      <img src={imgfile} alt="메인 이미지" className="main-image" />
      <div className="loginMain-wrapper">
        <h2 className="title">로그인</h2>
        <div className="inputField">
          <TextField
            label="UserCode"
            variant="outlined"
            fullWidth
            value={usercode}
            onChange={(e) => setUsercode(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": {
                color: "white", // label 색상을 흰색으로 설정
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // borderRadius를 12로 설정
                backgroundColor: "#2A2830", // 배경색을 설정
                "& input": {
                  color: "#eaeaea", // value 색상을 흰색으로 설정
                },
              },
            }}
          />
        </div>
        <div className="buttonContainer">
          <Button
            onClick={handleLogin}
            variant="contained"
            sx={{
              backgroundColor: "#7556ff",
              "&:hover": {
                backgroundColor: "#292346",
              },
            }}
          >
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
