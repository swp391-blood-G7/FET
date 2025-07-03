import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DangKyNhanMau.module.css';

// Cấu hình axios base URL
const API_BASE_URL = 'http://localhost:3001';
axios.defaults.baseURL = API_BASE_URL;

function DangKyNhanMau() {
  const [user, setUser] = useState(null);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [bloodGroupId, setBloodGroupId] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingRecipients, setExistingRecipients] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const token = localStorage.getItem('token');

  // Test API connectivity
  const testConnection = async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      setConnectionStatus('connected');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        setConnectionStatus('server-down');
        setError('Không thể kết nối đến server. Vui lòng đảm bảo server đang chạy trên http://localhost:3001');
      } else if (error.response?.status === 401) {
        setConnectionStatus('auth-error');
        setError('Token không hợp lệ. Vui lòng đăng nhập lại.');
      } else if (error.response?.status >= 500) {
        setConnectionStatus('server-error');
        setError('Server đang gặp sự cố. Vui lòng thử lại sau.');
      } else {
        setConnectionStatus('error');
        setError('Lỗi kết nối: ' + (error.response?.data?.message || error.message));
      }
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Vui lòng đăng nhập để tiếp tục');
        setLoading(false);
        return;
      }

      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching data with token:', token);
        
        // Lấy thông tin user và lịch sử đăng ký hiện tại song song
        const [userRes, bloodGroupsRes, recipientsRes] = await Promise.allSettled([
          axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/inventory/blood-groups', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/recipients/my/info', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        console.log('API responses:', { userRes, bloodGroupsRes, recipientsRes });

        // Xử lý thông tin user
        if (userRes.status === 'fulfilled') {
          console.log('User data:', userRes.value.data);
          setUser(userRes.value.data);
        } else {
          console.error('User fetch error:', userRes.reason);
          throw new Error('Không thể tải thông tin người dùng');
        }

        // Xử lý danh sách nhóm máu
        if (bloodGroupsRes.status === 'fulfilled') {
          console.log('Blood groups data:', bloodGroupsRes.value.data);
          setBloodGroups(bloodGroupsRes.value.data || []);
        } else {
          console.error('Blood groups fetch error:', bloodGroupsRes.reason);
          // Không throw error - cho phép tiếp tục mà không có blood groups
          // Chỉ hiển thị warning trong console, không cần thông báo cho user
          setBloodGroups([]);
        }

        // Xử lý thông tin recipient hiện tại (có thể có nhiều đăng ký)
        if (recipientsRes.status === 'fulfilled') {
          console.log('Recipients data:', recipientsRes.value.data);
          // API trả về array các đăng ký
          const recipientData = recipientsRes.value.data;
          if (recipientData && recipientData.length > 0) {
            setExistingRecipients(recipientData);
          }
        } else {
          // Xử lý tất cả các lỗi từ recipients API
          const error = recipientsRes.reason;
          if (error?.response?.status === 404) {
            // 404 là bình thường - user chưa có đăng ký nào
            console.log('User chưa có đăng ký nhận máu nào - đây là trường hợp bình thường');
            setExistingRecipients([]);
          } else {
            // Các lỗi khác
            console.error('Recipients fetch error:', error);
            console.error('Error details:', {
              status: error?.response?.status,
              message: error?.response?.data?.error || error?.response?.data?.message,
              url: error?.config?.url
            });
          }
        }

      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
        // Reset error nếu đã load thành công user data và không có lỗi nghiêm trọng
        setTimeout(() => {
          if (user && !error.includes('Token không hợp lệ') && !error.includes('server')) {
            setError('');
          }
        }, 100);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validation
    if (!medicalCondition.trim()) {
      setError('Vui lòng điền thông tin tiền sử bệnh');
      setSubmitting(false);
      return;
    }

    try {
      console.log('Submitting registration:', {
        blood_group_id: bloodGroupId || null,
        medical_condition: medicalCondition.trim()
      });
      console.log('Token:', token);
      console.log('User ID from user object:', user.user_id);
      console.log('Selected blood group:', bloodGroupId ? bloodGroups.find(bg => bg.blood_group_id == bloodGroupId) : 'None');

      const response = await axios.post('/api/recipients/register', {
        blood_group_id: bloodGroupId || null,
        medical_condition: medicalCondition.trim()
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration response:', response.data);

      setSubmitted(true);
      // Thêm recipient mới vào danh sách
      const newRecipient = response.data.recipient;
      if (newRecipient) {
        setExistingRecipients(prev => [newRecipient, ...prev]);
      }
      
      // Reset form để có thể đăng ký tiếp
      setTimeout(() => {
        setBloodGroupId('');
        setMedicalCondition('');
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Lỗi khi đăng ký:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = '';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        const dbError = err.response.data.error;
        if (dbError.includes('CHECK constraint')) {
          errorMessage = 'Lỗi cơ sở dữ liệu: Giá trị trạng thái không hợp lệ. Vui lòng thử lại sau.';
        } else if (dbError.includes('FOREIGN KEY')) {
          errorMessage = 'Lỗi: Nhóm máu được chọn không hợp lệ.';
        } else {
          errorMessage = `Lỗi database: ${dbError}`;
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.status === 500) {
        errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau hoặc liên hệ admin.';
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        errorMessage = `Lỗi không xác định (${err.response?.status || 'No status'}): ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Đang tải thông tin...</p>
          {connectionStatus === 'checking' && <p>Đang kiểm tra kết nối server...</p>}
          {connectionStatus === 'server-down' && <p style={{color: 'red'}}>⚠️ Server không phản hồi</p>}
          {connectionStatus === 'connected' && <p style={{color: 'green'}}>✅ Kết nối server thành công</p>}
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!token || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Vui lòng đăng nhập để tiếp tục</p>
        </div>
      </div>
    );
  }

  // Không cần check already registered nữa - cho phép đăng ký nhiều lần

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đăng ký nhận máu</h2>

      {/* Hiển thị lịch sử đăng ký nếu có */}
      {existingRecipients.length > 0 ? (
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h3>Lịch sử đăng ký nhận máu ({existingRecipients.length})</h3>
            <button 
              type="button"
              className={styles.toggleButton}
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Ẩn' : 'Xem'} lịch sử
            </button>
          </div>
          
          {showHistory && (
            <div className={styles.historyList}>
              {existingRecipients.map((recipient, index) => (
                <div key={recipient.recipient_id || index} className={styles.historyItem}>
                  <div className={styles.historyInfo}>
                    <p><span>Nhóm máu:</span> {recipient.blood_type ? `${recipient.blood_type}${recipient.rh_factor}` : 'Chưa chỉ định'}</p>
                    <p><span>Tiền sử bệnh:</span> {recipient.medical_condition}</p>
                    <p><span>Trạng thái:</span> 
                      <span className={`${styles.status} ${styles[recipient.receive_status]}`}>
                        {recipient.receive_status === 'pending' ? 'Đang chờ xử lý' : 
                         recipient.receive_status === 'approved' ? 'Đã duyệt' :
                         recipient.receive_status === 'completed' ? 'Đã hoàn thành' :
                         recipient.receive_status}
                      </span>
                    </p>
                    <p><span>Ngày đăng ký:</span> {new Date(recipient.registration_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.noHistorySection} style={{
          background: '#f0f8ff',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #2196f3',
          fontSize: '0.95em',
          color: '#666'
        }}>
          <p>📝 Bạn chưa có lịch sử đăng ký nhận máu nào. Hãy điền form bên dưới để tạo đăng ký đầu tiên của bạn.</p>
        </div>
      )}

      <div className={styles.userInfo}>
        <h4>Thông tin người đăng ký:</h4>
        <p><span>Họ tên:</span> {user.full_name}</p>
        <p><span>Email:</span> {user.email}</p>
        <p><span>SĐT:</span> {user.phone}</p>
        {user.gender && <p><span>Giới tính:</span> {user.gender}</p>}
        {user.date_of_birth && <p><span>Ngày sinh:</span> {new Date(user.date_of_birth).toLocaleDateString()}</p>}
        {user.address && <p><span>Địa chỉ:</span> {user.address}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nhóm máu cần nhận:</label>
          <select
            value={bloodGroupId}
            onChange={e => setBloodGroupId(e.target.value)}
            disabled={submitting}
          >
            <option value="">-- Chọn nhóm máu (tùy chọn) --</option>
            {bloodGroups.length > 0 ? (
              bloodGroups.map(bg => (
                <option key={bg.blood_group_id} value={bg.blood_group_id}>
                  {bg.blood_type}{bg.rh_factor}
                </option>
              ))
            ) : (
              <option disabled>Không thể tải danh sách nhóm máu</option>
            )}
          </select>
          {bloodGroups.length === 0 && (
            <small style={{color: '#666', fontSize: '0.9em', marginTop: '5px', display: 'block'}}>
              Bạn có thể bỏ trống trường này và điền vào phần mô tả bệnh lý
            </small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tiền sử bệnh / tình trạng sức khỏe: *</label>
          <textarea
            className={styles.textarea}
            value={medicalCondition}
            onChange={e => setMedicalCondition(e.target.value)}
            required
            disabled={submitting}
            placeholder="Mô tả tình trạng sức khỏe, tiền sử bệnh, lý do cần nhận máu..."
          />
          {/* Loại bỏ character count - không cần thiết */}
        </div>

        <button 
          className={styles.button} 
          type="submit" 
          disabled={submitting || !medicalCondition.trim()}
        >
          {submitting ? 'Đang gửi...' : 'Gửi Đăng Ký'}
        </button>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            {(connectionStatus === 'server-down' || connectionStatus === 'error' || error.includes('server') || error.includes('database')) && (
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => window.location.reload()} 
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Tải lại trang
                </button>
                <button 
                  onClick={() => setError('')} 
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
        )}
        {submitted && (
          <div className={styles.success}>
            <p>Đăng ký nhận máu thành công!</p>
            <p>Thông tin của bạn đang được xem xét. Chúng tôi sẽ liên hệ khi có kết quả.</p>
            <button 
              className={styles.historyButton}
              onClick={() => window.location.href = '/member/history'}
              type="button"
            >
              Xem lịch sử nhận máu
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default DangKyNhanMau;
