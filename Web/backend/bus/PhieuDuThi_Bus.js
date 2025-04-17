const { sql, poolPromise } = require('../../db');
const PhieuDuThiDAO = require('../dao/PhieuDuThiDAO');
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
            const pool = await poolPromise;
            
            const query = `
                SELECT 
                    ts.MATHISINH,
                    ts.TENTHISINH,
                    ts.NGAYSINH,
                    ts.SĐT AS SDT,
                    ts.DIACHI,
                    ts.EMAIL,
                    ts.MAPHIEUDANGKY
                FROM THISINH ts
                WHERE NOT EXISTS (
                    SELECT 1 FROM PHIEUDUTHI pdt 
                    WHERE ts.MATHISINH = pdt.MATHISINH
                )
                ORDER BY ts.MATHISINH
                OPTION (RECOMPILE)
            `;
            
            const request = pool.request();
            request.enableArithAbort = true;
            
            const { recordset } = await request.query(query);
            return recordset;
        } catch (error) {
            console.error('Error getting exam tickets:', error);
            throw error;
        }
    }

    static async timKiem(searchQuery) {
        try {
            const pool = await poolPromise;
            
            const query = `
                SELECT 
                    ts.MATHISINH,
                    ts.TENTHISINH,
                    ts.NGAYSINH,
                    ts.SĐT AS SDT,
                    ts.DIACHI,
                    ts.EMAIL,
                    ts.MAPHIEUDANGKY
                FROM THISINH ts
                WHERE NOT EXISTS (
                    SELECT 1 FROM PHIEUDUTHI pdt 
                    WHERE ts.MATHISINH = pdt.MATHISINH
                )
                AND (ts.TENTHISINH LIKE N'%' + @searchQuery + N'%'
                OR ts.MATHISINH LIKE N'%' + @searchQuery + N'%')
                ORDER BY ts.MATHISINH
            `;
            
            const { recordset } = await pool.request()
                .input('searchQuery', sql.NVarChar, searchQuery)
                .query(query);
            
            return recordset;
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
