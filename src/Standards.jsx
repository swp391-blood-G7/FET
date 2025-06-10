import React from 'react';
import './Standards.css';
import { FaWeight, FaUserCheck, FaIdCard, FaBan, FaHeartbeat, FaClock, FaTint, FaVial, FaVirus } from 'react-icons/fa';

const standardsList = [
    { icon: <FaWeight />, text: 'Cân nặng: Nam ≥ 45 kg Nữ ≥ 45 kg' },
    { icon: <FaUserCheck />, text: 'Người khỏe mạnh trong độ tuổi từ đủ 18 đến 60 tuổi' },
    { icon: <FaIdCard />, text: 'Mang theo chứng minh nhân dân/hộ chiếu' },
    { icon: <FaBan />, text: 'Không nghiện ma túy, rượu bia và các chất kích thích' },
    { icon: <FaHeartbeat />, text: 'Không mắc các bệnh mãn tính hoặc cấp tính về tim mạch, huyết áp, hô hấp, dạ dày…' },
    { icon: <FaClock />, text: 'Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ' },
    { icon: <FaTint />, text: 'Chỉ số huyết sắc tố (Hb) ≥120g/l (≥125g/l nếu hiến từ 350ml trở lên).' },
    { icon: <FaVial />, text: 'Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B' },
    { icon: <FaVirus />, text: 'Không mắc hoặc không có hành vi nguy cơ lây nhiễm HIV, không nhiễm viêm gan B, viêm gan C, và các virus lây qua đường truyền máu' }
];
function Standards() {
    return (
        <div className="standards-wrapper">
            <h2 className="standards-title">Tiêu chuẩn hiến máu</h2>
            <div className="standards-container">
                {standardsList.map((item, index) => (
                    <div key={index} className="standards-box">
                        <div className="icon">{item.icon}</div>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Standards;