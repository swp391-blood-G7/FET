import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './BloodRegister.module.css'; // Import the CSS module

export default function BloodRegister() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = searchParams.get('id');
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    blood_group_id: '',
    hasDonatedBefore: null,
    diseaseDetails: '',
    hasDisease: null,
    hadSpecificDiseases: null,
    hadSpecificDiseasesDetails: '',
    recent12Months: null,
    recent12MonthsDetails: '',
    recent6Months: null,
    recent6MonthsDetails: '',
    recentSymptoms14Days: null,
    recentSymptoms14DaysDetails: '',
    recentMedication7Days: null,
    recentMedication7DaysDetails: '',
    femalePregnant: null,
    femaleMiscarriage: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState(null);

  // Map blood_group_id với nhóm máu thực tế
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

  useEffect(() => {
    if (!token) {
      alert('Vui lòng đăng nhập để đăng ký hiến máu');
      navigate('/login');
      return;
    }
    
    if (!appointmentId) {
      alert('Không tìm thấy ID lịch hẹn');
      navigate('/blood-schedule');
      return;
    }

    // Lấy thông tin appointment
    fetchAppointmentInfo();
  }, [appointmentId, token, navigate]);

  const fetchAppointmentInfo = async () => {
    try {
      const response = await axios.get(`/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointmentInfo(response.data);
    } catch (error) {
      console.error('Error fetching appointment info:', error);
      if (error.response?.status === 404) {
        alert('Không tìm thấy lịch hẹn này. Vui lòng kiểm tra lại ID.');
        navigate('/blood-schedule');
      } else if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        alert('Không thể lấy thông tin lịch hẹn. Vui lòng thử lại sau.');
      }
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === 'yes' ? true : false,
      ...(value === 'no' && {
        [`${name}Details`]: '',
      }),
    }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.blood_group_id) {
      alert('Vui lòng chọn nhóm máu');
      return;
    }

    setLoading(true);
    
    try {
      // Đăng ký appointment
      const response = await axios.put(`/api/appointments/${appointmentId}/register`, {
        blood_group_id: parseInt(formData.blood_group_id)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        const message = response.data.message || 'Đăng ký thành công!';
        const details = response.data.details || '';
        alert(`${message}\n${details}`);
        navigate('/'); // Chuyển về trang chủ
      }
    } catch (error) {
      console.error('Error registering appointment:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Hiển thị error message cụ thể từ server
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
      console.log('Detailed error:', error.response?.data);
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const renderYesNoQuestion = (number, label, name, detailPlaceholder) => (
    <div className={styles.questionGroup}> {/* Apply questionGroup style */}
      <div className={styles.questionText}><strong>{number}. {label}</strong></div> {/* Apply questionText style */}
      <label className={styles.radioLabel}> {/* Apply radioLabel style */}
        <input
          type="radio"
          name={name}
          value="yes"
          checked={formData[name] === true}
          onChange={handleRadioChange}
        /> Có
      </label>
      <label className={styles.radioLabel}> {/* Apply radioLabel style */}
        <input
          type="radio"
          name={name}
          value="no"
          checked={formData[name] === false}
          onChange={handleRadioChange}
        /> Không
      </label>
      {formData[name] && detailPlaceholder && (
        <textarea
          name={`${name}Details`}
          placeholder={detailPlaceholder}
          value={formData[`${name}Details`] || ''}
          onChange={handleTextChange}
          rows={3}
          className={styles.textArea} // Apply textArea style
        />
      )}
    </div>
  );

  return (
    <div className={styles.container}> {/* Apply container style */}
      <h2 className={styles.title}>Đăng ký lịch hiến máu (ID: {appointmentId})</h2> {/* Apply title style */}
      
      {appointmentInfo && (
        <div className={styles.appointmentInfo}>
          <h3>Thông tin lịch hẹn:</h3>
          <p><strong>Ngày:</strong> {new Date(appointmentInfo.appointment_date).toLocaleDateString('vi-VN')}</p>
          <p><strong>Thời gian:</strong> {appointmentInfo.appointment_time} - {appointmentInfo.appointment_time_end}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Chọn nhóm máu */}
        <div className={styles.questionGroup}>
          <div className={styles.questionText}><strong>Nhóm máu của bạn:</strong></div>
          <select
            name="blood_group_id"
            value={formData.blood_group_id}
            onChange={(e) => setFormData(prev => ({ ...prev, blood_group_id: e.target.value }))}
            className={styles.selectField}
            required
          >
            <option value="">-- Chọn nhóm máu --</option>
            {Object.entries(bloodTypes).map(([id, type]) => (
              <option key={id} value={id}>{type}</option>
            ))}
          </select>
        </div>
        {renderYesNoQuestion(
          1,
          'Anh/chị từng hiến máu chưa?',
          'hasDonatedBefore',
          null
        )}
        {renderYesNoQuestion(
          2,
          'Hiện tại, anh/chị có mắc bệnh lý nào không?',
          'hasDisease',
          'Vui lòng ghi rõ bệnh lý'
        )}
        {renderYesNoQuestion(
          3,
          'Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan B, C, HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen, được cấy ghép mô tạng?',
          'hadSpecificDiseases',
          'Vui lòng ghi rõ'
        )}
        {renderYesNoQuestion(
          4,
          'Trong 12 tháng gần đây, anh/chị có: khỏi bệnh sau sốt rét, giang mai, lao, viêm não - màng não, uốn ván, phẫu thuật ngoại khoa hoặc được truyền máu, các chế phẩm máu?',
          'recent12Months',
          'Vui lòng ghi rõ'
        )}
        {renderYesNoQuestion(
          5,
          'Trong 6 tháng gần đây, anh/chị có các dấu hiệu hoặc hành vi như: thương hàn, nhiễm trùng máu, bị rắn cắn, viêm tắc động mạch, viêm tụy, viêm tủy xương, sụt cân nhanh không rõ nguyên nhân, nổi hạch kéo dài, thủ thuật y tế xâm lấn, xăm/xỏ lỗ tai, sử dụng ma túy, tiếp xúc máu người khác, sống chung với người viêm gan B, quan hệ với người viêm gan B,C,HIV, giang mai, hoặc quan hệ tình dục với người cùng giới?',
          'recent6Months',
          'Vui lòng ghi rõ'
        )}
        {renderYesNoQuestion(
          6,
          'Trong 14 ngày gần đây, anh/chị có bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng?',
          'recentSymptoms14Days',
          'Vui lòng ghi rõ'
        )}
        {renderYesNoQuestion(
          7,
          'Trong 7 ngày gần đây, anh/chị có dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid?',
          'recentMedication7Days',
          'Vui lòng ghi rõ'
        )}

        {/* 8 - Dành cho nữ */}
        <fieldset className={styles.fieldset}> {/* Apply fieldset style */}
          <legend><strong>8. Câu hỏi dành cho phụ nữ</strong></legend>
          {renderYesNoQuestion(
            '8.1',
            'Hiện chị đang mang thai hoặc nuôi con dưới 12 tháng tuổi?',
            'femalePregnant',
            null
          )}
          {renderYesNoQuestion(
            '8.2',
            'Chấm dứt thai kỳ trong 12 tháng gần đây (sảy thai, phá thai, thai ngoài tử cung)?',
            'femaleMiscarriage',
            null
          )}
        </fieldset>

        <button
          type="submit"
          className={styles.submitButton} // Apply submitButton style
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Gửi đăng ký'}
        </button>
      </form>
    </div>
  );
}