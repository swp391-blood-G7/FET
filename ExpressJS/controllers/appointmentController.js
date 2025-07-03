const appointmentModel = require('../models/appointmentModel');
const padTime = (t) => t.toString().padStart(2, '0');
const normalizeTime = (timeStr) => {
  const parts = timeStr.split(':');
  const hh = padTime(parts[0]);
  const mm = padTime(parts[1] || '00');
  return `${hh}:${mm}:00`;
};
// Lịch hẹn - tạo appointment slot (chỉ tạo appointment record, không cần donor_id)
exports.schedule = async (req, res) => {
  const { appointment_date, appointment_time, appointment_time_end, status } = req.body;

  try {
    const timeStart = new Date(`1970-01-01T${normalizeTime(appointment_time)}Z`);
    const timeEnd = new Date(`1970-01-01T${normalizeTime(appointment_time_end)}Z`);

    const appointmentId = await appointmentModel.scheduleAppointment(appointment_date, timeStart, timeEnd, status || 'available');
    res.status(201).json({ 
      message: 'Appointment slot created', 
      appointment_id: appointmentId 
    });
  } catch (err) {
    console.error('Schedule error:', err);
    res.status(500).json({ error: err.message });
  }
};

// danh sách cuộc hẹn
exports.listAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getAllAppointments();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Sửa lịch hẹn
exports.editAppointment = async (req, res) => {
  const { appointment_id } = req.params;
  try {
    const data = req.body;

    // Ép thời gian thành đối tượng Date
    const timeStart = new Date(`1970-01-01T${normalizeTime(data.appointment_time)}Z`);
    const timeEnd = new Date(`1970-01-01T${normalizeTime(data.appointment_time_end)}Z`);

    await appointmentModel.updateAppointment(appointment_id, {
      appointment_date: data.appointment_date,
      appointment_time: timeStart,
      appointment_time_end: timeEnd,
      status: data.status
    });

    res.json({ message: 'Appointment updated' });
  } catch (err) {
    console.error('Edit error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái lịch hẹn
exports.updateStatus = async (req, res) => {
  const { appointment_id } = req.params;
  const { status } = req.body;
  try {
    await appointmentModel.updateStatus(appointment_id, status);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa lịch hẹn
exports.deleteAppointment = async (req, res) => {
  const { appointment_id } = req.params;
  try {
    await appointmentModel.deleteAppointment(appointment_id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm lịch hẹn
exports.searchAppointments = async (req, res) => {
  const { q } = req.query;
  try {
    const appointments = await appointmentModel.searchAppointments(q || '');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Lấy lịch hẹn của chính mình
exports.getMyAppointments = async (req, res) => {
  const userId = req.user.userId || req.user.user_id; // Hỗ trợ cả 2 format
  try {
    const appointments = await appointmentModel.getMyAppointments(userId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointmentsByDateRange = async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Thiếu tham số from hoặc to' });
  }

  try {
    const data = await appointmentModel.getAppointmentsByDateRange(from, to);

    // Thêm đoạn convert thời gian thành chuỗi HH:mm ở đây
    const mappedData = data.map(item => ({
      ...item,
      appointment_time: item.appointment_time.toISOString().substring(11, 16),
      appointment_time_end: item.appointment_time_end.toISOString().substring(11, 16),
    }));

    res.json(mappedData);
  } catch (err) {
    console.error('Lỗi khi lấy lịch theo ngày:', err);
    res.status(500).json({ error: err.message });
  }
};

// Đăng ký appointment (tạo appointment mới cho user với cùng thời gian)
exports.registerAppointment = async (req, res) => {
  const { appointment_id } = req.params;
  const { blood_group_id } = req.body;
  const userId = req.user.userId || req.user.user_id; // Hỗ trợ cả 2 format

  console.log('Register appointment - userId:', userId, 'appointment_id:', appointment_id);

  try {
    // Lấy thông tin appointment gốc để copy time slot
    const originalAppointment = await appointmentModel.getAppointmentById(appointment_id);
    if (!originalAppointment) {
      return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
    }

    console.log('Debug - Original appointment:', originalAppointment);
    console.log('Debug - Original appointment donor_id:', originalAppointment.donor_id);
    console.log('Debug - Original appointment status:', originalAppointment.status);

    // LOGIC MỚI với DB schema: appointment_id CỐ ĐỊNH, donors tham chiếu đến appointment
    // appointment_id GIỮ NGUYÊN, chỉ tạo donor record mới

    // Kiểm tra user đã đăng ký appointment này chưa
    const existingRegistration = await appointmentModel.checkUserRegisteredAppointment(userId, appointment_id);
    if (existingRegistration) {
      return res.status(400).json({ 
        error: `Bạn đã đăng ký appointment này rồi! (Donor ID: ${existingRegistration.donor_id})` 
      });
    }

    // TẠO DONOR RECORD MỚI với appointment_id là FK
    const registrationDate = new Date().toISOString().split('T')[0]; 
    
    await appointmentModel.createDonorForAppointment(userId, blood_group_id, appointment_id, registrationDate);
    const newDonorResult = await appointmentModel.getLatestDonorByUserId(userId);
    console.log('Debug - New donor created for appointment:', appointment_id, 'donor_id:', newDonorResult.donor_id);
    
    res.json({ 
      message: 'Đăng ký thành công!',
      details: `Đã đăng ký appointment ID: ${appointment_id} cho ngày ${new Date(originalAppointment.appointment_date).toLocaleDateString('vi-VN')} lúc ${originalAppointment.appointment_time}-${originalAppointment.appointment_time_end}. Donor ID: ${newDonorResult.donor_id}. Nhiều người có thể đăng ký cùng appointment này.`
    });
  } catch (err) {
    console.error('Register appointment error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy thông tin chi tiết một appointment
exports.getAppointmentById = async (req, res) => {
  const { appointment_id } = req.params;
  
  console.log('Getting appointment by ID:', appointment_id); // Debug log
  
  try {
    const appointment = await appointmentModel.getAppointmentById(appointment_id);
    
    console.log('Appointment found:', appointment); // Debug log
    
    if (!appointment) {
      console.log('No appointment found with ID:', appointment_id); // Debug log
      return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
    }

    // Convert thời gian thành chuỗi HH:mm
    const formattedAppointment = {
      ...appointment,
      appointment_time: appointment.appointment_time ? appointment.appointment_time.toISOString().substring(11, 16) : null,
      appointment_time_end: appointment.appointment_time_end ? appointment.appointment_time_end.toISOString().substring(11, 16) : null,
    };

    console.log('Formatted appointment:', formattedAppointment); // Debug log
    res.json(formattedAppointment);
  } catch (err) {
    console.error('Error getting appointment by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// Tạo appointment slot mở (staff/admin tạo để user đăng ký)
exports.createAppointmentSlot = async (req, res) => {
  const { appointment_date, appointment_time, appointment_time_end } = req.body;

  try {
    const timeStart = new Date(`1970-01-01T${normalizeTime(appointment_time)}Z`);
    const timeEnd = new Date(`1970-01-01T${normalizeTime(appointment_time_end)}Z`);

    await appointmentModel.createAppointmentSlot(appointment_date, timeStart, timeEnd, 'available');
    res.status(201).json({ message: 'Appointment slot created - Available for registration' });
  } catch (err) {
    console.error('Create slot error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả appointment slots (cả available và booked)
exports.getAllAppointmentSlots = async (req, res) => {
  try {
    const slots = await appointmentModel.getAllAppointmentSlots();
    
    // Convert thời gian thành chuỗi HH:mm
    const formattedSlots = slots.map(slot => ({
      ...slot,
      appointment_time: slot.appointment_time ? slot.appointment_time.toISOString().substring(11, 16) : null,
      appointment_time_end: slot.appointment_time_end ? slot.appointment_time_end.toISOString().substring(11, 16) : null,
    }));

    res.json(formattedSlots);
  } catch (err) {
    console.error('Get all slots error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy chỉ các appointment slots có sẵn (chưa đăng ký)
exports.getAvailableSlots = async (req, res) => {
  try {
    const availableSlots = await appointmentModel.getAvailableAppointmentSlots();
    
    // Convert thời gian thành chuỗi HH:mm
    const formattedSlots = availableSlots.map(slot => ({
      ...slot,
      appointment_time: slot.appointment_time ? slot.appointment_time.toISOString().substring(11, 16) : null,
      appointment_time_end: slot.appointment_time_end ? slot.appointment_time_end.toISOString().substring(11, 16) : null,
    }));

    res.json(formattedSlots);
  } catch (err) {
    console.error('Get available slots error:', err);
    res.status(500).json({ error: err.message });
  }
};

// DEBUG: Endpoint để kiểm tra trạng thái appointment
exports.debugAppointmentStatus = async (req, res) => {
  const { appointment_id } = req.params;
  
  try {
    const appointment = await appointmentModel.getAppointmentById(appointment_id);
    const availableAppointment = await appointmentModel.getAvailableAppointmentById(appointment_id);
    
    res.json({
      appointment_id,
      originalAppointment: appointment,
      availableCheck: availableAppointment,
      debug_info: {
        has_appointment: !!appointment,
        donor_id: appointment?.donor_id,
        status: appointment?.status,
        donation_status: appointment?.donation_status,
        is_available: availableAppointment?.is_available_for_registration
      }
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả donors đã đăng ký cho một appointment cụ thể  
exports.getDonorsByAppointment = async (req, res) => {
  const { appointment_id } = req.params;
  
  try {
    const donors = await appointmentModel.getDonorsByAppointmentId(appointment_id);
    const donorCount = await appointmentModel.countDonorsByAppointmentId(appointment_id);
    
    res.json({
      appointment_id: parseInt(appointment_id),
      donor_count: donorCount,
      donors: donors.map(donor => ({
        ...donor,
        appointment_time: donor.appointment_time ? donor.appointment_time.toISOString().substring(11, 16) : null,
        appointment_time_end: donor.appointment_time_end ? donor.appointment_time_end.toISOString().substring(11, 16) : null,
      }))
    });
  } catch (err) {
    console.error('Get donors by appointment error:', err);
    res.status(500).json({ error: err.message });
  }
};

