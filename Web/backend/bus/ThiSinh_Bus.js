const { sql, poolPromise } = require('../dao/DB');
const ThiSinhDAO = require('../dao/ThiSinhDAO');

class ThiSinh_Bus {
    static async LayDanhSachThiSinh() {
        try {
            const danhSachThiSinh = await ThiSinhDAO.LayDanhSachThiSinh();
            return danhSachThiSinh;
        } catch (error) {
            console.error('Error getting candidate list:', error);
            throw error;
        }
    }

    static async LocThiSinh(maThiSinh) {
        try {
            const thiSinh = await ThiSinhDAO.TimThiSinh(maThiSinh);
            return thiSinh;
        } catch (error) {
            console.error('Error finding candidate:', error);
            throw error;
        }
    }

    static async LayDanhSachThiSinhChoPhieuDuThi() {
        try {
            const pool = await poolPromise;
            
            const result = await pool.request().query(`
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
            `);
            
            return result.recordset;
        } catch (error) {
            console.error('Error getting candidates for exam tickets:', error);
            throw error;
        }
    }
}

module.exports = ThiSinh_Bus;
