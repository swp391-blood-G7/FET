// src/frontend/src/pages/staff/QuanLyHienMau.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QuanLyHienMau.css'; // Nếu có styling riêng

function QuanLyHienMau() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/donors')
      .then(res => {
        setDonors(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Không thể tải danh sách người hiến máu.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="donor-list-container">
      <h1>Trang Quản Lý Hiến Máu</h1>
      {loading ? (
        <p>Đang tải danh sách...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table className="donor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Nhóm máu</th>
              <th>Ngày hiến gần nhất</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {donors.map(donor => (
              <tr key={donor.donor_id}>
                <td>{donor.donor_id}</td>
                <td>{donor.full_name}</td>
                <td>{donor.email}</td>
                <td>{donor.blood_type}{donor.rh_factor}</td>
                <td>{donor.last_donation_date?.split('T')[0]}</td>
                <td>{donor.donation_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuanLyHienMau;
