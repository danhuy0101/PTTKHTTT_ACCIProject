const ThiSinhDAO = require('../dao/ThiSinh_DAO');

class ThiSinh_Bus {

    static async layDanhSachThiSinhChuaCoPhieuDuThi() {
        try {
            return await ThiSinhDAO.layDanhSachThiSinhChuaCoPhieuDuThi();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thí sinh chưa có phiếu dự thi:', error);
            throw error;
        }
    }

    static async timKiemThiSinhChuaCoPhieuDuThi(tuKhoa) {
        try {
            return await ThiSinhDAO.timKiemThiSinhChuaCoPhieuDuThi(tuKhoa);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm thí sinh chưa có phiếu dự thi:', error);
            throw error;
        }
    }

    static async LayMaThiSinhLonNhat() {
        return await ThiSinhDAO.LayMaThiSinhLonNhat();
    }
    
    async ThemThiSinh(data) {
        const thiSinhDAO = new ThiSinhDAO(); // Create an instance
        return await thiSinhDAO.ThemThiSinh(data);
    }
}

module.exports = ThiSinh_Bus;
