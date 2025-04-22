const { sql, poolPromise } = require('../../db');
const MinhChungGiaHanDAO = require('./MinhChungGiaHan_DAO');

class GiaHanDAO {
    static async taoPhieuGiaHan(maPhieuDangKy, truongHop, ngayGiaHan, phiGiaHan) {
        try {
            const pool = await poolPromise;

            const nextIdResult = await pool.request().query(`
                SELECT 'PGH' + RIGHT('000000' + CAST(ISNULL(MAX(CAST(RIGHT(MAPHIEUGIAHAN, 7) AS INT)), 0) + 1 AS VARCHAR(7)), 7) AS NextId
                FROM PHIEUGIAHAN
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
                throw new Error(`Không tìm thấy mã phiếu đăng ký ${maPhieuDangKy}`);
            }

            const MANHANVIEN = 'NV0000004';

            await pool.request()
                .input('newId', sql.NVarChar, newId)
                .input('truongHop', sql.NVarChar, truongHop)
                .input('ngayGiaHan', sql.DateTime, ngayGiaHan)
                .input('phiGiaHan', sql.Decimal, phiGiaHan)
                .input('MANHANVIEN', sql.NVarChar, MANHANVIEN)
                .input('maPhieuDangKy', sql.NVarChar, maPhieuDangKy)
                .query(`
                    INSERT INTO PHIEUGIAHAN (MAPHIEUGIAHAN, TRUONGHOPGIAHAN, NGAYGIAHAN, PHIGIAHAN, MANHANVIEN, MADANGKY)
                    VALUES (@newId, @truongHop, @ngayGiaHan, @phiGiaHan, @MANHANVIEN, @maPhieuDangKy)
                `);

            // Tạo minh chứng nếu là trường hợp đặc biệt
            if (truongHop === 'Đặc biệt') {
                await MinhChungGiaHanDAO.taoMinhChungGiaHan(newId, 'Lý do đặc biệt');
            }

            const result = await pool.request()
                .input('newId', sql.NVarChar, newId)
                .query(`
                    SELECT * FROM PHIEUGIAHAN
                    WHERE MAPHIEUGIAHAN = @newId
                `);

            return result.recordset[0];
        } catch (error) {
            console.error('Lỗi cơ sở dữ liệu khi tạo phiếu gia hạn:', error);
            throw error;
        }
    }
}

module.exports = GiaHanDAO;
