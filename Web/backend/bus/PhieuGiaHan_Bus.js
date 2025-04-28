const GiaHanDAO = require('../DAO/PhieuGiaHan_DAO');
// const MinhChungGiaHanDAO = require('../DAO/MinhChungGiaHan_DAO');
const MinhChungGiaHanBUS = require('../bus/MinhChungGiaHan_Bus');
const PhieuDangKyBUS = require('../bus/PhieuDangKy_Bus');

class GiaHanBUS {
    /**
     * Lập phiếu gia hạn và minh chứng gia hạn
     * @param {Object} params
     * @param {string} params.maPhieuDangKy - Mã phiếu đăng ký
     * @param {string} params.truongHop - Trường hợp gia hạn (Đặc biệt / Không đặc biệt)
     * @param {Date} params.ngayGiaHan - Ngày gia hạn
     * @param {number} params.phiGiaHan - Phí gia hạn
     * @param {string} [params.lyDoGiaHan] - Lý do gia hạn (chỉ cần khi là "Đặc biệt")
     * @returns {Object} Phiếu gia hạn đã được tạo
     */
    static async lapPhieuGiaHan({ maPhieuDangKy, truongHop, ngayGiaHan, phiGiaHan, lyDoGiaHan }) {
        try {
            console.log(maPhieuDangKy, truongHop, ngayGiaHan, phiGiaHan, lyDoGiaHan);
            // Kiểm tra tính hợp lệ của các thông tin
            if (!maPhieuDangKy || !truongHop || !ngayGiaHan || !phiGiaHan) {
                throw new Error('Thiếu thông tin cần thiết để lập phiếu gia hạn');
            }

            if (truongHop === 'Đặc biệt' && !lyDoGiaHan) {
                throw new Error('Lý do gia hạn là bắt buộc khi chọn trường hợp Đặc biệt');
            }

            // Tạo phiếu gia hạn
            const phieuGiaHan = await GiaHanDAO.taoPhieuGiaHan(maPhieuDangKy, truongHop, ngayGiaHan, phiGiaHan);

            const phieuDangKy = await PhieuDangKyBUS.capNhatTrangThaiGiaHan(maPhieuDangKy);
            phieuGiaHan.phieuDangKy = phieuDangKy;

            // Nếu trường hợp gia hạn là "Đặc biệt", tạo minh chứng gia hạn
            if (truongHop === 'Đặc biệt' && lyDoGiaHan) {
                const minhChung = await MinhChungGiaHanBUS.taoMinhChungGiaHan(phieuGiaHan.MAPHIEUGIAHAN, lyDoGiaHan);
                phieuGiaHan.minhChung = minhChung;
            }

            return phieuGiaHan;
        } catch (error) {
            console.error('Lỗi khi lập phiếu gia hạn:', error);
            throw error;
        }
    }

    static async layDanhSachPhieuGiaHan() {
        try {
            return await GiaHanDAO.layDanhSachPhieuGiaHan();
        } catch (error) {
            console.error("BUS - Lỗi khi lấy danh sách phiếu gia hạn:", error);
            throw error;
        }
    }

    static async timKiemPhieuGiaHan(tuKhoa) {
        try {
            return await GiaHanDAO.timKiemPhieuGiaHan(tuKhoa);
        } catch (error) {
            console.error("BUS - Lỗi khi tìm kiếm phiếu gia hạn:", error);
            throw error;
        }
    }
}

module.exports = GiaHanBUS;
