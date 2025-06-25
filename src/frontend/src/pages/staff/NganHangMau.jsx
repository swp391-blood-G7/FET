import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NganHangMau.css';

function NganHangMau() {
  const [bloodBags, setBloodBags] = useState([]);

  useEffect(() => {
    const fetchBloodBags = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/blood-bags/take/bloodbag');
        setBloodBags(res.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu túi máu:', error);
      }
    };

    fetchBloodBags();
  }, []);

  return (
    <div className="container">
      <h1>Ngân Hàng Máu</h1>
      {bloodBags.length === 0 ? (
        <p>Không có dữ liệu túi máu.</p>
      ) : (
        <table className="blood-table">
          <thead>
            <tr>
              <th>Mã túi máu</th>
              <th>Người hiến</th>
              <th>Nhóm máu</th>
              <th>Thành phần</th>
              <th>Thể tích (ml)</th>
              <th>Ngày thu thập</th>
              <th>Hạn sử dụng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bloodBags.map((bag) => (
              <tr key={bag.blood_bag_id}>
                <td>{bag.blood_bag_id}</td>
                <td>{bag.donor_name}</td>
                <td>{`${bag.blood_type}${bag.rh_factor}`}</td>
                <td>{bag.component_name}</td>
                <td>{bag.volume_ml}</td>
                <td>{new Date(bag.collection_date).toLocaleDateString()}</td>
                <td>{new Date(bag.expiry_date).toLocaleDateString()}</td>
                <td className={`status ${bag.status}`}>{bag.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NganHangMau;
