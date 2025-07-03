import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import viCustom from '../../locales/vi-custom';
import styles from './BloodSchedule.module.css';

function getIsLoggedIn() {
  return !!localStorage.getItem('token');
}

function LoginModal({ show, onClose }) {
  if (!show) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalTitle}>Bạn cần đăng nhập để đăng ký hiến máu</div>
        <div className={styles.modalActions}>
          <button className={styles.modalLoginBtn} onClick={() => window.location.href = '/login'}>Đăng nhập</button>
          <button className={styles.modalCancelBtn} onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  // Tạo Date object một cách an toàn từ dateString (YYYY-MM-DD format)
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayStr = String(d.getDate()).padStart(2, '0');
  const monthStr = String(d.getMonth() + 1).padStart(2, '0');
  const yearStr = d.getFullYear();
  return `${dayStr}-${monthStr}-${yearStr}`;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

// Hàm format appointment_id thành 4 chữ số, ví dụ 1 => 0001
function formatAppointmentId(id) {
  return id.toString().padStart(4, '0');
}


export default function BloodSchedule() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const defaultFrom = new Date();
  const defaultTo = new Date();
  defaultTo.setDate(defaultTo.getDate() + 15);

  // Parse date từ URL params một cách an toàn để tránh vấn đề timezone
  const parseUrlDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month - 1 vì JavaScript month bắt đầu từ 0
  };

  const [selectedFrom, setSelectedFrom] = useState(() => fromParam ? parseUrlDate(fromParam) : defaultFrom);
  const [selectedTo, setSelectedTo] = useState(() => toParam ? parseUrlDate(toParam) : defaultTo);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Hàm fetch và cập nhật URL
  const fetchAppointments = (from = selectedFrom, to = selectedTo, updateUrl = true) => {
    setLoading(true);
    setError('');
    // Đảm bảo from/to là Date object
    const toDateObj = (d) => {
      if (!d) return new Date();
      if (d instanceof Date) return d;
      if (typeof d === 'string') {
        const [year, month, day] = d.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(d);
    };
    const formatDateForApi = (date) => {
      const d = toDateObj(date);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const fromStr = formatDateForApi(from);
    const toStr = formatDateForApi(to);
    if (!fromStr || !toStr) {
      setError('Ngày tìm kiếm không hợp lệ.');
      setAppointments([]);
      setLoading(false);
      return;
    }
    // Chỉ cập nhật URL, không fetch API ở đây nếu updateUrl = true
    if (updateUrl) {
      navigate(`?from=${fromStr}&to=${toStr}`);
      setLoading(false); // Để tránh loading 2 lần
      return;
    }
    axios
      .get(`/api/appointments/date-range?from=${fromStr}&to=${toStr}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setAppointments(data);
        setLoading(false);
        // Không update URL ở đây nữa
      })
      .catch((err) => {
        let msg = 'Không thể tải dữ liệu lịch hiến máu.';
        if (err?.response?.data?.error && err.response.data.error.includes('Invalid date')) {
          msg = 'Ngày tìm kiếm không hợp lệ.';
        }
        setError(msg);
        setAppointments([]);
        setLoading(false);
      });
  };

  // Khi mount hoặc khi params đổi, luôn fetch dữ liệu nếu có from/to
  useEffect(() => {
    if (fromParam && toParam) {
      const fromDate = parseUrlDate(fromParam);
      const toDate = parseUrlDate(toParam);
      // Chỉ set lại state nếu khác giá trị hiện tại để tránh DatePicker bị NaN
      setSelectedFrom(prev => {
        if (!fromDate || isNaN(fromDate.getTime())) return prev;
        if (!prev || prev.getTime() !== fromDate.getTime()) return fromDate;
        return prev;
      });
      setSelectedTo(prev => {
        if (!toDate || isNaN(toDate.getTime())) return prev;
        if (!prev || prev.getTime() !== toDate.getTime()) return toDate;
        return prev;
      });
      fetchAppointments(fromDate, toDate, false); // fetch và không update URL nữa
    } else {
      setAppointments([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromParam, toParam]);

  const handleRegister = (appointment_id) => {
    if (!getIsLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/blood-register?id=${appointment_id}`);
  };

  return (
    <section className={styles.container}>
      <div className={styles.datePickerBox}>
        <small>🩸 Bạn cần đặt lịch vào thời gian nào? 📅</small>
        <div className={styles.datePickerContainer}>
          <div className={styles.datePickerWrapper}>
            <span className={styles.dateLabel}>Từ ngày</span>
            <DatePicker
              selected={selectedFrom}
              onChange={date => date && setSelectedFrom(date)}
              selectsStart
              startDate={selectedFrom}
              endDate={selectedTo}
              locale={viCustom}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <span className={styles.dateSeparator}>đến</span>
          <div className={styles.datePickerWrapper}>
            <span className={styles.dateLabel}>Đến ngày</span>
            <DatePicker
              selected={selectedTo}
              onChange={date => date && setSelectedTo(date)}
              selectsEnd
              startDate={selectedFrom}
              endDate={selectedTo}
              minDate={selectedFrom}
              locale={viCustom}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        <button
          onClick={() => fetchAppointments(selectedFrom, selectedTo, true)}
          className={styles.searchButton}
        >
          🔍 Tìm kiếm lịch hiến máu
        </button>
      </div>

      <h2 className={styles.heading}>
        📋 Lịch hiến máu từ {fromParam ? formatDate(fromParam) : formatDate(selectedFrom.toISOString())} đến {toParam ? formatDate(toParam) : formatDate(selectedTo.toISOString())}
      </h2>

      {loading ? (
        <p className={styles.loadingMessage}>⏳ Đang tải dữ liệu...</p>
      ) : error ? (
        <p className={styles.errorMessage}>❌ {error}</p>
      ) : Array.isArray(appointments) && appointments.length === 0 ? (
        <div className={styles.noAppointment}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
          <div>Không có lịch hiến máu trong khoảng thời gian này.</div>
          <div style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.7 }}>
            Hãy thử chọn khoảng thời gian khác
          </div>
        </div>
      ) : (
        <ul className={styles.appointmentList}>
          {appointments.map(({ appointment_id, appointment_date, donor_id, status, appointment_time, appointment_time_end }) => (
            <li key={appointment_id} className={styles.appointmentCard}>
              <div className={styles.appointmentHeader}>
                <div className={styles.appointmentInfo}>
                  <div className={styles.appointmentDate}>
                    📅 {new Date(appointment_date).toLocaleDateString('vi-VN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className={styles.appointmentId}>
                    ID: {formatAppointmentId(appointment_id)}
                  </div>
                  <div className={styles.appointmentTime}>
                    <span className={styles.timeIcon}>🕐</span>
                    {formatTime(appointment_time)} - {formatTime(appointment_time_end)}
                  </div>
                </div>
                <div className={styles.statusContainer}>
                  <span className={`${styles.statusBadge} ${status === 'scheduled' ? styles.statusScheduled : styles.statusAvailable}`}>
                    {status === 'scheduled' ? '📝 Đã lên lịch' : '🔓 Có thể đăng ký'}
                  </span>
                  <button 
                    onClick={() => handleRegister(appointment_id)} 
                    className={styles.registerButton}
                  >
                    ✨ Đăng ký ngay
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>
  );
}
