const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// ===== APPOINTMENT SLOT MANAGEMENT (OPEN SCHEDULING) =====
// Tạo appointment slot mở (staff/admin)
router.post('/create-slot', appointmentController.createAppointmentSlot);

// Lấy tất cả slots (cả available và booked) - cho BloodSchedule page
router.get('/slots/all', appointmentController.getAllAppointmentSlots);

// Lấy chỉ available slots - cho user đăng ký
router.get('/slots/available', appointmentController.getAvailableSlots);

// ===== LEGACY APPOINTMENT MANAGEMENT =====
router.post('/schedule', appointmentController.schedule);
router.get('/list', appointmentController.listAppointments);

// Tìm kiếm lịch hẹn
router.get('/search/all', appointmentController.searchAppointments);
//Lấy lịch hẹn của chính mình
router.get('/my', protect, appointmentController.getMyAppointments);

// Sửa lịch hẹn
router.put('/:appointment_id', appointmentController.editAppointment);

// Cập nhật trạng thái lịch hẹn
router.patch('/:appointment_id/status', appointmentController.updateStatus);

// Xóa lịch hẹn
router.delete('/:appointment_id', appointmentController.deleteAppointment);

//tìm lịch hẹn theo ngày - PHẢI ĐẶT TRƯỚC /:appointment_id
router.get('/date-range', appointmentController.getAppointmentsByDateRange);

// Đăng ký appointment (USER REGISTER FOR AVAILABLE SLOTS)
router.put('/:appointment_id/register', protect, appointmentController.registerAppointment);

// Lấy thông tin chi tiết một appointment
router.get('/:appointment_id', appointmentController.getAppointmentById);

// Lấy danh sách tất cả donors đã đăng ký cho một appointment
router.get('/:appointment_id/donors', appointmentController.getDonorsByAppointment);

// DEBUG: Kiểm tra trạng thái appointment
router.get('/:appointment_id/debug', appointmentController.debugAppointmentStatus);

module.exports = router;
