import './Banner.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';

export default function Banner() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Tìm kiếm từ ${from ? from.toLocaleDateString('vi-VN') : ''} đến ${to ? to.toLocaleDateString('vi-VN') : ''}`);
  };

  return (
    <section className="banner">
      <form className="date-search-box" onSubmit={handleSubmit}>
        <label className="date-label">
          <span role="img" aria-label="calendar" className="date-icon">📅</span>
          Bạn cần đặt lịch vào thời gian nào?
        </label>
        <div className="date-input-group">
          <DatePicker
            selected={from}
            onChange={date => setFrom(date)}
            selectsStart
            startDate={from}
            endDate={to}
            placeholderText="Từ ngày"
            className="date-input"
            locale={vi}
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
            popperClassName="custom-datepicker-popper"
            calendarClassName="custom-datepicker-calendar"
            wrapperClassName="custom-datepicker-wrapper"
          />
          <span className="date-separator">-</span>
          <DatePicker
            selected={to}
            onChange={date => setTo(date)}
            selectsEnd
            startDate={from}
            endDate={to}
            minDate={from}
            placeholderText="Đến ngày"
            className="date-input"
            locale={vi}
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
            popperClassName="custom-datepicker-popper"
            calendarClassName="custom-datepicker-calendar"
            wrapperClassName="custom-datepicker-wrapper"
          />
          <button type="submit" className="date-search-btn">Tìm kiếm</button>
        </div>
      </form>
    </section>
  );
}
