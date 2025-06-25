import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import NotFoundPage from "./pages/NotFoundPage";

// Trang cá nhân
import DetailUser from "./components/DetailUser/DetailUser";
import EditUser from "./components/DetailUser/EditUser";
import ChangePassword from "./components/DetailUser/ChangePassword";

// Trang dành cho member
import { LichSu, LichHen, DangKyHienMau, DangKyNhanMau } from "./pages/MemberPages";

// Trang dành cho admin
import { NguoiDung, PhanCong, TongKet, QuanLyLichHienMau } from "./pages/AdminPages";

// Trang dành cho staff
import { CongViec, QuanLyHienMau, QuanLyNhanMau, NganHangMau } from "./pages/staff";

import "./App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", full_name: "", role: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  function handleLoginSuccess(user) {
    setIsLoggedIn(true);
    setUserInfo(user);
    localStorage.setItem("userInfo", JSON.stringify(user));
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserInfo({ email: "", full_name: "", role: "" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  }

  const userRole = userInfo.role;

  return (
    <div className="app-root">
      <Header
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        handleLogout={handleLogout}
        userRole={userRole}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hoi-dap" element={<FaqPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

          {/* Cá nhân */}
          {isLoggedIn && (
            <>
              <Route path="/thong-tin" element={<DetailUser />} />
              <Route path="/thong-tin/chinh-sua" element={<EditUser />} />
              <Route path="/doi-mat-khau" element={<ChangePassword />} />
            </>
          )}

          {/* Member */}
          {isLoggedIn && userRole === "member" && (
            <>
              <Route path="/lich-su" element={<LichSu />} />
              <Route path="/lich-hen" element={<LichHen />} />
              <Route path="/dang-ky-hien-mau" element={<DangKyHienMau />} />
              <Route path="/dang-ky-nhan-mau" element={<DangKyNhanMau />} />
            </>
          )}

          {/* Admin */}
          {isLoggedIn && userRole === "admin" && (
            <>
              <Route path="/nguoi-dung" element={<NguoiDung />} />
              <Route path="/phan-cong" element={<PhanCong />} />
              <Route path="/tong-ket" element={<TongKet />} />
              <Route path="/quan-ly-lich-hien-mau" element={<QuanLyLichHienMau />} />
            </>
          )}

          {/* Staff */}
          {isLoggedIn && userRole === "staff" && (
            <>
              <Route path="/cong-viec" element={<CongViec />} />
              <Route path="/quan-ly-hien-mau" element={<QuanLyHienMau />} />
              <Route path="/quan-ly-nhan-mau" element={<QuanLyNhanMau />} />
              <Route path="/ngan-hang-mau" element={<NganHangMau />} />
            </>
          )}

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
