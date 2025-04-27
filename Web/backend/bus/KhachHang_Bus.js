const KhachHang_DAO = require('../dao/KhachHang_DAO');

class KhachHang_Bus {
    static async LayMaKhachHangLonNhat() {
        return await KhachHang_DAO.LayMaKhachHangLonNhat();
    }
    
    static TaoMaKhachHangLonNhat(currentCode) {
        const num = parseInt(currentCode.slice(2)) + 1;
        return 'KH' + num.toString().padStart(8, '0');
    }
    
    async ThemKhachHang(data) {
        const khachHangDAO = new KhachHang_DAO();
        return await khachHangDAO.ThemKhachHang(data);
    }
}

module.exports = KhachHang_Bus;