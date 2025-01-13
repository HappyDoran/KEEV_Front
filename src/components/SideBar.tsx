import React, { useState } from 'react';
import { Link } from 'react-router';
import useToggle from '../hooks/useToggle';
import { Button } from '@mui/material';

const SideBar = ({ open, toggleSideBar }: { open: boolean; toggleSideBar: () => void }) => {
  const [isRegister, toggleIsRegister] = useToggle(false);
  const [isManage, toggleIsManage] = useToggle(false);

  return (
    <div className={`Sidebar ${open ? 'open' : ''}`}>
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle" onClick={toggleIsRegister}>
            등록
            <span className={`arrow ${isRegister ? 'open' : ''}`}>▼</span>
          </h3>
          <ul className={`sidebarList ${isRegister ? 'open' : ''}`}>
            <li className="sidebarListItem">
              <Link to="/type">공연 종류 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/country">나라 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/genre">장르 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/place">공연장 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/artist">아티스트 등록</Link>
            </li>
            <li className="sidebarListItem">
              <Link to="/event">이벤트 등록</Link>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle" onClick={toggleIsManage}>
            관리
            <span className={`arrow ${isManage ? 'open' : ''}`}>▼</span>
          </h3>
          <ul className={`sidebarList ${isManage ? 'open' : ''}`}>
            <li className="sidebarListItem">
              <Link to="/event/list">이벤트 관리</Link>
            </li>
          </ul>
        </div>
      </div>
      <button onClick={toggleSideBar} className="toggleButton">
        {open ? 'Close' : 'Open'}
      </button>
    </div>
  );
};

export default SideBar;
