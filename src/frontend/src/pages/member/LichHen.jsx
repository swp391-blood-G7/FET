import React from 'react';
import { FaMapMarkerAlt, FaClock, FaTint } from 'react-icons/fa';
import './LichHen.css'; // Nhớ tạo và thêm file CSS này hoặc nhúng Tailwind nếu dùng

function LichHen() {
    const lichHenData = [
        {
            id: 1,
            diaDiem: "Trung tâm hiến máu nhân đạo",
            moTa: "(làm việc từ 8g đến 17g)",
            diaChi: "106 Thiên Phước, P9, Tân Bình, Tp HCM",
            thoiGian: "08:00 đến 10:00 - 25/06/2025",
        }
    ];

    return (
        <div className="lich-hen-container">
            <h2 className="title">Lịch hẹn của bạn</h2>
            <div className="list">
                {lichHenData.map((item) => (
                    <div className="lich-hen-card" key={item.id}>
                        <div className="icon">
                            <FaTint size={36} color="#e74c3c" />
                        </div>
                        <div className="info">
                            <h3>
                                {item.diaDiem} <span className="mo-ta">{item.moTa}</span>
                            </h3>
                            <p><FaMapMarkerAlt /> {item.diaChi}</p>
                            <p><FaClock /> {item.thoiGian}</p>
                        </div>
                        <div className="actions">
                            <a href="#" className="detail-link">Xem chi tiết</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LichHen;