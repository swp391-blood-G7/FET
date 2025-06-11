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

// Component trang
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

// Admin
function NguoiDung() { return <h1>Quản lý Người dùng (Admin)</h1>; }
function PhanCong() { return <h1>Phân công (Admin)</h1>; }
function TongKet() { return <h1>Tổng kết (Admin)</h1>; }
function QuanLyLichHienMau() { return <h1>Quản lý lịch hiến máu (Admin)</h1>; }

// Staff
function CongViec() { return <h1>Công việc</h1>; }
function QuanLyHienMau() { return <h1>Quản lý hiến máu</h1>; }
function QuanLyNhanMau() { return <h1>Quản lý nhận máu</h1>; }
function NganHangMau() { return <h1>Ngân hàng máu</h1>; }

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', full_name: '', role: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Load user info từ localStorage nếu có
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  function handleLoginSuccess(user) {
    setIsLoggedIn(true);
    setUserInfo(user);
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserInfo({ email: '', full_name: '', role: '' });
    setShowDropdown(false);
    localStorage.removeItem('userInfo');
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

  // Menu theo role
  const menuByRole = {
    member: [
      { to: "/lich-su", label: "LỊCH SỬ ĐẶT HẸN" },
      { to: "/lich-hen", label: "LỊCH HẸN CỦA BẠN" },
      { to: "/dang-ky-hien-mau", label: "ĐĂNG KÝ HIẾN MÁU" },
      { to: "/dang-ky-nhan-mau", label: "ĐĂNG KÝ NHẬN MÁU" },
      { to: "/hoi-dap", label: "HỎI – ĐÁP" },
      { to: "/lien-he", label: "LIÊN HỆ" },
    ],
    admin: [
      { to: "/nguoi-dung", label: "NGƯỜI DÙNG" },
      { to: "/phan-cong", label: "PHÂN CÔNG" },
      { to: "/tong-ket", label: "TỔNG KẾT" },
      { to: "/quan-ly-lich-hien-mau", label: "QUẢN LÝ LỊCH HIẾN MÁU" },
    ],
    staff: [
      { to: "/cong-viec", label: "CÔNG VIỆC" },
      { to: "/quan-ly-hien-mau", label: "QUẢN LÝ HIẾN MÁU" },
      { to: "/quan-ly-nhan-mau", label: "QUẢN LÝ NHẬN MÁU" },
      { to: "/ngan-hang-mau", label: "NGÂN HÀNG MÁU" },
    ]
  };

  // Routes theo role
  const routesByRole = {
    member: (
      <>
        <Route path="/lich-su" element={<LichSu />} />
        <Route path="/lich-hen" element={<LichHen />} />
        <Route path="/dang-ky-hien-mau" element={<DangKyHienMau />} />
        <Route path="/dang-ky-nhan-mau" element={<DangKyNhanMau />} />
        <Route path="/hoi-dap" element={<HoiDap />} />
        <Route path="/lien-he" element={<LienHe />} />
      </>
    ),
    admin: (
      <>
        <Route path="/nguoi-dung" element={<NguoiDung />} />
        <Route path="/phan-cong" element={<PhanCong />} />
        <Route path="/tong-ket" element={<TongKet />} />
        <Route path="/quan-ly-lich-hien-mau" element={<QuanLyLichHienMau />} />
      </>
    ),
    staff: (
      <>
        <Route path="/cong-viec" element={<CongViec />} />
        <Route path="/quan-ly-hien-mau" element={<QuanLyHienMau />} />
        <Route path="/quan-ly-nhan-mau" element={<QuanLyNhanMau />} />
        <Route path="/ngan-hang-mau" element={<NganHangMau />} />
      </>
    )
  };

  const userRole = userInfo.role;

  return (
    <div className="app-root">
      <header>
        <div className="navbar">
          <img src="/picture/logo.png" alt="Logo" className="logo" />
          <nav>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>TRANG CHỦ</NavLink>

            {!isLoggedIn && (
              <>
                <NavLink to="/hoi-dap" className={({ isActive }) => isActive ? "active" : ""}>HỎI – ĐÁP</NavLink>
                <NavLink to="/lien-he" className={({ isActive }) => isActive ? "active" : ""}>LIÊN HỆ</NavLink>
              </>
            )}

            {isLoggedIn && menuByRole[userRole]?.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => isActive ? "active" : ""}>
                {label}
              </NavLink>
            ))}

            {!isLoggedIn ? (
              <NavLink to="/login">ĐĂNG NHẬP</NavLink>
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
          <Route path="/hoi-dap" element={<HoiDap />} />
          <Route path="/lien-he" element={<LienHe />} />
          {isLoggedIn && routesByRole[userRole]}
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
