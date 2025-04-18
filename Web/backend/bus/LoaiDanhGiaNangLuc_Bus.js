const { sql, poolPromise } = require('../../db');
const LoaiDanhGiaNangLuc_DAO = require('../dao/LoaiDanhGiaNangLuc_DAO');

class LoaiDanhGiaNangLuc_Bus {
    static async LayDanhSachBaiThi(MaLinhVuc) {
        const danhSach = await LoaiDanhGiaNangLuc_DAO.LayDanhSachBaiThi();
        return danhSach.filter(item => item.MALINHVUC === MaLinhVuc);
    }
}

module.exports = LoaiDanhGiaNangLuc_Bus;