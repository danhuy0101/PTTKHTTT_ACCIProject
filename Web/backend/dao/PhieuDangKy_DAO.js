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
          PDK.TRANGTHAIGIAHAN
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
            PDK.TRANGTHAIGIAHAN
          FROM PHIEUDANGKY PDK
          JOIN LICHTHI LT ON PDK.MALICHTHI = LT.MALICHTHI
          JOIN KHACHHANG KH ON PDK.MAKHACHHANG = KH.MAKHACHHANG
          WHERE 
          PDK.MAPHIEUDANGKY LIKE @tuKhoa OR
          KH.TENKHACHHANG LIKE @tuKhoa or
          LT.MALICHTHI LIKE @tuKhoa
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

  static async capNhatTrangThaiGiaHan(maPhieuDangKy) {
    try {
      const pool = await poolPromise;

      // Kiểm tra số lượng phiếu gia hạn hiện tại
      const checkResult = await pool.request()
        .input('maPhieuDangKy', sql.Char(10), maPhieuDangKy)
        .query(`
          SELECT COUNT(*) AS SoLanGiaHan
          FROM PHIEUGIAHAN
          WHERE MADANGKY = @maPhieuDangKy
        `);

      const soLanGiaHan = checkResult.recordset[0].SoLanGiaHan;

      let trangThai = '';
      if (soLanGiaHan === 1) {
        trangThai = 'Đã gia hạn lần 1';
      } else {
        trangThai = 'Đã gia hạn lần 2';
      }

      // Cập nhật trạng thái
      await pool.request()
        .input('trangThai', sql.NVarChar(50), trangThai)
        .input('maPhieuDangKy', sql.Char(10), maPhieuDangKy)
        .query(`
          UPDATE PHIEUDANGKY
          SET TRANGTHAIGIAHAN = @trangThai
          WHERE MAPHIEUDANGKY = @maPhieuDangKy
        `);

    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái gia hạn cho phiếu đăng ký:", error);
      throw error;
    }
  }

}

module.exports = PhieuDangKyDAO;