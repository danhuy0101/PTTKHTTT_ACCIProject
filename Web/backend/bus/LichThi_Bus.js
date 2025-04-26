const { sql, poolPromise } = require('../../db');
const LichThi_DAO = require('../dao/LichThi_DAO');

class LichThi_Bus {
    static async LayDanhSachLichThiKhaDung_KHTuDo(MaDanhGia) {
        const danhSach = await LichThi_DAO.LayDanhSachLichThiKhaDung();

        const now = new Date();

        return danhSach.filter(item => {
            const [day, month, yearTime] = item.THOIGIAN.split('/');
            const [year, hourMinute] = yearTime.split(' ');
            const [hour, minute] = hourMinute.split(':');

            const lichThiDate = new Date(
                parseInt(year),         // year
                parseInt(month) - 1,    // month (0-indexed)
                parseInt(day),          // day
                parseInt(hour),         // hour
                parseInt(minute)        // minute
            );

            return (
                item.MADANHGIA === MaDanhGia &&
                item.SOLUONGDADANGKY < item.SOLUONGTOIDA &&
                item.LOAILICHTHI === 'Tự do' &&
                item.TRANGTHAI === 'Chưa thi' &&
                lichThiDate > now       // Must be in the future
            );
        });
    }
}

module.exports = LichThi_Bus;