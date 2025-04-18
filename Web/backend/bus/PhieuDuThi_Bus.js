const { sql, poolPromise } = require('../../db');
const PhieuDuThiDAO = require('../dao/PhieuDuThi_DAO');

class PhieuDuThi_Bus {
    /**
     * Lập phiếu dự thi mới
     * @param {string} maPhieuDangKy - Mã phiếu đăng ký
     * @param {number} maThiSinh - Mã thí sinh
     * @returns {Object} Thông tin phiếu dự thi vừa tạo
     */
    static async lapPhieuDuThi(maPhieuDangKy, maThiSinh) {
        try {
            const phieuDuThi = await PhieuDuThiDAO.taoPhieuDuThi(maPhieuDangKy, maThiSinh);
            return phieuDuThi;
        } catch (error) {
            console.error('Lỗi khi tạo phiếu dự thi:', error);
            throw error;
        }
    }

    /**
     * Cập nhật trạng thái phiếu dự thi
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @param {string} trangThai - Trạng thái mới (mặc định 'Đã gửi' nếu là phát hành)
     * @returns {Object} Kết quả cập nhật
     */
    static async capNhatTrangThai(maPhieuDuThi, trangThai = 'Đã gửi') {
        try {
            const kiemTraKetQua = await PhieuDuThiDAO.kiemTraTrangThai(maPhieuDuThi);
                
            if (kiemTraKetQua.found) {
                const currentStatus = kiemTraKetQua.status;
                
                if (currentStatus === 'Đã gửi') {
                    return { 
                        success: false, 
                        message: 'Phiếu dự thi này đã được phát hành rồi.' 
                    };
                }
                
                await PhieuDuThiDAO.capNhatTrangThai(maPhieuDuThi, trangThai);
                
                if (trangThai === 'Đã gửi') {
                    await this.guiThongBaoEmail(maPhieuDuThi);
                }
                
                return { 
                    success: true, 
                    message: 'Phát hành thành công!' 
                };
            } else {
                return { 
                    success: false, 
                    message: 'Không tìm thấy phiếu dự thi.' 
                };
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái phiếu dự thi:', error);
            throw error;
        }
    }

    /**
     * Gửi email thông báo
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @returns {Object} Kết quả gửi email
     */
    static async guiThongBaoEmail(maPhieuDuThi) {
        try {
            const phieuDuThi = await PhieuDuThiDAO.timPhieuDuThiTheoMa(maPhieuDuThi);
            // Xử lý logic gửi email
            await PhieuDuThiDAO.guiThongBaoEmail(maPhieuDuThi);
            
            return { success: true };
        } catch (error) {
            console.error('Lỗi khi gửi email thông báo:', error);
            throw error;
        }
    }
}

module.exports = PhieuDuThi_Bus;
