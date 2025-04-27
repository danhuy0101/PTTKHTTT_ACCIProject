const { sql, poolPromise } = require('../../db');

class PhieuDangKyDAO {
  static async layDanhSachPhieuDangKyChoGiaHan() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT 
          PDK.MAPHIEUDANGKY,
          KH.TENKHACHHANG,
          LT.MALICHTHI,
          LT.NGAYTHI,
          KH.SĐT
        FROM PHIEUDANGKY PDK
        JOIN LICHTHI LT ON PDK.MALICHTHI = LT.MALICHTHI
        JOIN KHACHHANG KH ON PDK.MAKHACHHANG = KH.MAKHACHHANG
      `);
      return result.recordset;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phiếu đăng ký cho gia hạn:", error);
      throw error;
    }
  }

  static async timKiemPhieuDangKyChoGiaHan(tuKhoa) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('tuKhoa', sql.NVarChar, `%${tuKhoa}%`)
        .query(`
          SELECT 
            PDK.MAPHIEUDANGKY,
            KH.TENKHACHHANG,
            LT.MALICHTHI,
            LT.NGAYTHI,
            KH.SĐT
          FROM PHIEUDANGKY PDK
          JOIN LICHTHI LT ON PDK.MALICHTHI = LT.MALICHTHI
          JOIN KHACHHANG KH ON PDK.MAKHACHHANG = KH.MAKHACHHANG
          WHERE 
          PDK.MAPHIEUDANGKY LIKE @tuKhoa OR
          KH.TENKHACHHANG LIKE @tuKhoa
        `);
      return result.recordset;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm phiếu đăng ký:", error);
      throw error;
    }
  }

  static async LayMaPhieuDangKyLonNhat() {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT MAX(MAPHIEUDANGKY) AS MAX FROM PHIEUDANGKY`);
    return result.recordset[0].MAX || 'PDK0000000';
  }

  async ThemPhieuDangKy(pdk) {
    const {
      MAPHIEUDANGKY,
      NGAYDANGKY,
      MAKHACHHANG,
      MALICHTHI,
      MANHANVIEN
    } = pdk;
  
    const pool = await poolPromise;
  
    await pool.request()
      .input('MAPDK', sql.Char(10), MAPHIEUDANGKY)
      .input('NGAYDK', sql.DateTime, NGAYDANGKY)
      .input('MAKH', sql.Char(10), MAKHACHHANG)
      .input('MALT', sql.Char(10), MALICHTHI)
      .input('MANV', sql.Char(10), MANHANVIEN)
      .query(`
        INSERT INTO PHIEUDANGKY (
          MAPHIEUDANGKY, NGAYDANGKY, MAKHACHHANG, MALICHTHI, MANHANVIEN
        ) VALUES (
          @MAPDK, @NGAYDK, @MAKH, @MALT, @MANV
        )
      `);
  }
}

module.exports = PhieuDangKyDAO;