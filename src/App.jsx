import { useState, useEffect, useRef } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Banner from "./Banner";
import Footer from "./Footer";
import Bennefits from './Bennefits';
import Standards from './Standards';
import Faq from './Faq';
import Login from './Login';
import './App.css';
import ContactForm from "./ContactForm";

function Home() {
  return (
    <>
      <Banner />
      <Bennefits />
      <Standards />
    </>
  );
}

function LichSu() { return <h1>Lịch sử đặt hẹn</h1>; }
function LichHen() { return <h1>Lịch hẹn của bạn</h1>; }
function HoiDap() { return <Faq />; }
function ThongBao() { return <h1>Thông báo</h1>; }
function DangKyHienMau() { return <h1>Đăng ký hiến máu</h1>; }
function DangKyNhanMau() { return <h1>Đăng ký nhận máu</h1>; }
function LienHe() { return <ContactForm />; }
function NotFound() { return <h2>404 - Không tìm thấy trang</h2>; }

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', full_name: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  function handleLoginSuccess(user) {
    setIsLoggedIn(true);
    setUserInfo(user);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserInfo({ email: '', full_name: '' });
    setShowDropdown(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="app-root">
      <header>
        <div className="navbar">
          <img src="/picture/logo.png" alt="Logo" className="logo" />
          <nav>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Trang chủ</NavLink>

            {isLoggedIn && (
              <>
                <NavLink to="/lich-su" className={({ isActive }) => isActive ? "active" : ""}>Lịch sử đặt hẹn</NavLink>
                <NavLink to="/lich-hen" className={({ isActive }) => isActive ? "active" : ""}>Lịch hẹn của bạn</NavLink>
                <NavLink to="/dang-ky-hien-mau" className={({ isActive }) => isActive ? "active" : ""}>Đăng ký hiến máu</NavLink>
                <NavLink to="/dang-ky-nhan-mau" className={({ isActive }) => isActive ? "active" : ""}>Đăng ký nhận máu</NavLink>
              </>
            )}

            <NavLink to="/hoi-dap" className={({ isActive }) => isActive ? "active" : ""}>Hỏi – Đáp</NavLink>
            <NavLink to="/thong-bao" className={({ isActive }) => isActive ? "active" : ""}>Thông báo</NavLink>
            <NavLink to="/lien-he" className={({ isActive }) => isActive ? "active" : ""}>Liên hệ</NavLink>

            {!isLoggedIn ? (
              <NavLink to="/login">Đăng nhập</NavLink>
            ) : (
              <div className="user-dropdown" ref={dropdownRef}>
                <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
                  <div className="user-circle">
                    {userInfo.full_name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <span className="user-name">{userInfo.full_name}</span>
                  <span className="dropdown-arrow">▾</span>
                </div>
                {showDropdown && (
                  <div className="dropdown-menu new-style">
                    <button className="dropdown-item">Thông tin cá nhân</button>
                    <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {isLoggedIn && (
            <>
              <Route path="/lich-su" element={<LichSu />} />
              <Route path="/lich-hen" element={<LichHen />} />
              <Route path="/dang-ky-hien-mau" element={<DangKyHienMau />} />
              <Route path="/dang-ky-nhan-mau" element={<DangKyNhanMau />} />
            </>
          )}
          <Route path="/hoi-dap" element={<HoiDap />} />
          <Route path="/thong-bao" element={<ThongBao />} />
          <Route path="/lien-he" element={<LienHe />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
