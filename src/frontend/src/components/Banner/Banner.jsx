import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Giữ nguyên cho các style cơ bản của React-datepicker
import viCustom from '../../locales/vi-custom'; // Import locale tùy chỉnh của bạn
import styles from './Banner.module.css'; // Import CSS Modules

export default function Banner() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sử dụng 'vi-VN' cho định dạng hiển thị trong alert, không ảnh hưởng đến DatePicker locale
    alert(`Tìm kiếm từ ${from ? from.toLocaleDateString('vi-VN') : ''} đến ${to ? to.toLocaleDateString('vi-VN') : ''}`);
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
            locale={viCustom} // Sử dụng locale tùy chỉnh đã import
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
            popperClassName={styles.customDatepickerPopper}
            calendarClassName={styles.customDatepickerCalendar}
            wrapperClassName={styles.customDatepickerWrapper}
          />
          <span className={styles.dateSeparator}>-</span> {/* Đã sửa dấu nháy đơn thừa từ '-'' thành '-' */}
          <DatePicker
            selected={to}
            onChange={date => setTo(date)}
            selectsEnd
            startDate={from}
            endDate={to}
            minDate={from}
            placeholderText="Đến ngày"
            className={styles.dateInput}
            locale={viCustom} // Sử dụng locale tùy chỉnh đã import
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
            popperClassName={styles.customDatepickerPopper}
            calendarClassName={styles.customDatepickerCalendar}
            wrapperClassName={styles.customDatepickerWrapper}
          />
          <button type="submit" className={styles.dateSearchBtn}>Tìm kiếm</button>
        </div>
      </form>
    </section>
  );
}