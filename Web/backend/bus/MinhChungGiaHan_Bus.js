const MinhChungGiaHanDAO = require('../dao/MinhChungGiaHan_DAO');

class MinhChungGiaHanBUS {
    /**
     * Tạo minh chứng gia hạn
     * @param {string} maPhieuGiaHan
     * @param {string} lyDo
     * @returns {Object} Minh chứng đã tạo
     */
    static async taoMinhChungGiaHan(maPhieuGiaHan, lyDo) {
        if (!maPhieuGiaHan || !lyDo) {
            throw new Error('Thiếu mã phiếu gia hạn hoặc lý do để tạo minh chứng');
        }

        return await MinhChungGiaHanDAO.taoMinhChungGiaHan(maPhieuGiaHan, lyDo);
    }

    /**
     * Lấy danh sách minh chứng theo mã phiếu gia hạn
     * @param {string} maPhieuGiaHan
     * @returns {Array}
     */
    static async layMinhChungTheoPhieuGiaHan(maPhieuGiaHan) {
        if (!maPhieuGiaHan) {
            throw new Error('Thiếu mã phiếu gia hạn để tìm minh chứng');
        }

        return await MinhChungGiaHanDAO.layMinhChungTheoPhieuGiaHan(maPhieuGiaHan);
    }
}

module.exports = MinhChungGiaHanBUS;
