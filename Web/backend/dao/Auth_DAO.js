const { sql, poolPromise } = require('../../db');

class AuthDAO {
    static async getUserByUsernameAndPassword(username, password) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .input('password', sql.NVarChar, password)
                .query(`
                    SELECT t.ID, t.USERNAME, t.[ROLE], n.MANHANVIEN, n.TENNHANVIEN
                    FROM TAIKHOAN t
                    LEFT JOIN NHANVIEN n ON t.[ROLE] = n.VAITRO
                    WHERE t.USERNAME = @username AND t.[PASSWORD] = @password
                `);
            return result.recordset;
        } catch (err) {
            console.error('AuthDAO Error:', err);
            throw err;
        }
    }
}

module.exports = AuthDAO;
