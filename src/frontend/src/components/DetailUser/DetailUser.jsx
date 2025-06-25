import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DetailUser.module.css';

function UserDetail() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API /me:', err);
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    navigate('/thong-tin/chinh-sua'); 
  };

  if (loading) return <p className={styles.loading}>Đang tải thông tin...</p>;
  if (!user) return <p className={styles.error}>Không thể tải thông tin người dùng.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thông tin tài khoản</h2>

      <div className={styles.detailRow}>
        <span className={styles.label}>Tên đăng nhập:</span>
        <span className={styles.value}>{user.username}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.label}>Họ và tên:</span>
        <span className={styles.value}>{user.full_name}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.label}>Email:</span>
        <span className={styles.value}>{user.email}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.label}>Số điện thoại:</span>
        <span className={styles.value}>{user.phone}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.label}>Giới tính:</span>
        <span className={styles.value}>{user.gender}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.label}>Ngày sinh:</span>
        <span className={styles.value}>{user.date_of_birth}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.label}>Địa chỉ:</span>
        <span className={styles.value}>{user.address}</span>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.editButton} onClick={handleEdit}>Chỉnh sửa</button>
      </div>
    </div>
  );
}

export default UserDetail;
