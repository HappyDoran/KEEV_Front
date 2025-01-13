import { Link } from 'react-router-dom';
import imgfile from '../assets/Logo.png';

const Header = () => {
  const user = localStorage.getItem('admin');

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.location.reload();
  };

  return (
    <header>
      <div className="container">
        <Link to="/" className="logo">
          <img src={imgfile} alt="메인 이미지" className="logoImage" />
        </Link>
        <div className="topRight">
          {user && (
            <div className="topBarUserInfo">
              <button className="logout" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
