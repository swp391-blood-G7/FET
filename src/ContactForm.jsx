import React from 'react';
import './ContactForm.css'; // Nếu bạn muốn styling giống ảnh

export default function ContactForm() {
  return (
    <div className="contact-container">
      <div className="contact-left">
        <h2>Liên hệ</h2>
        <p><strong>Email:</strong> blooddonation259@gmail.com</p>

        <p><strong>TT Hiến Máu Nhân Đạo:</strong><br />
          1234567890<br />
          1234876509
        </p>

        <p><strong>Bệnh viện BTH:</strong><br />
          4321567890<br />
          0987651234
        </p>

        <p><strong>TT nhận máu:</strong><br />
          0123459876<br />
        </p>
      </div>

      <div className="contact-right">
        <h2>Gửi lời nhắn cho chúng tôi</h2>
        <form>
          <input type="text" placeholder="Vui lòng nhập họ và tên" required />
          <input type="email" placeholder="Vui lòng nhập email" required />
          <textarea placeholder="Vui lòng nhập lời nhắn" rows="5" required></textarea>
          <button type="submit">Gửi lời nhắn</button>
        </form>
      </div>
    </div>
  );
}
