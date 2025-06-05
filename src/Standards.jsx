import './Standards.css';
import standardsImg from '../picture/benefit.png';

// Các card còn lại (mỗi cái 2x1)
const standards = [
    {
        icon: '📋',
        text: 'Cân nặng: Nam ≥ 45 kg Nữ ≥ 45 kg',
        col: 1, row: 3
    },
    {
        icon: '🔞',
        text: 'Người khỏe mạnh trong độ tuổi từ đủ 18 đến 60 tuổi',
        col: 1, row: 4
    },
    {
        icon: '🆔',
        text: 'Mang theo chứng minh nhân dân/hộ chiếu',
        col: 3, row: 1
    },
    {
        icon: '💉',
        text: 'Không nghiện ma túy, rượu bia và các chất kích thích',
        col: 3, row: 2
    },
    {
        icon: '❤️',
        text: 'Không mắc các bệnh mãn tính hoặc cấp tính về tim mạch, huyết áp, hô hấp, dạ dày…',
        col: 3, row: 3
    },
    {
        icon: '📅',
        text: 'Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ',
        col: 3, row: 4
    },
    {
        icon: '🩸',
        text: 'Chỉ số huyết sắc tố (Hb) ≥120g/l (≥125g/l nếu hiến từ 350ml trở lên).',
        col: 5, row: 3
    },
    {
        icon: '🧪',
        text: 'Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B',
        col: 5, row: 4
    },
];

export default function Standards() {
    return (
        <section className="standards-section-3col">
            {/* Ảnh 2x2 */}
            <div className="standards-img-card">
                <h2 className="standards-title">Tiêu chuẩn tham gia hiến máu</h2>
                <img src={standardsImg} alt="Tiêu chuẩn tham gia hiến máu" className="standards-img" />
            </div>
            {/* Card HIV 2x2 */}
            <div className="standards-hiv-card">
                <span className="standards-icon">🧬</span>
                <span className="standards-text">
                    Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV, không nhiễm viêm gan B, viêm gan C, và các virus lây qua đường truyền máu
                </span>
            </div>
            {/* Các card còn lại 2x1 */}
            {standards.map((item) => (
                <div
                    className="standards-item"
                    style={{ gridColumn: `${item.col} / span 2`, gridRow: `${item.row} / span 1` }}
                    key={item.text}
                >
                    <span className="standards-icon">{item.icon}</span>
                    <span className="standards-text">{item.text}</span>
                </div>
            ))}
        </section>
    );
}
