const { sql, poolPromise } = require('../../db');

class KhachHangDAO {
  static async LayMaKhachHangLonNhat() {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT MAX(MAKHACHHANG) AS MAX FROM KHACHHANG`);
    return result.recordset[0].MAX || 'KH00000000';
  }

  async ThemKhachHang(kh) {
    const {
      MAKHACHHANG,
      TENKHACHHANG,
      NGAYSINH,
      DIACHI,
      SĐT,
      EMAIL,
      LOAIKHACHHANG
    } = kh;
  
    const pool = await poolPromise;
  
    await pool.request()
      .input('MAKH', sql.Char(10), MAKHACHHANG)
      .input('TENKH', sql.NVarChar(50), TENKHACHHANG)
      .input('NGAYSINH', sql.Date, NGAYSINH)
      .input('DIACHI', sql.NVarChar(100), DIACHI)
      .input('SĐT', sql.Char(10), SĐT)
      .input('EMAIL', sql.VarChar(100), EMAIL)
      .input('LOAIKH', sql.NVarChar(10), LOAIKHACHHANG)
      .query(`
        INSERT INTO KHACHHANG (
          MAKHACHHANG, TENKHACHHANG, NGAYSINH, DIACHI, SĐT, EMAIL, LOAIKHACHHANG
        ) VALUES (
          @MAKH, @TENKH, @NGAYSINH, @DIACHI, @SĐT, @EMAIL, @LOAIKH
        )
      `);
  }
}

module.exports = KhachHangDAO;