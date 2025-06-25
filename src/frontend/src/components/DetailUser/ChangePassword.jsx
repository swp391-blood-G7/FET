import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePassword.module.css';
import { toast } from 'react-toastify';

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Không xác thực');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/me/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                oldPassword: currentPassword,
                newPassword,
            }),
            });

      if (res.ok) {
        toast.success('Đổi mật khẩu thành công!');
        setTimeout(() => navigate('/thong-tin'), 1500);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (err) {
      console.error('Lỗi khi đổi mật khẩu:', err);
      toast.error('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đổi mật khẩu</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Mật khẩu hiện tại:
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label>Mật khẩu mới:
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label>Xác nhận mật khẩu mới:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <button className={styles.saveButton} type="submit">Xác nhận đổi mật khẩu</button>
      </form>
    </div>
  );
}

export default ChangePassword;
