import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import viCustom from '../../locales/vi-custom';
import styles from './BloodSchedule.module.css';

function formatDate(dateString) {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

export default function BloodSchedule() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const defaultFrom = new Date();
  const defaultTo = new Date();
  defaultTo.setDate(defaultTo.getDate() + 15);

  const [selectedFrom, setSelectedFrom] = useState(fromParam ? new Date(fromParam) : defaultFrom);
  const [selectedTo, setSelectedTo] = useState(toParam ? new Date(toParam) : defaultTo);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAppointments = () => {
    setLoading(true);
    setError('');
    const fromStr = selectedFrom.toISOString().slice(0, 10);
    const toStr = selectedTo.toISOString().slice(0, 10);

    axios
      .get(`/api/appointments?from=${fromStr}&to=${toStr}`)
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
        navigate(`?from=${fromStr}&to=${toStr}`, { replace: true });
      })
      .catch(() => {
        setError('Không thể tải dữ liệu lịch hiến máu.');
        setAppointments([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (fromParam && toParam) {
      setSelectedFrom(new Date(fromParam));
      setSelectedTo(new Date(toParam));
      fetchAppointments();
    } else {
      setAppointments([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromParam, toParam]);

  // ✅ Điều hướng sang trang đăng ký
  const handleRegister = (appointment_id) => {
  navigate(`/blood-register?id=${appointment_id}`);

  };


  return (
    <section className={styles.container}>
      <div className={styles.datePickerBox}>
        <small>Bạn cần đặt lịch vào thời gian nào?</small>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <DatePicker
            selected={selectedFrom}
            onChange={date => date && setSelectedFrom(date)}
            selectsStart
            startDate={selectedFrom}
            endDate={selectedTo}
            locale={viCustom}
            dateFormat="dd/MM/yyyy"
          />
          <span style={{ alignSelf: 'center', fontWeight: 'bold', color: '#004080' }}>đến</span>
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
        <button
          onClick={fetchAppointments}
          style={{
            backgroundColor: '#004080',
            color: '#fff',
            border: 'none',
            padding: '8px 20px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          Tìm kiếm
        </button>
      </div>

      <h2 className={styles.heading}>
        Lịch hiến máu từ {fromParam ? formatDate(fromParam) : formatDate(selectedFrom.toISOString())} đến {toParam ? formatDate(toParam) : formatDate(selectedTo.toISOString())}
      </h2>

      {loading ? (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Đang tải dữ liệu...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : appointments.length === 0 ? (
        <p className={styles.noAppointment}>Không có lịch hiến máu trong khoảng thời gian này.</p>
      ) : (
        <ul className={styles.appointmentList}>
          {appointments.map(({ appointment_id, appointment_date, donor_id, status, appointment_time, appointment_time_end }) => (
            <li key={appointment_id}>
              <span>
                {new Date(appointment_date).toLocaleDateString('vi-VN')} — Donor: {donor_id} — Trạng thái: {status} — Thời gian: {formatTime(appointment_time)} - {formatTime(appointment_time_end)}
              </span>
              <button onClick={() => handleRegister(appointment_id)} style={{ marginLeft: 10 }}>
                Đăng ký
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
