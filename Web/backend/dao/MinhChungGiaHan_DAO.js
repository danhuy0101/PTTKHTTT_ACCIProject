const { sql, poolPromise } = require('../../db');

class MinhChungGiaHanDAO {
    /**
     * Tạo minh chứng gia hạn mới
     * @param {string} maPhieuGiaHan - Mã phiếu gia hạn
     * @param {string} lyDo - Lý do minh chứng
     * @returns {Object} Minh chứng đã tạo
     */
    static async taoMinhChungGiaHan(maPhieuGiaHan, lyDo) {
        try {
            const pool = await poolPromise;

            const mamc = await pool.request().query(`
                SELECT 'MCGH' + RIGHT('000000' + CAST(ISNULL(MAX(CAST(RIGHT(MAPHIEUCM, 6) AS INT)), 0) + 1 AS VARCHAR(6)), 6) AS NewId
                FROM CHUNGMINHGIAHAN
            `);
            const newId = mamc.recordset[0].NewId;

            await pool.request()
                .input('newId', sql.NVarChar, newId)
                .input('maPhieuGiaHan', sql.NVarChar, maPhieuGiaHan)
                .input('lyDo', sql.NVarChar, lyDo)
                .query(`
                    INSERT INTO CHUNGMINHGIAHAN (MAPHIEUCM, MAPHIEUGIAHAN, LYDOGIAHAN)
                    VALUES (@newId, @maPhieuGiaHan, @lyDo)
                `); 

            return {
                MAMINHCHUNG: newId,
                MAPHIEUGIAHAN: maPhieuGiaHan,
                LYDO: lyDo
            };
        } catch (error) {
            console.error('Lỗi khi tạo minh chứng gia hạn:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách minh chứng theo mã phiếu gia hạn
     * @param {string} maPhieuGiaHan
     * @returns {Array}
     */
    static async layMinhChungTheoPhieuGiaHan(maPhieuGiaHan) {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .input('maPhieuGiaHan', sql.NVarChar, maPhieuGiaHan)
                .query(`
                    SELECT MAMINHCHUNG, MAPHIEUGIAHAN, LYDO
                    FROM MINHCHUNGGIAHAN
                    WHERE MAPHIEUGIAHAN = @maPhieuGiaHan
                `);

            return result.recordset;
        } catch (error) {
            console.error('Lỗi khi lấy minh chứng gia hạn:', error);
            throw error;
        }
    }
}

module.exports = MinhChungGiaHanDAO;
