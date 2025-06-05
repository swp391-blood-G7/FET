// File: my-react-app/src/App.jsx
import { Routes, Route, NavLink } from "react-router-dom";
import Banner from "./Banner";
import Footer from "./Footer";
import Bennefits from './Bennefits';
import Standards from './Standards';
import Faq from './Faq';
import Login from './Login'; // Import the Login component
import './App.css';

function Home() {
  return (
    <>
      <Banner />
      <Bennefits />
      <Standards />
    </>
  );
}

function LichSu() { return <h1>Lịch sử</h1>; }
function LichHen() { return <h1>Lịch hẹn</h1>; }
function HoiDap() { return <Faq />; }
function ThongBao() { return <h1>Thông báo</h1>; }
function DangKyHienMau() { return <h1>Đăng ký hiến máu</h1>; }
function DangKyNhanMau() { return <h1>Đăng ký nhận máu</h1>; }
function NotFound() { return <h2>404 - Không tìm thấy trang</h2>; }

export default function App() {
  return (
    <div className="app-root">
      <header>
        <div className="navbar">
          <img src="/picture/logo.png" alt="Logo" className="logo" />
          <nav>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Trang chủ</NavLink>
            <NavLink to="/lich-su" className={({ isActive }) => isActive ? "active" : ""}>Lịch sử đặt hẹn</NavLink>
            <NavLink to="/lich-hen" className={({ isActive }) => isActive ? "active" : ""}>Lịch hẹn của bạn</NavLink>
            <NavLink to="/hoi-dap" className={({ isActive }) => isActive ? "active" : ""}>Hỏi – Đáp</NavLink>
            <NavLink to="/thong-bao" className={({ isActive }) => isActive ? "active" : ""}>Thông báo</NavLink>
            <NavLink to="/dang-ky-hien-mau" className={({ isActive }) => isActive ? "active" : ""}>Đăng ký hiến máu</NavLink>
            <NavLink to="/dang-ky-nhan-mau" className={({ isActive }) => isActive ? "active" : ""}>Đăng ký nhận máu</NavLink>
            {/* Updated Sign in button to be a NavLink */}
            <NavLink to="/login">Sign in</NavLink>

            <button className="btn">Register</button>
          </nav>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lich-su" element={<LichSu />} />
          <Route path="/lich-hen" element={<LichHen />} />
          <Route path="/hoi-dap" element={<HoiDap />} />
          <Route path="/thong-bao" element={<ThongBao />} />
          <Route path="/dang-ky-hien-mau" element={<DangKyHienMau />} />
          <Route path="/dang-ky-nhan-mau" element={<DangKyNhanMau />} />
          <Route path="/login" element={<Login />} /> {/* Add route for Login page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
