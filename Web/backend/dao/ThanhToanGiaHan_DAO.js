const { sql, poolPromise } = require('../../db'); // Giả định đường dẫn đến db.js của bạn

class ThanhtoanPhieuGiaHanDAO {

    /**
     * Tạo một bản ghi thanh toán cho phiếu gia hạn.
     * @param {string} maPhieuGiaHan - Mã phiếu gia hạn cần thanh toán.
     * @param {string} trangThai - Trạng thái thanh toán (e.g., 'Đã thanh toán', 'Chưa thanh toán', 'Quá hạn').
     * @param {number} soTien - Số tiền thanh toán.
     * @param {Date} ngayThanhToan - Ngày thực hiện thanh toán.
     * @returns {Promise<object>} - Bản ghi THANHTOANPHIEUGIAHAN vừa được tạo.
     * @throws {Error} - Ném lỗi nếu có vấn đề xảy ra trong quá trình tạo.
     */
    static async taoThanhToanGiaHan(maPhieuGiaHan, trangThai, soTien, ngayThanhToan) {
        try {
            const pool = await poolPromise;

            // Tự động tạo mã THANHTOANPHIEUGIAHAN tiếp theo (ví dụ: MTH0000001)
            const nextIdResult = await pool.request().query(`
                SELECT 'MTGH' + RIGHT('000000' + CAST(ISNULL(MAX(CAST(RIGHT(MAGIAHAN, 6) AS INT)), 0) + 1 AS VARCHAR(6)), 6) AS NextId
                FROM THANHTOANPHIEUGIAHAN
            `);
            const newId = nextIdResult.recordset[0].NextId;

            // Kiểm tra xem mã phiếu gia hạn có tồn tại không (Tùy chọn, nhưng nên có để đảm bảo tính toàn vẹn)
            const giaHanExists = await pool.request()
                .input('maPhieuGiaHan', sql.Char(10), maPhieuGiaHan)
                .query(`
                    SELECT 1 FROM PHIEUGIAHAN WHERE MAPHIEUGIAHAN = @maPhieuGiaHan
                `);

            if (giaHanExists.recordset.length === 0) {
                throw new Error(`Không tìm thấy mã phiếu gia hạn ${maPhieuGiaHan}`);
            }

            // Thực hiện insert vào bảng THANHTOANPHIEUGIAHAN
            await pool.request()
                .input('newId', sql.Char(10), newId)
                .input('trangThai', sql.NVarChar(30), trangThai)
                .input('soTien', sql.Decimal, soTien)
                .input('ngayThanhToan', sql.Date, ngayThanhToan)
                .input('maPhieuGiaHan', sql.Char(10), maPhieuGiaHan)
                .query(`
                    INSERT INTO THANHTOANPHIEUGIAHAN (MAGIAHAN, TRANGTHAI, SOTIEN, NGAYTHANHTOAN, MAPHIEUGIAHAN)
                    VALUES (@newId, @trangThai, @soTien, @ngayThanhToan, @maPhieuGiaHan)
                `);

            // Lấy bản ghi vừa tạo để trả về
            const result = await pool.request()
                .input('newId', sql.Char(10), newId)
                .query(`
                    SELECT * FROM THANHTOANPHIEUGIAHAN
                    WHERE MAGIAHAN = @newId
                `);

            return result.recordset[0];

        } catch (error) {
            console.error('Lỗi cơ sở dữ liệu khi tạo thanh toán gia hạn:', error);
            throw error;
        }
    }

    // Có thể thêm các hàm khác tại đây, ví dụ:
    // - layThanhToanTheoId(magiaHan)
    // - layDanhSachThanhToanTheoPhieuGiaHan(maPhieuGiaHan)
    // - capNhatTrangThaiThanhToan(magiaHan, trangThaiMoi)
    // - ...
}

module.exports = ThanhtoanPhieuGiaHanDAO;