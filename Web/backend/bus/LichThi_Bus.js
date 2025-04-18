const { sql, poolPromise } = require('../../db');
const LichThi_DAO = require('../dao/LichThi_DAO');

class LichThi_Bus {
    static async LayDanhSachLichThiKhaDung_KHTuDo(MaDanhGia) {
        const danhSach = await LichThi_DAO.LayDanhSachLichThiKhaDung();

        return danhSach.filter(item =>
            item.MADANHGIA === MaDanhGia &&
            item.SOLUONGDADANGKY < item.SOLUONGTOIDA &&
            item.LOAILICHTHI === 'Tự do'
        );
    }
}

module.exports = LichThi_Bus;