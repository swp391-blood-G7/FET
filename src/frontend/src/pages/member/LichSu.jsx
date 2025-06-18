import React from 'react';
import './LichSu.css'; // Bạn nên tạo CSS riêng cho đẹp

function LichSu() {
    const lichSuData = [
        {
            id: 1,
            diaDiem: "HCM DONATION CENTER",
            moTa: "(cả ngày từ 8g đến 17g)",
            diaChi: "466 Nguyễn Thị Minh Khai, Phường 02, Quận 3, Tp Hồ Chí Minh",
            thoiGian: "07:00 đến 11:00 - 16/06/2025",
            daXoa: true,
        },
        {
            id: 2,
            diaDiem: "HCM DONATION CENTER",
            moTa: "(cả ngày từ 8g đến 17g)",
            diaChi: "466 Nguyễn Thị Minh Khai, Phường 02, Quận 3, Tp Hồ Chí Minh",
            thoiGian: "08:00 đến 10:00 - 10/05/2025",
            daXoa: false,
        },
        {
            id: 3,
            diaDiem: "HCM DONATION CENTER",
            moTa: "(cả ngày từ 8g đến 17g)",
            diaChi: "466 Nguyễn Thị Minh Khai, Phường 02, Quận 3, Tp Hồ Chí Minh",
            thoiGian: "07:30 đến 10:30 - 15/04/2025",
            daXoa: true,
        },
        {
            id: 4,
            diaDiem: "HCM DONATION CENTER",
            moTa: "(cả ngày từ 8g đến 17g)",
            diaChi: "466 Nguyễn Thị Minh Khai, Phường 02, Quận 3, Tp Hồ Chí Minh",
            thoiGian: "08:00 đến 11:00 - 28/03/2025",
            daXoa: false,
        },
        {
            id: 5,
            diaDiem: "HCM DONATION CENTER",
            moTa: "(cả ngày từ 8g đến 17g)",
            diaChi: "466 Nguyễn Thị Minh Khai, Phường 02, Quận 3, Tp Hồ Chí Minh",
            thoiGian: "08:00 đến 12:00 - 12/02/2025",
            daXoa: false,
        },
    ];


    return (
        <div className="lichsu-container">
            <h2 className="lichsu-title">Lịch sử đặt hẹn</h2>
            <div className="lichsu-list">
                {lichSuData.map((item) => (
                    <div className="lichsu-item" key={item.id}>
                        <div className="lichsu-icon">
                            <img src="/blood-drop.png" alt="hiến máu" />
                            <span>Hiến máu</span>
                        </div>
                        <div className="lichsu-content">
                            <div className="lichsu-header">
                                <strong className="lichsu-diaDiem">
                                    {item.diaDiem}{" "}
                                    <span className="lichsu-mota">{item.moTa}</span>
                                </strong>
                                {item.daXoa && (
                                    <span className="lichsu-status">Đã xoá</span>
                                )}
                            </div>
                            <div className="lichsu-body">
                                <p><i className="fa fa-map-marker"></i> {item.diaChi}</p>
                                <p><i className="fa fa-clock-o"></i> {item.thoiGian}</p>
                            </div>
                            <div className="lichsu-footer">
                                <a href="#" className="lichsu-link">📄 Xem chi tiết</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LichSu;
