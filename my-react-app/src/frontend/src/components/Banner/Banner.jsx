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

    if (!from || !to) {
      alert('Vui lòng chọn đầy đủ ngày từ - đến');
      return;
    }

    // Tránh vấn đề timezone bằng cách format ngày theo local timezone
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const fromStr = formatDate(from);
    const toStr = formatDate(to);

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
            popperClassName={styles.customDatepickerPopper}  // <-- thêm đây
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
            popperClassName={styles.customDatepickerPopper}  // <-- thêm đây
          />
          <button type="submit" className={styles.dateSearchBtn}>Tìm kiếm</button>
        </div>
      </form>
    </section>
  );
}
