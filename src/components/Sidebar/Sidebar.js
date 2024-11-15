import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // 스타일을 위한 CSS 파일

const Sidebar = () => {
  const [openRegister, setOpenRegister] = useState(false);
  const [openManage, setOpenManage] = useState(false);
  const [openLOL, setOpenLOL] = useState(false);

  const toggleRegister = () => {
    setOpenRegister(!openRegister);
  };

  const toggleManage = () => {
    setOpenManage(!openManage);
  };

  const toggleLOL = () => {
    setOpenLOL(!openLOL);
  };

  return (
    <div className="Sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle" onClick={toggleRegister}>
            등록
            <span className={`arrow ${openRegister ? "open" : ""}`}>▼</span>
          </h3>
          <ul className={`sidebarList ${openRegister ? "open" : ""}`}>
            <li className="sidebarListItem">
              <Link to="/eventType/create">공연 종류 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/country/create">나라 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/genre/create">장르 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/place/create">공연장소 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/artist/create">아티스트 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/event/create">이벤트 등록</Link>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle" onClick={toggleManage}>
            관리
            <span className={`arrow ${openManage ? "open" : ""}`}>▼</span>
          </h3>
          <ul className={`sidebarList ${openManage ? "open" : ""}`}>
            <li className="sidebarListItem">
              <Link to="/board">이벤트 관리</Link>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle" onClick={toggleLOL}>
            놀아보자
            <span className={`arrow ${openLOL ? "open" : ""}`}>▼</span>
          </h3>
          <ul className={`sidebarList ${openLOL ? "open" : ""}`}>
            <li className="sidebarListItem">
              <Link to="/searchplace/create">인디스트릿 공연장소 검색</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
