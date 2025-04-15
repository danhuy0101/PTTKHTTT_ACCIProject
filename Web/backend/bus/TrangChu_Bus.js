const sql = require('mssql');
const config = require('../../db');

class TrangChu_Bus {
    static async ChuyenTrang_PhatHanhPhieuDuThi() {
        return { success: true, redirectUrl: '/phat-hanh-phieu-du-thi' };
    }

    static async ChuyenTrang_TrangChu() {
        return { success: true, redirectUrl: '/welcome' };
    }
}

module.exports = TrangChu_Bus;
