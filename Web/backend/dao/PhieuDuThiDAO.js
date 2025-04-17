const { sql, poolPromise } = require('../../db');


class PhieuDuThiDAO {
    static async LuuPhieuDuThi(maPhieuDangKy, maThiSinh) {
        try {
            const pool = await poolPromise;
            
            const nextIdResult = await pool.request().query(`
                SELECT 'PDT' + RIGHT('000000' + CAST(ISNULL(MAX(CAST(RIGHT(MAPHIEUDUTHI, 7) AS INT)), 0) + 1 AS VARCHAR(7)), 7) AS NextId
                FROM PHIEUDUTHI
            `);
            
            const newId = nextIdResult.recordset[0].NextId;
            
            const pdkResult = await pool.request()
                .input('maPhieuDangKy', sql.NVarChar, maPhieuDangKy)
                .query(`
                    SELECT MAKHACHHANG, MALICHTHI, MANHANVIEN
                    FROM PHIEUDANGKY
                    WHERE MAPHIEUDANGKY = @maPhieuDangKy
                `);
            
            if (pdkResult.recordset.length === 0) {
                throw new Error(`Registration ID ${maPhieuDangKy} not found`);
            }
            
            const MANHANVIEN = 'NV0000004';
            
            console.log(`Using provided candidate ID: ${maThiSinh} for registration ID: ${maPhieuDangKy}`);
            
            const nextSBDResult = await pool.request().query(`
                SELECT 'SBD' + RIGHT('000' + CAST(ISNULL(MAX(CAST(RIGHT(SBD, 3) AS INT)), 0) + 1 AS VARCHAR(3)), 3) AS NextSBD
                FROM PHIEUDUTHI
            `);
            
            const newSBD = nextSBDResult.recordset[0].NextSBD;
            
            const today = new Date().toISOString().split('T')[0];
            
            await pool.request()
                .input('newId', sql.NVarChar, newId)
                .input('newSBD', sql.NVarChar, newSBD)
                .input('today', sql.Date, today)
                .input('MANHANVIEN', sql.NVarChar, MANHANVIEN)
                .input('maPhieuDangKy', sql.NVarChar, maPhieuDangKy)
                .input('MATHISINH', sql.Int, maThiSinh)
                .query(`
                    INSERT INTO PHIEUDUTHI (MAPHIEUDUTHI, SBD, TRANGTHAI, NGAYPHATHANH, MANHANVIEN, MAPHIEUDANGKY, MATHISINH)
                    VALUES (@newId, @newSBD, N'Chưa gửi', @today, @MANHANVIEN, @maPhieuDangKy, @MATHISINH)
                `);
            
            const result = await pool.request()
                .input('newId', sql.NVarChar, newId)
                .query(`
                    SELECT 
                        MAPHIEUDUTHI,
                        SBD,
                        TRANGTHAI,
                        NGAYPHATHANH,
                        MANHANVIEN,
                        MAPHIEUDANGKY,
                        MATHISINH
                    FROM PHIEUDUTHI
                    WHERE MAPHIEUDUTHI = @newId
                `);
            
            return result.recordset[0];
        } catch (error) {
            console.error('Database error creating exam ticket:', error);
            throw error;
        } finally {
            sql.close();
        }
    }

    static async CapNhatTrangThai(maPhieuDuThi, trangThai) {
        try {
            const pool = await poolPromise;
            
            await pool.request()
                .input('trangThai', sql.NVarChar, trangThai)
                .input('maPhieuDuThi', sql.NVarChar, maPhieuDuThi)
                .query(`
                    UPDATE PHIEUDUTHI
                    SET TRANGTHAI = @trangThai
                    WHERE MAPHIEUDUTHI = @maPhieuDuThi
                `);
            
            return { success: true };
        } catch (error) {
            console.error('Database error updating exam ticket status:', error);
            throw error;
        } finally {
            sql.close();
        }
    }

    static async GuiMail(maPhieuDuThi) {
        try {
            console.log(`Sending email notification for exam ticket ${maPhieuDuThi}`);
            
            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    static async TimPhieuDuThi(maPhieuDuThi) {
        try {
            const pool = await poolPromise;
            
            const result = await pool.request()
                .input('maPhieuDuThi', sql.NVarChar, maPhieuDuThi)
                .query(`
                    SELECT 
                        p.MAPHIEUDUTHI,
                        p.SBD,
                        p.TRANGTHAI,
                        p.NGAYPHATHANH,
                        p.MANHANVIEN,
                        p.MAPHIEUDANGKY,
                        p.MATHISINH,
                        t.TENTHISINH,
                        t.EMAIL
                    FROM PHIEUDUTHI p
                    JOIN THISINH t ON p.MATHISINH = t.MATHISINH
                    WHERE p.MAPHIEUDUTHI = @maPhieuDuThi
                `);
            
            if (result.recordset.length > 0) {
                return result.recordset[0];
            }
            
            return null;
        } catch (error) {
            console.error('Database error finding exam ticket:', error);
            throw error;
        } finally {
            sql.close();
        }
    }
}

module.exports = PhieuDuThiDAO;
