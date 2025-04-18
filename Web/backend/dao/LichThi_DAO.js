const { sql, poolPromise } = require('../../db');

class LichThiDAO {
    static async LayDanhSachLichThiKhaDung() {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .query(`
                    SELECT 
                        LT.MALICHTHI,
                        LT.MADANHGIA,
                        LT.SOLUONGTOIDA,
                        COUNT(TS.MATHISINH) AS SOLUONGDADANGKY,
                        LT.LOAILICHTHI,
                        FORMAT(LT.NGAYTHI, 'dd/MM/yyyy') + ' ' + LEFT(CONVERT(varchar, LT.GIOTHI, 108), 5) AS THOIGIAN
                    FROM LICHTHI LT
                    LEFT JOIN THISINH TS ON TS.MALICHTHI = LT.MALICHTHI
                    GROUP BY LT.MALICHTHI, LT.MADANHGIA, LT.SOLUONGTOIDA, LT.LOAILICHTHI, LT.NGAYTHI, LT.GIOTHI
                `);
            return result.recordset;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách lịch thi:', error);
            throw error;
        }
    }
}

module.exports = LichThiDAO;