import './Bennefits.css';
import benefitImg from '../picture/benefit.png';
import { useState, useEffect, useRef } from 'react';

const AUTO_SLIDE_INTERVAL = 4000; // 4 giây

const pages = [
    {
        title: 'Được tư vấn về sức khoẻ',
        items: [
            'Được giải thích về quy trình hiến máu và các tai biến có thể xảy ra trong và sau khi hiến máu.',
            'Được cung cấp thông tin về dấu hiệu, triệu chứng do nhiễm vi rút viêm gan, HIV và một số bệnh lây qua đường truyền máu, tình dục khác.',
            'Được xét nghiệm sàng lọc một số vi rút lây qua đường truyền máu, tình dục (HIV, Giang mai, viêm gan,…) sau khi hiến máu.',
            'Được tư vấn hướng dẫn cách chăm sóc sức khỏe, tư vấn về kết quả bất thường sau hiến máu.',
            'Được bảo mật về kết quả khám lâm sàng, kết quả xét nghiệm.'
        ]
    },
    {
        title: 'Được bồi dưỡng trực tiếp',
        items: [
            'Ăn nhẹ, nước uống tại chỗ: tương đương 30.000 đồng (1 chai trà xanh không độ, 01 hộp chocopie 66gram, 01 hộp bánh Goute 35,5gram).',
            'Hỗ trợ chi phí đi lại (bằng tiền mặt): 50.000 đồng.',
            {
                label: 'Nhận phần quà tặng giá trị tương đương:',
                sub: [
                    '100.000đ khi hiến máu 250ml',
                    '150.000đ khi hiến máu 350ml',
                    '180.000đ khi hiến máu 450ml'
                ]
            }
        ]
    },
    {
        title: 'Được cấp Giấy chứng nhận hiến máu tình nguyện',
        items: [
            'Giấy chứng nhận được trao cho người hiến máu sau mỗi lần hiến máu tình nguyện.',
            'Có giá trị để được truyền máu miễn phí bằng số lượng máu đã hiến, khi bản thân người hiến có nhu cầu sử dụng máu tại tất cả các cơ sở y tế công lập trên toàn quốc.',
            'Người hiến máu cần xuất trình Giấy chứng nhận để làm cơ sở cho các cơ sở y tế thực hiện việc truyền máu miễn phí.',
            'Cơ sở y tế có trách nhiệm ký, đóng dấu, xác nhận số lượng máu đã truyền miễn phí cho người hiến máu vào giấy chứng nhận.'
        ]
    }
];

export default function Bennefits() {
    const [page, setPage] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState(0); // -1: left, 1: right
    const timeoutRef = useRef();
    const animTimeoutRef = useRef();

    // Auto slide effect
    useEffect(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            handleSlide(1);
        }, AUTO_SLIDE_INTERVAL);
        return () => clearTimeout(timeoutRef.current);
    }, [page]);

    // Slide animation
    function handleSlide(dir) {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        animTimeoutRef.current && clearTimeout(animTimeoutRef.current);
        animTimeoutRef.current = setTimeout(() => {
            setPage(p => {
                let next = p + dir;
                if (next < 0) next = pages.length - 1;
                if (next >= pages.length) next = 0;
                return next;
            });
            setAnimating(false);
        }, 350);
    }

    // Kéo chuột để chuyển trang
    const dragState = useRef({ startX: 0, dragging: false });
    const handleDragStart = e => {
        dragState.current.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        dragState.current.dragging = true;
    };
    const handleDragEnd = e => {
        if (!dragState.current.dragging) return;
        const endX = e.type === 'touchend' ? (e.changedTouches[0]?.clientX ?? 0) : e.clientX;
        const diff = endX - dragState.current.startX;
        if (diff > 60) handleSlide(-1);
        else if (diff < -60) handleSlide(1);
        dragState.current.dragging = false;
    };

    return (
        <section className="benefit-section">
            <div className="benefit-card">
                <img src={benefitImg} alt="Quyền lợi của người hiến máu" className="benefit-img" />
                <h2 className="benefit-title">Quyền lợi của người hiến máu</h2>
            </div>
            <div
                className="benefit-card benefit-content-card"
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
                style={{ cursor: 'grab', userSelect: 'none', position: 'relative', overflow: 'hidden' }}
            >
                <div
                    className={`benefit-slide${animating ? (direction === 1 ? ' slide-left' : ' slide-right') : ''}`}
                    key={page}
                >
                    <h3 className="benefit-content-title">{pages[page].title}</h3>
                    <ul className="benefit-list">
                        {pages[page].items.map((item, idx) =>
                            typeof item === 'string' ? (
                                <li key={idx}>{item}</li>
                            ) : (
                                <li key={idx} style={{ listStyle: 'none', paddingLeft: 0 }}>
                                    {item.label}
                                    <ul className="benefit-sub-list">
                                        {item.sub.map((sub, subIdx) => (
                                            <li key={subIdx} className="benefit-sub-item">{sub}</li>
                                        ))}
                                    </ul>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="benefit-nav">
                    <button
                        className="benefit-arrow"
                        onClick={() => handleSlide(-1)}
                        aria-label="Trang trước"
                    >&#8592;</button>
                    <button
                        className="benefit-arrow"
                        onClick={() => handleSlide(1)}
                        aria-label="Trang sau"
                    >&#8594;</button>
                </div>
            </div>
        </section>
    );
}
