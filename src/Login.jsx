// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password_hash, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password_hash }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Đăng nhập thành công!');
        onLoginSuccess({ email, full_name: data.full_name });
        navigate('/');
      } else {
        alert('Sai email hoặc mật khẩu!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert('Lỗi kết nối đến server!');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>

        <div className="form-group">
          <label>Email:</label>
          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mật khẩu:</label>
          <div className="input-wrapper">
            <FaLock className="input-icon" />
            <input
              type="password"
              value={password_hash}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>
        </div>

        <button className="btn-login" type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
