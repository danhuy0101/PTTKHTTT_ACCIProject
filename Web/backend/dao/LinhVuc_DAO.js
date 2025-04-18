const { sql, poolPromise } = require('../../db');

class LinhVucDAO {
    static async LayDanhSachLinhVuc() {
        try {
            const pool = await poolPromise;
            
            const result = await pool.request().query(`
                SELECT MALINHVUC, TENLINHVUC FROM LINHVUC
            `);
            
            return result.recordset;
        } catch (error) {
            console.error('Lỗi lấy danh sách lĩnh vực:', error);
            throw error;
        }
    }
}

module.exports = LinhVucDAO;