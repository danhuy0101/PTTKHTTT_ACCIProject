const ThanhtoanPhieuGiaHanDAO = require('../DAO/ThanhToanGiaHan_DAO');

class ThanhtoanPhieuGiaHanBUS {

    /**
     * Tạo thanh toán cho phiếu gia hạn.
     * @param {Object} params
     * @param {string} params.maPhieuGiaHan - Mã phiếu gia hạn cần thanh toán.
     * @param {string} params.trangThai - Trạng thái thanh toán (e.g., 'Đã thanh toán', 'Chưa thanh toán', 'Quá hạn').
     * @param {number} params.soTien - Số tiền thanh toán.
     * @param {Date} params.ngayThanhToan - Ngày thực hiện thanh toán.
     * @returns {Object} - Bản ghi thanh toán phiếu gia hạn đã được tạo.
     * @throws {Error} - Nếu có lỗi trong quá trình tạo thanh toán.
     */
    static async taoThanhToanGiaHan({ maPhieuGiaHan, trangThai, soTien, ngayThanhToan }) {
        try {
            // Kiểm tra tính hợp lệ của các thông tin
            if (!maPhieuGiaHan || !trangThai || !soTien || !ngayThanhToan) {
                throw new Error('Thiếu thông tin cần thiết để tạo thanh toán gia hạn');
            }

            // Tạo thanh toán gia hạn
            const thanhToan = await ThanhtoanPhieuGiaHanDAO.taoThanhToanGiaHan(maPhieuGiaHan, trangThai, soTien, ngayThanhToan);

            // Trả về thông tin thanh toán vừa tạo
            return thanhToan;

        } catch (error) {
            console.error('Lỗi khi tạo thanh toán gia hạn:', error);
            throw error;
        }
    }
}

module.exports = ThanhtoanPhieuGiaHanBUS;
