const { sql, poolPromise } = require('../../db');

class LichThiDAO {
    static async LayDanhSachLichThi() {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .query(`
                    SELECT 
                        MALICHTHI,
                        MADANHGIA,
                        FORMAT(NGAYTHI, 'dd/MM/yyyy') + ' ' + LEFT(CONVERT(varchar, GIOTHI, 108), 5) AS THOIGIAN
                    FROM LICHTHI
                `);
            return result.recordset;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách lịch thi:', error);
            throw error;
        }
    }
}

module.exports = LichThiDAO;