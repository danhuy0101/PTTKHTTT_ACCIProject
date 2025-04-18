const { sql, poolPromise } = require('../../db');

class LoaiDanhGiaNangLucDAO {
    static async LayDanhSachBaiThi() {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .query(`
                    SELECT MADANHGIA, TENDANHGIA, MALINHVUC FROM LOAIDANHGIANANGLUC
                `);

            return result.recordset;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách loại đánh giá:', error);
            throw error;
        }
    }
}

module.exports = LoaiDanhGiaNangLucDAO;