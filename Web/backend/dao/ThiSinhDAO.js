const { sql, poolPromise } = require('./DB');

class ThiSinhDAO {
    static async LayDanhSachThiSinh() {
        try {
            const pool = await poolPromise;
            
            const result = await pool.request().query(`
                SELECT 
                    MATHISINH,
                    TENTHISINH,
                    NGAYSINH,
                    SĐT AS SDT,
                    DIACHI,
                    EMAIL,
                    MAPHIEUDANGKY
                FROM THISINH
                ORDER BY MATHISINH
            `);
            
            return result.recordset;
        } catch (error) {
            console.error('Database error getting candidates:', error);
            throw error;
        } finally {
            sql.close();
        }
    }

    static async TimThiSinh(maThiSinh) {
        try {
            const pool = await poolPromise;
            
            const result = await pool.request()
                .input('maThiSinh', sql.Int, maThiSinh)
                .query(`
                    SELECT 
                        MATHISINH,
                        TENTHISINH,
                        NGAYSINH,
                        SĐT AS SDT,
                        DIACHI,
                        EMAIL,
                        MAPHIEUDANGKY
                    FROM THISINH
                    WHERE MATHISINH = @maThiSinh
                `);
            
            if (result.recordset.length > 0) {
                return result.recordset[0];
            }
            
            return null;
        } catch (error) {
            console.error('Database error finding candidate:', error);
            throw error;
        } finally {
            sql.close();
        }
    }
}

module.exports = ThiSinhDAO;
