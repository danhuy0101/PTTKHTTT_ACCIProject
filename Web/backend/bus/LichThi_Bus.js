const { sql, poolPromise } = require('../../db');
const LichThi_DAO = require('../dao/LichThi_DAO');

class LichThi_Bus {
    static async LayDanhSachLichThi(MaDanhGia) {
        const danhSach = await LichThi_DAO.LayDanhSachLichThi();
        return danhSach.filter(item => item.MADANHGIA === MaDanhGia);
    }
}

module.exports = LichThi_Bus;