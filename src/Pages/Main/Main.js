import React from "react";
import imgfile from "../../assets/Logo.png";
import "../../Styles/Layout.css";

const Main = () => {
  return (
    <div className="main-container">
      {" "}
      {/* 중앙 정렬을 위한 클래스 추가 */}
      <img src={imgfile} width="50%" alt="메인 이미지" className="main-image" />
    </div>
  );
};

export default Main;
