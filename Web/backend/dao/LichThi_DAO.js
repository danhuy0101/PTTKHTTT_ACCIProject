const { sql, poolPromise } = require('../../db');

class LichThiDAO {
    static async LayDanhSachLichThi() {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .query(`
                    SELECT 
                        LT.MALICHTHI, 
                        LT.MADANHGIA, 
                        LD.TENDANHGIA, 
                        LT.SOLUONGTOIDA, 
                        COUNT(TS.MATHISINH) AS SOLUONGDADANGKY, 
                        LT.LOAILICHTHI,
                        FORMAT(LT.NGAYTHI, 'dd/MM/yyyy') + ' ' + LEFT(CONVERT(varchar, LT.GIOTHI, 108), 5) AS THOIGIAN,
                        LT.TRANGTHAI
                    FROM LICHTHI LT 
                        LEFT JOIN PHIEUDANGKY PD ON LT.MALICHTHI = PD.MALICHTHI
                        LEFT JOIN THISINH TS ON PD.MAPHIEUDANGKY = TS.MAPHIEUDANGKY
                        JOIN LOAIDANHGIANANGLUC LD ON LT.MADANHGIA = LD.MADANHGIA
                    GROUP BY 
                        LT.MALICHTHI, 
                        LD.TENDANHGIA, 
                        LT.MADANHGIA, 
                        LT.SOLUONGTOIDA, 
                        LT.LOAILICHTHI, 
                        LT.NGAYTHI, 
                        LT.GIOTHI,
                        LT.TRANGTHAI
                `);
            return result.recordset;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách lịch thi:', error);
            throw error;
        }
    }
}

module.exports = LichThiDAO;