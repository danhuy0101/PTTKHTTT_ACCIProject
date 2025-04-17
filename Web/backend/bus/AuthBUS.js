const { sql, poolPromise } = require('../../db');

class AuthBUS {
    static async authenticate(username, password) {
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
            
            if (result.recordset.length > 0) {
                return {
                    authenticated: true,
                    user: result.recordset[0]
                };
            }
            
            return { authenticated: false };
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }
}

module.exports = AuthBUS;
