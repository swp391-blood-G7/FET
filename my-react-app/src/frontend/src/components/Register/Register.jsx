import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaHome, FaCalendar, FaVenusMars } from 'react-icons/fa';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    date_of_birth: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'username':
        if (!value) error = 'Tên đăng nhập không được để trống';
        else if (value.length < 4) error = 'Ít nhất 4 ký tự';
        break;
      case 'full_name':
        if (!value) error = 'Họ tên không được để trống';
        break;
      case 'email':
        if (!value) error = 'Email không được để trống';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email không hợp lệ';
        break;
      case 'phone':
        if (!value) error = 'Số điện thoại không được để trống';
        else if (!/^(84|0[3|5|7|8|9])+([0-9]{8})$/.test(value)) error = 'Số điện thoại không hợp lệ';
        break;
      case 'password':
        if (!value) error = 'Mật khẩu không được để trống';
        else if (value.length < 6) error = 'Ít nhất 6 ký tự';
        break;
      case 'gender':
        if (!value) error = 'Vui lòng chọn giới tính';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/register', formData);
        if (response.status === 201) {
          toast.success('Đăng ký thành công!');
          navigate('/login');
        } else {
          toast.error('Đăng ký thất bại!');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Đã xảy ra lỗi!');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.registerContainer}>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <h2 className={styles.title}>Đăng Ký Thành Viên</h2>

          <InputField icon={<FaUser />} name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur} error={errors.username} placeholder="Tên đăng nhập" touched={touched.username} />
          <InputField icon={<FaUser />} name="full_name" value={formData.full_name} onChange={handleChange} onBlur={handleBlur} error={errors.full_name} placeholder="Họ và tên" touched={touched.full_name} />
          <InputField icon={<FaEnvelope />} name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} placeholder="Email" touched={touched.email} />
          <InputField icon={<FaPhone />} name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} placeholder="Số điện thoại" touched={touched.phone} />
          <InputField icon={<FaLock />} name="password" type="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} placeholder="Mật khẩu" touched={touched.password} />

          {/* Gender Select */}
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaVenusMars className={styles.icon} />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${touched.gender && errors.gender ? styles.error : ''}`}
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
            {touched.gender && errors.gender && <span className={styles.errorMessage}>{errors.gender}</span>}
          </div>

          <InputField icon={<FaCalendar />} name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
          <InputField icon={<FaHome />} name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ" />

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.registerButton} disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
};

const InputField = ({ icon, name, value, onChange, onBlur, placeholder, type = 'text', error, touched }) => (
  <div className={styles.formGroup}>
    <div className={styles.inputWithIcon}>
      {icon}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${styles.input} ${touched && error ? styles.error : ''}`}
      />
    </div>
    {touched && error && <span className={styles.errorMessage}>{error}</span>}
  </div>
);

export default Register;
