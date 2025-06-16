// src/frontend/src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import styles from "./Header.module.css";
import { FaUserCircle } from "react-icons/fa";

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
            { to: "/dashboard", label: "TRANG CÁ NHÂN" },
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
        <header className={styles.header}>
            <div className={styles.navbar}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <nav>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => (isActive ? styles.active : "")}
                    >
                        TRANG CHỦ
                    </NavLink>

                    {!isLoggedIn && (
                        <>
                            <NavLink to="/hoi-dap" className={({ isActive }) => (isActive ? styles.active : "")}>
                                HỎI – ĐÁP
                            </NavLink>
                            <NavLink to="/lien-he" className={({ isActive }) => (isActive ? styles.active : "")}>
                                LIÊN HỆ
                            </NavLink>
                        </>
                    )}

                    {isLoggedIn &&
                        menuByRole[userRole]?.map(({ to, label }) => (
                            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? styles.active : "")}>
                                {label}
                            </NavLink>
                        ))}

                    {!isLoggedIn ? (
                        <>
                            <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : "")}>
                                ĐĂNG NHẬP
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) => (isActive ? `${styles.active} ${styles.registerButtonNav}` : styles.registerButtonNav)}
                            >
                                ĐĂNG KÝ
                            </NavLink>
                        </>
                    ) : (
                        <div className={styles.userDropdown} ref={dropdownRef}>
                            <div className={styles.userInfo} onClick={() => setShowDropdown(!showDropdown)}>
                                <div className={styles.userCircle}>
                                    {userInfo.full_name
                                        .split(" ")
                                        .map((word) => word[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                                <span className={styles.userName}>{userInfo.full_name}</span>
                                <span className={styles.dropdownArrow}>▾</span>
                            </div>
                            <div
                                className={`${styles.dropdownMenu} ${showDropdown ? styles.show : ""}`}
                            >
                                <button className={styles.dropdownItem}>Thông tin cá nhân</button>
                                <button className={styles.dropdownItem} onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
