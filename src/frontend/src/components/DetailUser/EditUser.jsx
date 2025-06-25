import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditUser.module.css';
import { toast } from 'react-toastify';

function UserEdit() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const formattedDate = data.date_of_birth
          ? new Date(data.date_of_birth).toISOString().split('T')[0]
          : '';

        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || '',
          date_of_birth: formattedDate,
          address: data.address || ''
        });
      })
      .catch(err => {
        console.error('Lỗi lấy thông tin:', err);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3001/api/auth/me/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Cập nhật thông tin thành công!');
        setTimeout(() => navigate('/thong-tin'), 1500);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      toast.error('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cập nhật thông tin cá nhân</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Họ và tên:
          <input name="full_name" value={formData.full_name} onChange={handleChange} required />
        </label>

        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>Số điện thoại:
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </label>

        <label>Giới tính:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">-- Chọn --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </label>

        <label>Ngày sinh:
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
        </label>

        <label>Địa chỉ:
          <input name="address" value={formData.address} onChange={handleChange} />
        </label>

        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} type="submit">Lưu thay đổi</button>
          <button
            type="button"
            className={styles.changePasswordButton}
            onClick={() => navigate('/doi-mat-khau')}
          >
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserEdit;
