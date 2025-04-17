const { sql, poolPromise } = require('../../db');
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

    static async LayDanhSachThiSinhChuaCoPhieuDuThi() {
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
            console.error('Error getting candidates without exam tickets:', error);
            throw error;
        }
    }

    static async TimKiemThiSinhChuaCoPhieuDuThi(searchQuery) {
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
            console.error('Error searching candidates without exam tickets:', error);
            throw error;
        }
    }
}

module.exports = ThiSinh_Bus;
