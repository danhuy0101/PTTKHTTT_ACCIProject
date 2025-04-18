const { sql, poolPromise } = require('../../db');

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
        }
    }

    static async LayMaThiSinhLonNhat() {
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT MAX(MATHISINH) AS maxId FROM THISINH`);
        return result.recordset[0]?.maxId || 0;
    }
    
    async ThemThiSinh(ts) {
        const {
          MATHISINH,
          TENTHISINH,
          NGAYSINH,
          DIACHI,
          SĐT,
          EMAIL,
          MALICHTHI
        } = ts;
      
        const pool = await poolPromise;
      
        await pool.request()
          .input('MATS', sql.Int, MATHISINH)
          .input('TENTS', sql.NVarChar(50), TENTHISINH)
          .input('NGAYSINH', sql.Date, NGAYSINH)
          .input('DIACHI', sql.NVarChar(100), DIACHI)
          .input('SĐT', sql.Char(10), SĐT)
          .input('EMAIL', sql.VarChar(100), EMAIL)
          .input('MALICHTHI', sql.VarChar(10), MALICHTHI)
          .query(`
            INSERT INTO THISINH (
              MATHISINH, TENTHISINH, NGAYSINH, DIACHI, SĐT, EMAIL, MAPHIEUDANGKY, MALICHTHI
            ) VALUES (
              @MATS, @TENTS, @NGAYSINH, @DIACHI, @SĐT, @EMAIL, NULL, @MALICHTHI
            )
          `);
      }
}

module.exports = ThiSinhDAO;
