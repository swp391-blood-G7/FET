import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Họ tên không được để trống';
        } else if (value.length < 2) {
          error = 'Họ tên phải có ít nhất 2 ký tự';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = 'Email không được để trống';
        } else if (!emailRegex.test(value)) {
          error = 'Email không hợp lệ';
        }
        break;
      case 'phone':
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!value) {
          error = 'Số điện thoại không được để trống';
        } else if (!phoneRegex.test(value)) {
          error = 'Số điện thoại không hợp lệ';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Mật khẩu không được để trống';
        } else if (value.length < 6) {
          error = 'Mật khẩu phải có ít nhất 6 ký tự';
        } else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value)) {
          error = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Vui lòng xác nhận mật khẩu';
        } else if (value !== formData.password) {
          error = 'Mật khẩu xác nhận không khớp';
        }
        break;
      case 'bloodType':
        if (!value) {
          error = 'Vui lòng chọn nhóm máu';
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Địa chỉ không được để trống';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newErrors = {};
      Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      });

      setErrors(newErrors);
      
      if (Object.keys(newErrors).length === 0) {
        // TODO: Add your API call here
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Đăng ký thành công!');
        navigate('/login');
      } else {
        toast.error('Vui lòng kiểm tra lại thông tin!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả thông tin đã nhập?')) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        bloodType: '',
        address: ''
      });
      setErrors({});
      setTouched({});
    }
  };

  return (
    <>
      <div className={styles.registerContainer}>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <h2 className={styles.title}>Đăng Ký Người Hiến Máu</h2>
          
          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaUser className={styles.icon} />
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${touched.fullName && errors.fullName ? styles.error : ''}`}
              />
            </div>
            {touched.fullName && errors.fullName && 
              <span className={styles.errorMessage}>{errors.fullName}</span>
            }
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaEnvelope className={styles.icon} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${touched.email && errors.email ? styles.error : ''}`}
              />
            </div>
            {touched.email && errors.email && 
              <span className={styles.errorMessage}>{errors.email}</span>
            }
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaPhone className={styles.icon} />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${touched.phone && errors.phone ? styles.error : ''}`}
              />
            </div>
            {touched.phone && errors.phone && 
              <span className={styles.errorMessage}>{errors.phone}</span>
            }
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaLock className={styles.icon} />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${touched.password && errors.password ? styles.error : ''}`}
              />
            </div>
            {touched.password && errors.password && 
              <span className={styles.errorMessage}>{errors.password}</span>
            }
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaLock className={styles.icon} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${touched.confirmPassword && errors.confirmPassword ? styles.error : ''}`}
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword && 
              <span className={styles.errorMessage}>{errors.confirmPassword}</span>
            }
          </div>

          <div className={styles.formGroup}>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.select} ${touched.bloodType && errors.bloodType ? styles.error : ''}`}
            >
              <option value="">Chọn nhóm máu</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            {touched.bloodType && errors.bloodType && 
              <span className={styles.errorMessage}>{errors.bloodType}</span>
            }
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWithIcon}>
              <FaMapMarkerAlt className={styles.icon} />
              <textarea
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.textarea} ${touched.address && errors.address ? styles.error : ''}`}
              />
            </div>
            {touched.address && errors.address && 
              <span className={styles.errorMessage}>{errors.address}</span>
            }
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.registerButton} ${isLoading ? styles.loading : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
            <button
              type="button"
              className={styles.resetButton}
              onClick={resetForm}
              disabled={isLoading}
            >
              Làm mới
            </button>
          </div>
        </form>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Register;