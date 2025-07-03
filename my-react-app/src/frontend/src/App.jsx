import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';  // Sửa import ở đây

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProfilePage from "./components/ProfilePage/ProfilePage";

import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import NotFoundPage from "./pages/NotFoundPage";

// Import các trang theo vai trò
import { LichSu, DangKyNhanMau } from "./pages/MemberPages";
import { NguoiDung, PhanCong, TongKet, QuanLyLichHienMau } from "./pages/AdminPages";
import { CongViec, QuanLyHienMau, QuanLyNhanMau, NganHangMau } from "./pages/StaffPages";

import BloodSchedulePage from "./pages/BloodSchedulePage"; 
import BloodRegisterPage from './pages/BloodRegisterPage';

import "./App.css";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", full_name: "", role: "" });
  const navigate = useNavigate();

  // Load userInfo từ localStorage nếu có, ưu tiên hơn token
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      setIsLoggedIn(true);
    } else {
      // Nếu không có userInfo, thử lấy token rồi decode
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserInfo({
            full_name: decoded.full_name,
            username: decoded.username,
            userId: decoded.userId,
            role: decoded.role,
          });
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Token không hợp lệ:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      }
    }
  }, []);

  function handleLoginSuccess(user) {
    setIsLoggedIn(true);
    setUserInfo(user);
    localStorage.setItem("userInfo", JSON.stringify(user)); // lưu userInfo
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserInfo({ email: "", full_name: "", role: "" });
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");  // điều hướng về login sau logout
  }

  const userRole = userInfo.role;

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        handleLogout={handleLogout}
        userRole={userRole}
      />

      <main style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hoi-dap" element={<FaqPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Routes cho thành viên */}
          {isLoggedIn && userRole === "member" && (
            <>
              <Route path="/lich-su" element={<LichSu />} />
              <Route path="/dang-ky-nhan-mau" element={<DangKyNhanMau />} />
            </>
          )}

          {/* Routes cho admin */}
          {isLoggedIn && userRole === "admin" && (
            <>
              <Route path="/nguoi-dung" element={<NguoiDung />} />
              <Route path="/phan-cong" element={<PhanCong />} />
              <Route path="/tong-ket" element={<TongKet />} />
              <Route path="/quan-ly-lich-hien-mau" element={<QuanLyLichHienMau />} />
            </>
          )}

          {/* Routes cho staff */}
          {isLoggedIn && userRole === "staff" && (
            <>
              <Route path="/cong-viec" element={<CongViec />} />
              <Route path="/quan-ly-hien-mau" element={<QuanLyHienMau />} />
              <Route path="/quan-ly-nhan-mau" element={<QuanLyNhanMau />} />
              <Route path="/ngan-hang-mau" element={<NganHangMau />} />
            </>
          )}
          
          {/* Các trang chung */}
          <Route path="/blood-schedule" element={<BloodSchedulePage />} />
          <Route path="/blood-register" element={<BloodRegisterPage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
