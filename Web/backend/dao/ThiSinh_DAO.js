const { sql, poolPromise } = require('../../db');

class ThiSinhDAO {

    /**
     * Lấy danh sách thí sinh chưa có phiếu dự thi
     * @returns {Array} Danh sách thí sinh chưa có phiếu
     */
    static async layDanhSachThiSinhChuaCoPhieuDuThi() {
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
            console.error('Lỗi cơ sở dữ liệu khi lấy danh sách thí sinh chưa có phiếu dự thi:', error);
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
                AND (ts.TENTHISINH LIKE N'%' + @tuKhoa + N'%'
                OR ts.MATHISINH LIKE N'%' + @tuKhoa + N'%')
                ORDER BY ts.MATHISINH
            `;
            
            const { recordset } = await pool.request()
                .input('tuKhoa', sql.NVarChar, tuKhoa)
                .query(query);
            
            return recordset;
        } catch (error) {
            console.error('Lỗi cơ sở dữ liệu khi tìm kiếm thí sinh chưa có phiếu dự thi:', error);
            throw error;
        }
    }
}

module.exports = ThiSinhDAO;
