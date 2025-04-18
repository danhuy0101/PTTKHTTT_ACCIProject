const { sql, poolPromise } = require('../../db');


class PhieuDuThiDAO {
    /**
     * Tạo và lưu phiếu dự thi mới vào cơ sở dữ liệu
     * @param {string} maPhieuDangKy - Mã phiếu đăng ký
     * @param {number} maThiSinh - Mã thí sinh
     * @returns {Object} Phiếu dự thi đã tạo
     */
    static async taoPhieuDuThi(maPhieuDangKy, maThiSinh) {
        try {
            const pool = await poolPromise;
            
            // Tạo mã phiếu dự thi tự động
            const nextIdResult = await pool.request().query(`
                SELECT 'PDT' + RIGHT('000000' + CAST(ISNULL(MAX(CAST(RIGHT(MAPHIEUDUTHI, 7) AS INT)), 0) + 1 AS VARCHAR(7)), 7) AS NextId
                FROM PHIEUDUTHI
            `);
            
            const newId = nextIdResult.recordset[0].NextId;
            
            // Kiểm tra phiếu đăng ký có tồn tại không
            const pdkResult = await pool.request()
                .input('maPhieuDangKy', sql.NVarChar, maPhieuDangKy)
                .query(`
                    SELECT MAKHACHHANG, MALICHTHI, MANHANVIEN
                    FROM PHIEUDANGKY
                    WHERE MAPHIEUDANGKY = @maPhieuDangKy
                `);
            
            if (pdkResult.recordset.length === 0) {
                throw new Error(`Không tìm thấy mã phiếu đăng ký ${maPhieuDangKy}`);
            }
            
            const MANHANVIEN = 'NV0000004';
            
            console.log(`Sử dụng mã thí sinh: ${maThiSinh} cho phiếu đăng ký: ${maPhieuDangKy}`);
            
            // Tạo số báo danh tự động
            const nextSBDResult = await pool.request().query(`
                SELECT 'SBD' + RIGHT('000' + CAST(ISNULL(MAX(CAST(RIGHT(SBD, 3) AS INT)), 0) + 1 AS VARCHAR(3)), 3) AS NextSBD
                FROM PHIEUDUTHI
            `);
            
            const newSBD = nextSBDResult.recordset[0].NextSBD;
            
            const today = new Date().toISOString().split('T')[0];
            
            // Thêm phiếu dự thi mới vào cơ sở dữ liệu
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
            
            // Lấy thông tin phiếu dự thi vừa tạo
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
            console.error('Lỗi cơ sở dữ liệu khi tạo phiếu dự thi:', error);
            throw error;
        } finally {
            sql.close();
        }
    }

    /**
     * Cập nhật trạng thái phiếu dự thi
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @param {string} trangThai - Trạng thái mới
     * @returns {Object} Kết quả cập nhật
     */
    static async capNhatTrangThai(maPhieuDuThi, trangThai) {
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
            console.error('Lỗi cơ sở dữ liệu khi cập nhật trạng thái phiếu dự thi:', error);
            throw error;
        }
    }

    /**
     * Gửi email thông báo
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @returns {Object} Kết quả gửi email
     */
    static async guiThongBaoEmail(maPhieuDuThi) {
        try {
            console.log(`Đang gửi email thông báo cho phiếu dự thi ${maPhieuDuThi}`);
            
            return { success: true };
        } catch (error) {
            console.error('Lỗi khi gửi email:', error);
            throw error;
        }
    }

    /**
     * Tìm phiếu dự thi theo mã
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @returns {Object} Thông tin phiếu dự thi
     */
    static async timPhieuDuThiTheoMa(maPhieuDuThi) {
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
            console.error('Lỗi cơ sở dữ liệu khi tìm phiếu dự thi:', error);
            throw error;
        }
    }

    /**
     * Kiểm tra trạng thái hiện tại của phiếu dự thi
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @returns {Object} Thông tin về trạng thái phiếu
     */
    static async kiemTraTrangThai(maPhieuDuThi) {
        try {
            const pool = await poolPromise;
            const checkQuery = `
                SELECT TRANGTHAI FROM PHIEUDUTHI 
                WHERE MAPHIEUDUTHI = @maPhieuDuThi
            `;
            
            const result = await pool.request()
                .input('maPhieuDuThi', sql.NVarChar, maPhieuDuThi)
                .query(checkQuery);
                
            if (result.recordset.length > 0) {
                return {
                    found: true,
                    status: result.recordset[0].TRANGTHAI
                };
            } else {
                return { found: false };
            }
        } catch (error) {
            console.error('Lỗi cơ sở dữ liệu khi kiểm tra trạng thái phiếu dự thi:', error);
            throw error;
        }
    }
}

module.exports = PhieuDuThiDAO;
