const ThiSinhDAO = require('../dao/ThiSinh_DAO');

class ThiSinh_Bus {

    /**
     * Lấy danh sách thí sinh chưa có phiếu dự thi
     * @returns {Array} Danh sách thí sinh chưa có phiếu dự thi
     */
    static async layDanhSachThiSinhChuaCoPhieuDuThi() {
        try {
            return await ThiSinhDAO.layDanhSachThiSinhChuaCoPhieuDuThi();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thí sinh chưa có phiếu dự thi:', error);
            throw error;
        }
    }

    /**
     * Tìm kiếm thí sinh chưa có phiếu dự thi theo tên hoặc mã
     * @param {string} tuKhoa - Từ khóa tìm kiếm
     * @returns {Array} Danh sách thí sinh phù hợp
     */
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
