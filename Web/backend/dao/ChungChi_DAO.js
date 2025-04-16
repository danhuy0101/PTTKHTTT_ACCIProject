const { sql, poolPromise } = require('../dao/DB');

class ChungChi_DAO {
    static async LayDanhSachChungChi(maPhieu, maKH, hoTen) {
        try {
            const pool = await poolPromise;

            let query = `
                SELECT 
                    cc.MaChungChi,
                    pd.MaPhieuDuThi,
                    pdk.MaPhieuDangKy,
                    kh.MaKhachHang,
                    kh.TenKhachHang,
                    ld.TENDANHGIA AS TenDanhGia,
                    ts.TENTHISINH AS HoTen,
                    cc.NgayCap,
                    cc.KETQUATHI AS KetQua,
                    cc.TrangThai
                FROM CHUNGCHI cc
                JOIN PHIEUDUTHI pd ON cc.MaPhieuDuThi = pd.MaPhieuDuThi
                JOIN THISINH ts ON pd.MaThiSinh = ts.MaThiSinh
                JOIN PHIEUDANGKY pdk ON pd.MaPhieuDangKy = pdk.MaPhieuDangKy
                JOIN KHACHHANG kh ON cc.MaKhachHang = kh.MaKhachHang
				JOIN LICHTHI lt ON pdk.MaLichThi = lt.MaLichThi
                JOIN LOAIDANHGIANANGLUC ld ON lt.MADANHGIA = ld.MADANHGIA
                WHERE 1=1
            `;

            const request = pool.request();

            if (maPhieu) {
                query += ` AND pdk.MaPhieuDangKy = @maPhieu`;
                request.input('maPhieu', sql.NVarChar, maPhieu);
            }

            if (maKH) {
                query += ` AND kh.MaKhachHang = @maKH`;
                request.input('maKH', sql.NVarChar, maKH);
            }

            if (hoTen) {
                query += ` AND LOWER(kh.TenKhachHang) LIKE @hoTen`;
                request.input('hoTen', sql.NVarChar, `%${hoTen.toLowerCase()}%`);
            }

            const result = await request.query(query);
            console.log("📦 Kết quả từ DB:", result.recordset);
            return result.recordset;
        } catch (err) {
            console.error("❌ Lỗi DAO:", err);
            return [];
        }
    }

    static async LayHoTenKhachHang(maPhieu, maKH) {
        try {
            const pool = await poolPromise;

            const query = `
                SELECT DISTINCT KH.TENKHACHHANG AS HoTen
                FROM KHACHHANG KH
                JOIN PHIEUDANGKY PDK ON KH.MAKHACHHANG = PDK.MAKHACHHANG
                WHERE 1=1
                ${maPhieu ? 'AND PDK.MaPhieuDangKy = @maPhieu' : ''}
                ${maKH ? 'AND KH.MaKhachHang = @maKH' : ''}
            `;

            const request = pool.request();
            if (maPhieu) request.input('maPhieu', sql.NVarChar, maPhieu);
            if (maKH) request.input('maKH', sql.NVarChar, maKH);

            const result = await request.query(query);
            return result.recordset.length > 0 ? result.recordset[0].HoTen : '';
        } catch (err) {
            console.error("❌ Lỗi LayHoTenKhachHang:", err);
            return '';
        }
    }

    static async CapNhatTrangThaiChungChi(danhSachMaChungChi) {
        try {
            if (!danhSachMaChungChi || !Array.isArray(danhSachMaChungChi) || danhSachMaChungChi.length === 0) {
                return { success: false, message: 'Danh sách mã chứng chỉ trống hoặc không hợp lệ' };
            }

            const pool = await poolPromise;
            const request = pool.request();

            // Escape các giá trị để tránh lỗi
            const escapedIds = danhSachMaChungChi
                .map(id => `'${id.replace(/'/g, "''")}'`)
                .join(',');

            const updateQuery = `
                UPDATE CHUNGCHI
                SET TrangThai = N'Đã nhận'
                WHERE MaChungChi IN (${escapedIds})
            `;

            console.log("⚙️ Query UPDATE:", updateQuery);

            await request.query(updateQuery);

            return { success: true, message: 'Đã cập nhật trạng thái' };
        } catch (err) {
            console.error("❌ Lỗi cập nhật trạng thái chứng chỉ:", err);
            return { success: false, message: 'Lỗi khi cập nhật: ' + err.message };
        }
    }
}

module.exports = ChungChi_DAO;
