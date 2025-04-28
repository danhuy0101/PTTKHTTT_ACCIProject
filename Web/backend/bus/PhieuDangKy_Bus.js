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

  static async LayMaPhieuDangKyLonNhat() {
    return await PhieuDangKyDAO.LayMaPhieuDangKyLonNhat();
  }

  static TaoMaPhieuDangKyLonNhat(currentCode) {
    const num = parseInt(currentCode.slice(3)) + 1;
    return 'PDK' + num.toString().padStart(7, '0');
  }
  
  async ThemPhieuDangKy(data) {
    const PhieuDangKy_DAO = new PhieuDangKyDAO();
    return await PhieuDangKy_DAO.ThemPhieuDangKy(data);
  }

  static async capNhatTrangThaiGiaHan(maPhieuDangKy) {
    try {
      return await PhieuDangKyDAO.capNhatTrangThaiGiaHan(maPhieuDangKy);
    } catch (error) {
      console.error("BUS - Lỗi khi thay đổi trạng thái gia hạn phiếu đăng ký:", error);
      throw error;
    }
  }
}

module.exports = PhieuDangKyBUS;
