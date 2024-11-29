import React, { useState } from "react";
import imgfile from "../../assets/Logo.png";
import { TextField, Button } from "@mui/material";
import "../../Styles/Layout.css";

const Main = (setIsAuthenticated) => {
  const [usercode, setUsercode] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 간단한 사용자 인증 로직
    if (usercode === "password") {
      // 로그인 성공 시 로컬 스토리지에 정보 저장
      localStorage.setItem("user", JSON.stringify({ usercode }));
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="main-container">
      {" "}
      {/* 중앙 정렬을 위한 클래스 추가 */}
      <img src={imgfile} width="50%" alt="메인 이미지" className="main-image" />
    </div>
  );
};

export default Main;
