import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ReceptionHistory.module.css';

function ReceptionHistory() {
  const [receptionHistory, setReceptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');

  // Map blood_group_id với nhóm máu thực tế
  const getBloodTypeInfo = (bloodGroupId) => {
    const bloodTypes = {
      1: 'A+',
      2: 'A-',
      3: 'B+',
      4: 'B-',
      5: 'AB+',
      6: 'AB-',
      7: 'O+',
      8: 'O-'
    };
    return bloodTypes[bloodGroupId] || `Nhóm ${bloodGroupId}`;
  };

  // Map trạng thái với màu sắc và text tiếng Việt
  const getStatusInfo = (status) => {
    switch(status?.toLowerCase()) {
      case 'requested':
        return { text: 'Đã yêu cầu', color: '#ffa726', bgColor: '#fff3e0' };
      case 'approved':
        return { text: 'Đã duyệt', color: '#42a5f5', bgColor: '#e3f2fd' };
      case 'completed':
        return { text: 'Đã hoàn thành', color: '#66bb6a', bgColor: '#e8f5e8' };
      case 'cancelled':
        return { text: 'Đã hủy', color: '#ef5350', bgColor: '#ffebee' };
      default:
        return { text: 'Không xác định', color: '#9e9e9e', bgColor: '#f5f5f5' };
    }
  };

  useEffect(() => {
    const fetchReceptionHistory = async () => {
      if (!token) {
        setError('Vui lòng đăng nhập để xem lịch sử nhận máu');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        // Lấy thông tin recipient
        const res = await axios.get('/api/recipients/my/info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Chuyển đổi kết quả thành array nếu cần
        if (res.data) {
          if (Array.isArray(res.data)) {
            setReceptionHistory(res.data);
          } else {
            setReceptionHistory([res.data]);
          }
        }
      } catch (err) {
        console.error('Error fetching reception history:', err);
        if (err.response?.status === 404) {
          setError('Bạn chưa đăng ký nhận máu nào');
        } else if (err.response?.status === 401) {
          setError('Vui lòng đăng nhập lại');
        } else {
          setError('Không thể tải thông tin nhận máu. Vui lòng thử lại sau.');
        }
        setReceptionHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReceptionHistory();
  }, [token]);

  if (loading) return <div className={styles.loading}>Đang tải lịch sử nhận máu...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.receptionHistoryContainer}>
      <h2 className={styles.pageTitle}>Lịch sử nhận máu</h2>
      
      {!receptionHistory || receptionHistory.length === 0 ? (
        <div className={styles.noData}>Bạn chưa có lịch sử nhận máu.</div>
      ) : (
        <div className={styles.historyList}>
          {receptionHistory.map((item, index) => {
            const statusInfo = getStatusInfo(item.receive_status);
            // Xử lý ngày đăng ký
            let ngayDangKy = '---';
            if (item.registration_date) {
              const d = new Date(item.registration_date);
              if (!isNaN(d.getTime())) {
                ngayDangKy = d.toLocaleDateString('vi-VN');
              }
            }
            // Xử lý nhóm máu
            let nhomMau = '';
            if (item.blood_type && item.rh_factor) {
              nhomMau = item.blood_type + item.rh_factor;
            } else if (item.blood_group_id) {
              nhomMau = getBloodTypeInfo(item.blood_group_id);
            } else {
              nhomMau = 'Không xác định';
            }
            return (
              <div key={item.recipient_id || index} className={styles.historyCard}>
                <div className={styles.cardLogo}>
                  <div className={styles.medicalCross}>
                    ⚕️
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Ngày đăng ký:</span>
                    <span className={styles.cardValue}>{ngayDangKy}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Nhóm máu:</span>
                    <span className={`${styles.cardValue} ${styles.bloodTypeValue}`}>{nhomMau}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Trạng thái:</span>
                    <span 
                      className={styles.statusBadge}
                      style={{ 
                        color: statusInfo.color, 
                        backgroundColor: statusInfo.bgColor 
                      }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReceptionHistory;
