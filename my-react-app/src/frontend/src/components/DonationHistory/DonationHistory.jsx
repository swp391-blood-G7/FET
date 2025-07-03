import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DonationHistory.module.css';

function DonationHistory() {
  const [history, setHistory] = useState([]);
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
      case 'scheduled':
        return { text: 'Đã đặt lịch', color: '#ffa726', bgColor: '#fff3e0' };
      case 'donated':
        return { text: 'Đã hoàn thành', color: '#66bb6a', bgColor: '#e8f5e8' };
      case 'cancelled':
        return { text: 'Đã hủy', color: '#ef5350', bgColor: '#ffebee' };
      default:
        return { text: 'Không xác định', color: '#9e9e9e', bgColor: '#f5f5f5' };
    }
  };

  useEffect(() => {
    const fetchDonationHistory = async () => {
      if (!token) {
        setError('Vui lòng đăng nhập để xem lịch sử hiến máu');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        // Lấy lịch sử hiến máu
        const historyRes = await axios.get('/api/donors/my/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let data = Array.isArray(historyRes.data) ? historyRes.data : historyRes.data?.data || [];
        
        // Lấy thông tin appointments để tìm thời gian tương ứng
        if (data.length > 0) {
          try {
            // Tìm ngày sớm nhất và muộn nhất từ donation history
            const dates = data.map(item => new Date(item.donation_date));
            const earliestDate = new Date(Math.min(...dates));
            const latestDate = new Date(Math.max(...dates));
            
            // Mở rộng khoảng thời gian để đảm bảo bao phủ tất cả appointments
            earliestDate.setDate(earliestDate.getDate() - 30); // Lùi 30 ngày
            latestDate.setDate(latestDate.getDate() + 30); // Tiến 30 ngày
            
            const fromStr = earliestDate.toISOString().slice(0, 10);
            const toStr = latestDate.toISOString().slice(0, 10);
            
            // Lấy appointments trong khoảng thời gian này
            const allAppointmentsRes = await axios.get(`/api/appointments?from=${fromStr}&to=${toStr}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const appointments = Array.isArray(allAppointmentsRes.data) ? allAppointmentsRes.data : allAppointmentsRes.data?.data || [];
            
            // Enriched data với thông tin thời gian từ appointments
            const enrichedData = data.map(item => {
              // Tìm appointment tương ứng dựa trên ngày và donor_id
              const matchingAppointment = appointments.find(apt => {
                const donationDate = new Date(item.donation_date).toDateString();
                const appointmentDate = new Date(apt.appointment_date).toDateString();
                return donationDate === appointmentDate && apt.donor_id === item.donor_id;
              });
              
              if (matchingAppointment) {
                return {
                  ...item,
                  appointment_time: matchingAppointment.appointment_time,
                  appointment_time_end: matchingAppointment.appointment_time_end
                };
              }
              
              return item;
            });
            
            data = enrichedData;
          } catch (appointmentErr) {
            console.log('Could not fetch appointments for time info:', appointmentErr);
          }
        }
        
        setHistory(data);
      } catch (err) {
        console.error('Error fetching donor data:', err);
        if (err.response?.status === 404) {
          setError('Bạn chưa có lịch sử hiến máu');
        } else if (err.response?.status === 401) {
          setError('Vui lòng đăng nhập lại');
        } else {
          setError('Không thể tải lịch sử hiến máu. Vui lòng thử lại sau.');
        }
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonationHistory();
  }, [token]);

  if (loading) return <div className={styles.loading}>Đang tải lịch sử hiến máu...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.donationHistoryContainer}>
      <h2 className={styles.pageTitle}>Lịch sử hiến máu</h2>
      
      {!history || history.length === 0 ? (
        <div className={styles.noData}>Bạn chưa có lịch sử hiến máu.</div>
      ) : (
        <div className={styles.historyList}>
          {history.map((item, index) => {
            const statusInfo = getStatusInfo(item.donation_status || 'scheduled');
            // Ưu tiên ngày thực tế hiến máu nếu có, nếu không thì lấy ngày đăng ký lịch hẹn
            const ngayHien = item.collection_date || item.last_donation_date || '';
            const ngayHen = item.appointment_date || '';
            return (
              <div key={item.donation_record_id || index} className={styles.historyCard}>
                <div className={styles.cardLogo}>
                  <div className={styles.bloodDrop}>
                    🩸
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Ngày đăng ký lịch hẹn:</span>
                    <span className={styles.cardValue}>
                      {ngayHen ? new Date(ngayHen).toLocaleDateString('vi-VN') : '---'}
                    </span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Ngày thực tế hiến máu:</span>
                    <span className={styles.cardValue}>
                      {ngayHien ? new Date(ngayHien).toLocaleDateString('vi-VN') : '---'}
                    </span>
                  </div>
                  {item.appointment_time && (
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Thời gian:</span>
                      <span className={styles.cardValue}>
                        {item.appointment_time?.slice(0, 5)}
                        {item.appointment_time_end && ` - ${item.appointment_time_end.slice(0, 5)}`}
                      </span>
                    </div>
                  )}
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Nhóm máu:</span>
                    <span className={`${styles.cardValue} ${styles.bloodTypeValue}`}>
                      {getBloodTypeInfo(item.blood_group_id)}
                    </span>
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

export default DonationHistory;
