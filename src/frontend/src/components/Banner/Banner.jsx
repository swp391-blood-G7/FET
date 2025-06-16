import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import viCustom from '../../locales/vi-custom';
import styles from './Banner.module.css';

export default function Banner() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit fired', { from, to });

    if (!from || !to) {
      alert('Vui lòng chọn đầy đủ ngày từ - đến');
      return;
    }
    const fromStr = from.toISOString().slice(0, 10);
    const toStr = to.toISOString().slice(0, 10);

    console.log('Navigating to:', `/blood-schedule?from=${fromStr}&to=${toStr}`);
    navigate(`/blood-schedule?from=${fromStr}&to=${toStr}`);
  };

  return (
    <section className={styles.banner}>
      <form className={styles.dateSearchBox} onSubmit={handleSubmit}>
        <label className={styles.dateLabel}>
          <span role="img" aria-label="calendar" className={styles.dateIcon}>📅</span>
          Bạn cần đặt lịch vào thời gian nào?
        </label>
        <div className={styles.dateInputGroup}>
          <DatePicker
            selected={from}
            onChange={date => setFrom(date)}
            selectsStart
            startDate={from}
            endDate={to}
            placeholderText="Từ ngày"
            className={styles.dateInput}
            locale={viCustom}
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
          />
          <span className={styles.dateSeparator}>-</span>
          <DatePicker
            selected={to}
            onChange={date => setTo(date)}
            selectsEnd
            startDate={from}
            endDate={to}
            minDate={from}
            placeholderText="Đến ngày"
            className={styles.dateInput}
            locale={viCustom}
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
          />
          <button type="submit" className={styles.dateSearchBtn}>Tìm kiếm</button>
        </div>
      </form>
    </section>
  );
}
