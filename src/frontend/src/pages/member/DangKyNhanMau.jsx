import "./DangKyNhanMau.css"

function DangKyNhanMau() {
  const thongTinCaNhan = {
    soCMND: "079204007348",
    soCCCD: "-",
    hoChieu: "-",
    hoTen: "NGUYEN THANH THANG",
    ngaySinh: "02/05/2004",
    gioiTinh: "Nam",
    nhomMau: "-",
  }

  const thongTinLienHe = {
    diaChi: "74/8, Xã Bà Điểm, Huyện Hóc Môn, Tp Hồ Chí Minh",
    dienThoai: "0966823637",
    dienThoaiBan: "-",
    email: "nt9901116@gmail.com",
    ngheNghiep: "Học sinh",
  }

  return (
    <div className="container">
      <h1 className="title">Đăng Ký Nhận Máu</h1>

      <div className="content">
        {/* Thông tin cá nhân */}
        <div className="section">
          <h2 className="section-title">Thông tin cá nhân</h2>
          <div className="info-list">
            <div className="info-row">
              <span className="label">Số CMND:</span>
              <span className="value">{thongTinCaNhan.soCMND}</span>
            </div>
            <div className="info-row">
              <span className="label">Số CCCD:</span>
              <span className="value">{thongTinCaNhan.soCCCD === "-" ? "Chưa có" : thongTinCaNhan.soCCCD}</span>
            </div>
            <div className="info-row">
              <span className="label">Số hộ chiếu:</span>
              <span className="value">{thongTinCaNhan.hoChieu === "-" ? "Chưa có" : thongTinCaNhan.hoChieu}</span>
            </div>
            <div className="info-row">
              <span className="label">Họ và tên:</span>
              <span className="value">{thongTinCaNhan.hoTen}</span>
            </div>
            <div className="info-row">
              <span className="label">Ngày sinh:</span>
              <span className="value">{thongTinCaNhan.ngaySinh}</span>
            </div>
            <div className="info-row">
              <span className="label">Giới tính:</span>
              <span className="value">{thongTinCaNhan.gioiTinh}</span>
            </div>
            <div className="info-row important">
              <span className="label">Nhóm máu:</span>
              <span className="value">{thongTinCaNhan.nhomMau === "-" ? "Cần cập nhật" : thongTinCaNhan.nhomMau}</span>
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="section">
          <h2 className="section-title">Thông tin liên hệ</h2>
          <div className="info-list">
            <div className="info-row">
              <span className="label">Địa chỉ:</span>
              <span className="value">{thongTinLienHe.diaChi}</span>
            </div>
            <div className="info-row">
              <span className="label">Điện thoại:</span>
              <span className="value">{thongTinLienHe.dienThoai}</span>
            </div>
            <div className="info-row">
              <span className="label">Điện thoại bàn:</span>
              <span className="value">
                {thongTinLienHe.dienThoaiBan === "-" ? "Chưa có" : thongTinLienHe.dienThoaiBan}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{thongTinLienHe.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Nghề nghiệp:</span>
              <span className="value">{thongTinLienHe.ngheNghiep}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="buttons">
        <button className="btn-primary">Xác nhận đăng ký</button>
        <button className="btn-secondary">Chỉnh sửa</button>
        <button className="btn-cancel">Hủy</button>
      </div>
    </div>
  )
}

export default DangKyNhanMau
