const ChungChi_DAO = require('../dao/ChungChi_DAO');

class ChungChi_Bus {
    static async LayDanhSachChungChi(maPhieu, maKH, loaiKH) {
        return await ChungChi_DAO.LayDanhSachChungChi(maPhieu, maKH, loaiKH);
    }

    static async CapNhatTrangThaiChungChi(danhSachMaChungChi) {
        return await ChungChi_DAO.CapNhatTrangThaiChungChi(danhSachMaChungChi);
    }
}

module.exports = ChungChi_Bus;
