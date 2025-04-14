const { poolPromise } = require("./DB");

class ExampleDAO {
  static async getDanhSachKhachHang() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM KHACHHANG");
    return result.recordset;
  }
}

module.exports = ExampleDAO;