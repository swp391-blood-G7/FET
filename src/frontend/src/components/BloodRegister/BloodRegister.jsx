import React, { useState } from 'react';
import styles from './BloodRegister.module.css'; // Import the CSS module

export default function BloodRegister({ appointmentId }) {
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đăng ký thành công với ID lịch: ' + appointmentId + '\n' + JSON.stringify(formData, null, 2));
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
      <form onSubmit={handleSubmit}>
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
        >
          Gửi đăng ký
        </button>
      </form>
    </div>
  );
}