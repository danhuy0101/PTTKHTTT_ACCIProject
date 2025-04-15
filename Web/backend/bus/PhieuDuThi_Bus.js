const { sql, poolPromise } = require('../dao/DB');
const PhieuDuThiDAO = require('../dao/PhieuDuThiDAO');
const ThiSinh_Bus = require('./ThiSinh_Bus');

class PhieuDuThi_Bus {
    static async LapPhieuDuThi(maPhieuDangKy) {
        try {
            const phieuDuThi = await PhieuDuThiDAO.LuuPhieuDuThi(maPhieuDangKy);
            return phieuDuThi;
        } catch (error) {
            console.error('Error creating exam ticket:', error);
            throw error;
        }
    }

    static async CapNhatTrangThai(maPhieuDuThi, trangThai) {
        try {
            await PhieuDuThiDAO.CapNhatTrangThai(maPhieuDuThi, trangThai);
            
            if (trangThai === 'Đã gửi') {
                await this.GuiMail(maPhieuDuThi);
            }
            
            return { success: true };
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
            // Get the connection pool
            const pool = await poolPromise;
            
            const query = `
                SELECT 
                    ts.MATHISINH,
                    ts.TENTHISINH,
                    ts.NGAYSINH,
                    ts.SĐT AS SDT,
                    ts.DIACHI,
                    ts.EMAIL,
                    ts.MAPHIEUDANGKY,
                    pdt.MAPHIEUDUTHI,
                    pdt.SBD,
                    pdt.TRANGTHAI,
                    pdt.NGAYPHATHANH
                FROM THISINH ts
                JOIN PHIEUDUTHI pdt ON ts.MATHISINH = pdt.MATHISINH
                ORDER BY ts.MATHISINH
            `;
            
            const { recordset } = await pool.request().query(query);
            return recordset;
        } catch (error) {
            console.error('Error getting exam tickets:', error);
            throw error;
        }
    }

    static async timKiemTheoTen(tenThiSinh) {
        try {
            // Get the connection pool
            const pool = await poolPromise;
            
            const query = `
                SELECT 
                    ts.MATHISINH,
                    ts.TENTHISINH,
                    ts.NGAYSINH,
                    ts.SĐT AS SDT,
                    ts.DIACHI,
                    ts.EMAIL,
                    ts.MAPHIEUDANGKY,
                    pdt.MAPHIEUDUTHI,
                    pdt.SBD,
                    pdt.TRANGTHAI,
                    pdt.NGAYPHATHANH
                FROM THISINH ts
                JOIN PHIEUDUTHI pdt ON ts.MATHISINH = pdt.MATHISINH
                WHERE ts.TENTHISINH LIKE N'%' + @tenThiSinh + N'%'
                ORDER BY ts.MATHISINH
            `;
            
            const { recordset } = await pool.request()
                .input('tenThiSinh', sql.NVarChar, tenThiSinh)
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
