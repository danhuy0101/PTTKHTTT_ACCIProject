const ChungChi_DAO = require('../dao/ChungChi_DAO');

class ChungChi_Bus {
    static async LayDanhSachChungChi(maPhieu, maKH, hoTen) {
        return await ChungChi_DAO.LayDanhSachChungChi(maPhieu, maKH, hoTen);
    }

    static async LayHoTenKhachHang(maPhieu, maKH) {
        return await ChungChi_DAO.LayHoTenKhachHang(maPhieu, maKH);
    }
    static async CapNhatTrangThaiChungChi(danhSachMaChungChi) {
        return await ChungChi_DAO.CapNhatTrangThaiChungChi(danhSachMaChungChi);
      }
      
}

module.exports = ChungChi_Bus;