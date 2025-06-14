// src/frontend/src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png"; // Đã đổi đường dẫn ảnh
import styles from "./Header.module.css";
export default function Header({ isLoggedIn, userInfo, handleLogout, userRole }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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
        ],
    };

    return (
        <header>
            <div className="navbar">
                <img src={logo} alt="Logo" className="logo" />
                <nav>
                    <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                        TRANG CHỦ
                    </NavLink>

                    {!isLoggedIn && (
                        <>
                            <NavLink to="/hoi-dap" className={({ isActive }) => (isActive ? "active" : "")}>
                                HỎI – ĐÁP
                            </NavLink>
                            <NavLink to="/lien-he" className={({ isActive }) => (isActive ? "active" : "")}>
                                LIÊN HỆ
                            </NavLink>
                        </>
                    )}

                    {isLoggedIn &&
                        menuByRole[userRole]?.map(({ to, label }) => (
                            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
                                {label}
                            </NavLink>
                        ))}

                    {!isLoggedIn ? (
                          <>
                            <NavLink to="/login">ĐĂNG NHẬP</NavLink>
                            <NavLink to="/register" className="register-button-nav">
                            ĐĂNG KÝ
                            </NavLink>
                        </>
                    ) : (
                        <div className="user-dropdown" ref={dropdownRef}>
                            <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
                                <div className="user-circle">
                                    {userInfo.full_name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()}
                                </div>
                                <span className="user-name">{userInfo.full_name}</span>
                                <span className="dropdown-arrow">▾</span>
                            </div>
                            {showDropdown && (
                                <div className="dropdown-menu new-style">
                                    <button className="dropdown-item">Thông tin cá nhân</button>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}