import "./Topbar.css";
import imgfile from "../../assets/Logo.png";
import { Link } from "react-router-dom";

const Topbar = () => {
  const name = localStorage.getItem("admin");

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.reload();
  };

  return (
    <div className="Topbar">
      <div className="topbarWrapper">
        <Link to="/" className="logoLink">
          <img src={imgfile} alt="메인 이미지" className="logoImage" />
        </Link>
        <div className="topRight">
          {name && (
            <div className="topBarUserInfo">
              <span>{name}님 좋은 하루!</span>
              <button className="logout" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
