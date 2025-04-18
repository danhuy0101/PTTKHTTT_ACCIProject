const { sql, poolPromise } = require('../../db');
const PhieuDuThiDAO = require('../dao/PhieuDuThi_DAO');
const ThiSinh_Bus = require('./ThiSinh_Bus');

class PhieuDuThi_Bus {
    static async LapPhieuDuThi(maPhieuDangKy, maThiSinh) {
        try {
            const phieuDuThi = await PhieuDuThiDAO.LuuPhieuDuThi(maPhieuDangKy, maThiSinh);
            return phieuDuThi;
        } catch (error) {
            console.error('Error creating exam ticket:', error);
            throw error;
        }
    }

    static async CapNhatTrangThai(maPhieuDuThi, trangThai) {
        try {
            const pool = await poolPromise;
            const checkQuery = `
                SELECT TRANGTHAI FROM PHIEUDUTHI 
                WHERE MAPHIEUDUTHI = @maPhieuDuThi
            `;
            
            const result = await pool.request()
                .input('maPhieuDuThi', sql.NVarChar, maPhieuDuThi)
                .query(checkQuery);
                
            if (result.recordset.length > 0) {
                const currentStatus = result.recordset[0].TRANGTHAI;
                
                if (currentStatus === 'Đã gửi') {
                    return { 
                        success: false, 
                        message: 'Phiếu dự thi này đã được phát hành rồi.' 
                    };
                }
                
                await PhieuDuThiDAO.CapNhatTrangThai(maPhieuDuThi, trangThai);
                
                if (trangThai === 'Đã gửi') {
                    await this.GuiMail(maPhieuDuThi);
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
            console.error('Error updating exam ticket status:', error);
            throw error;
        }
    }

    static async GuiMail(maPhieuDuThi) {
        try {
            const phieuDuThi = await PhieuDuThiDAO.TimPhieuDuThi(maPhieuDuThi);
            
            console.log(`Sending email notification for exam ticket ${maPhieuDuThi}`);
            
            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    static async layDanhSachPhieuDuThi() {
        try {
            const danhSachThiSinh = await ThiSinh_Bus.LayDanhSachThiSinhChuaCoPhieuDuThi();
            return danhSachThiSinh;
        } catch (error) {
            console.error('Error getting exam tickets:', error);
            throw error;
        }
    }

    static async timKiem(searchQuery) {
        try {
            const ketQuaTimKiem = await ThiSinh_Bus.TimKiemThiSinhChuaCoPhieuDuThi(searchQuery);
            return ketQuaTimKiem;
        } catch (error) {
            console.error('Error searching candidates:', error);
            throw error;
        }
    }

    static async capNhatTrangThaiPhieuDuThi(maPhieuDuThi) {
        try {
            return await this.CapNhatTrangThai(maPhieuDuThi, 'Đã gửi');
        } catch (error) {
            console.error('Error updating exam ticket status:', error);
            throw error;
        }
    }
}

module.exports = PhieuDuThi_Bus;
