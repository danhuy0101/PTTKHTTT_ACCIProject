const { sql, poolPromise } = require('../../db');
const LinhVuc_DAO = require('../dao/LinhVuc_DAO');

class LinhVuc_Bus {
    static async LayDanhSachLinhVuc() {
        return await LinhVuc_DAO.LayDanhSachLinhVuc();
    }
}

module.exports = LinhVuc_Bus;