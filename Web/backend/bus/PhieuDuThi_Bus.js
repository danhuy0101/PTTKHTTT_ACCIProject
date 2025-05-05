const { sql, poolPromise } = require('../../db');
const PhieuDuThiDAO = require('../dao/PhieuDuThi_DAO');

class PhieuDuThi_Bus {

    static async lapPhieuDuThi(maPhieuDangKy, maThiSinh) {
        try {
            const phieuDuThi = await PhieuDuThiDAO.taoPhieuDuThi(maPhieuDangKy, maThiSinh);
            return phieuDuThi;
        } catch (error) {
            console.error('Lỗi khi tạo phiếu dự thi:', error);
            throw error;
        }
    }

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
                
                if (currentStatus === 'Chưa gửi') {
                    await this.guiThongBaoEmail(maPhieuDuThi);

                    await PhieuDuThiDAO.capNhatTrangThai(maPhieuDuThi, trangThai);
                
                    return { 
                        success: true, 
                        message: 'Phát hành thành công!' 
                    };
                }

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

}

module.exports = PhieuDuThi_Bus;
