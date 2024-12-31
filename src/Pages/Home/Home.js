import React, { useState } from "react";

import "../../Styles/Layout.css";
import "../../Styles/Component.css";
import imgfile from "../../assets/Logo.png";

const Home = () => {
  return (
    <div className="loginMain-container">
      <img src={imgfile} alt="메인 이미지" className="main-image" />
    </div>
  );
};

export default Home;
