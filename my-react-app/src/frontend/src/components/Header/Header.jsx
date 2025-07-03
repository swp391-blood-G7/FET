// src/frontend/src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import ProfilePage from '../ProfilePage/ProfilePage';
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
            { to: "/lich-su", label: "Lịch Sử", icon: "📋" },
            { to: "/dang-ky-nhan-mau", label: "Đăng Ký Nhận Máu", icon: "🩸" },
            { to: "/hoi-dap", label: "Hỏi – Đáp", icon: "❓" },
            { to: "/lien-he", label: "Liên Hệ", icon: "📞" },
        ],
        admin: [
            { to: "/nguoi-dung", label: "Người Dùng", icon: "👥" },
            { to: "/phan-cong", label: "Phân Công", icon: "📋" },
            { to: "/tong-ket", label: "Tổng Kết", icon: "📊" },
            { to: "/quan-ly-lich-hien-mau", label: "Quản Lý Lịch", icon: "📅" },
        ],
        staff: [
            { to: "/cong-viec", label: "Công Việc", icon: "💼" },
            { to: "/quan-ly-hien-mau", label: "Quản Lý Hiến Máu", icon: "🩸" },
            { to: "/quan-ly-nhan-mau", label: "Quản Lý Nhận Máu", icon: "🏥" },
            { to: "/ngan-hang-mau", label: "Ngân Hàng Máu", icon: "🏦" },
        ],
    };

    const getInitials = (fullName) => {
        if (!fullName) return "U";
        return fullName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo và Brand */}
                <div className={styles.brand}>
                    <img src={logo} alt="HCM Donation Logo" className={styles.logo} />
                    <div className={styles.brandText}>
                        <h1 className={styles.brandName}>HCM Donation</h1>
                        <span className={styles.brandSlogan}>Sẻ chia giọt máu</span>
                        <span className={styles.brandSlogan}>Kết nối tình người</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <NavLink 
                        to="/" 
                        end 
                        className={({ isActive }) => 
                            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                        }
                    >
                        <span className={styles.navIcon}>🏠</span>
                        <span>Trang Chủ</span>
                    </NavLink>

                    {!isLoggedIn && (
                        <>
                            <NavLink 
                                to="/hoi-dap" 
                                className={({ isActive }) => 
                                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                                }
                            >
                                <span className={styles.navIcon}>❓</span>
                                <span>Hỏi – Đáp</span>
                            </NavLink>
                            <NavLink 
                                to="/lien-he" 
                                className={({ isActive }) => 
                                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                                }
                            >
                                <span className={styles.navIcon}>📞</span>
                                <span>Liên Hệ</span>
                            </NavLink>
                        </>
                    )}

                    {isLoggedIn &&
                        menuByRole[userRole]?.map(({ to, label, icon }) => (
                            <NavLink 
                                key={to} 
                                to={to} 
                                className={({ isActive }) => 
                                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                                }
                            >
                                <span className={styles.navIcon}>{icon}</span>
                                <span>{label}</span>
                            </NavLink>
                        ))}
                </nav>

                {/* User Section */}
                <div className={styles.userSection}>
                    {!isLoggedIn ? (
                        <div className={styles.authButtons}>
                            <NavLink to="/login" className={styles.loginBtn}>
                                Đăng Nhập
                            </NavLink>
                            <NavLink to="/register" className={styles.registerBtn}>
                                Đăng Ký
                            </NavLink>
                        </div>
                    ) : (
                        <div className={styles.userDropdown} ref={dropdownRef}>
                            <div 
                                className={styles.userInfo} 
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className={styles.userAvatar}>
                                    {getInitials(userInfo?.full_name)}
                                </div>
                                <div className={styles.userDetails}>
                                    <span className={styles.userName}>
                                        {userInfo?.full_name || "Người dùng"}
                                    </span>
                                    <span className={styles.userRole}>
                                        {userRole === 'admin' ? 'Quản trị viên' : 
                                         userRole === 'staff' ? 'Nhân viên' : 'Thành viên'}
                                    </span>
                                </div>
                                <span className={styles.dropdownArrow}>
                                    {showDropdown ? '▲' : '▼'}
                                </span>
                            </div>
                            {showDropdown && (
                                <div className={styles.dropdownMenu}>
                                    <button className={styles.dropdownItem} onClick={() => { setShowDropdown(false); window.location.href = '/profile'; }}>
                                        <span>👤</span>
                                        <span>Thông tin cá nhân</span>
                                    </button>
                                    <div className={styles.dropdownDivider}></div>
                                    <button 
                                        className={`${styles.dropdownItem} ${styles.logoutItem}`}
                                        onClick={handleLogout}
                                    >
                                        <span>🚪</span>
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
