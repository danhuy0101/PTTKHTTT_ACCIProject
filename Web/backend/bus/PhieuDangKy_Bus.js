const PhieuDangKyDAO = require('../dao/PhieuDangKy_DAO');

class PhieuDangKyBUS {
  static async layDanhSachPhieuDangKyChoGiaHan() {
    try {
      return await PhieuDangKyDAO.layDanhSachPhieuDangKyChoGiaHan();
    } catch (error) {
      console.error("BUS - Lỗi khi lấy danh sách phiếu đăng ký:", error);
      throw error;
    }
  }

  static async timKiemPhieuDangKyChoGiaHan(tuKhoa) {
    try {
      return await PhieuDangKyDAO.timKiemPhieuDangKyChoGiaHan(tuKhoa);
    } catch (error) {
      console.error("BUS - Lỗi khi tìm kiếm phiếu đăng ký:", error);
      throw error;
    }
  }
}

module.exports = PhieuDangKyBUS;
