const express = require("express");
const router = express.Router();
const { isAuthenticated, hasRole } = require("../middleware/auth");

const LinhVuc_Bus = require('../bus/LinhVuc_Bus');
const LoaiDanhGiaNangLuc_Bus = require('../bus/LoaiDanhGiaNangLuc_Bus');
const LichThi_Bus = require('../bus/LichThi_Bus');
const KhachHang_Bus = require('../bus/KhachHang_Bus');
const ThiSinh_Bus = require('../bus/ThiSinh_Bus');
const PhieuDangKy_Bus = require('../bus/PhieuDangKy_Bus');

const fs = require('fs');

// Trang chọn loại khách hàng (Đăng ký dự thi) – dành cho Tiếp nhận
router.get("/dang-ky-du-thi", isAuthenticated, hasRole("Tiếp nhận"), (req, res) => {
    res.render("MH_DangKyDuThi_LoaiKH", {
      user: req.session.user,
      layout: "main"
    });
});
  
// Khách hàng tự do
router.get("/dang-ky-du-thi/khach-hang-tu-do", isAuthenticated, hasRole("Tiếp nhận"), async (req, res) => {
  try {
    const linhVucList = await LinhVuc_Bus.LayDanhSachLinhVuc();

    res.render("MH_DangKyDuThi_KHTuDo", {
      user: req.session.user,
      layout: "main",
      linhVucList
    });
  } catch (error) {
    console.error("Lỗi truy cập trang KH tự do:", error);
    res.render("error", {
      layout: "login",
      message: "Không thể truy cập trang đăng ký dự thi - KH tự do."
    });
  }
});

// API lấy danh sách bài thi theo MALINHVUC
router.get("/api/bai-thi/:maLinhVuc", async (req, res) => {
  try {
    const danhSachBaiThi = await LoaiDanhGiaNangLuc_Bus.LayDanhSachBaiThi(req.params.maLinhVuc);
    res.json(danhSachBaiThi);
  } catch (err) {
    console.error("Lỗi lấy bài thi:", err);
    res.status(500).json({ error: "Không lấy được bài thi." });
  }
});

// API lấy lịch thi theo MADANHGIA
router.get("/api/lich-thi/:maDanhGia", async (req, res) => {
  try {
    const danhSachLichThi = await LichThi_Bus.LayDanhSachLichThiKhaDung_KHTuDo(req.params.maDanhGia);
    res.json(danhSachLichThi);
  } catch (err) {
    console.error("Lỗi lấy lịch thi:", err);
    res.status(500).json({ error: "Không lấy được lịch thi." });
  }
});

router.post('/dang-ky-du-thi/khach-hang-tu-do/luu-thong-tin', async (req, res) => {
  try {
    fs.writeFileSync('debug-log.txt', JSON.stringify(req.body, null, 2));
    const currentNV = 'NV0000001'

    // 1. Tạo mã KH
    const maxKH = await KhachHang_Bus.LayMaKhachHangLonNhat();
    const newMaKH = KhachHang_Bus.TaoMaKhachHangLonNhat(maxKH);
    
    // 2. Lưu khách hàng
    const khBus = new KhachHang_Bus();
    await khBus.ThemKhachHang({
      MAKHACHHANG: newMaKH,
      TENKHACHHANG: req.body['khachHang.ten'],
      NGAYSINH: req.body['khachHang.ngaySinh'],
      DIACHI: req.body['khachHang.diaChi'],
      SĐT: req.body['khachHang.sdt'],
      EMAIL: req.body['khachHang.email'],
      LOAIKHACHHANG: 'Tự do',
    });

    // 3. Tạo mã PDK
    const maxPDK = await PhieuDangKy_Bus.LayMaPhieuDangKyLonNhat();
    const newMaPDK = PhieuDangKy_Bus.TaoMaPhieuDangKyLonNhat(maxPDK);

    // 4. Tạo phiếu đăng ký
    const pdkBus = new PhieuDangKy_Bus();
    await pdkBus.ThemPhieuDangKy({
      MAPHIEUDANGKY: newMaPDK,
      NGAYDANGKY: new Date(),
      MAKHACHHANG: newMaKH,
      MALICHTHI: req.body['lichThi.maLichThi'],
      MANHANVIEN: currentNV,
    })

    // 5. Tạo mã thí sinh
    const maxTS = await ThiSinh_Bus.LayMaThiSinhLonNhat();
    const newMaTS = maxTS + 1;

    // 6. Lưu thí sinh
    const tsBus = new ThiSinh_Bus();
    await tsBus.ThemThiSinh({
      MATHISINH: newMaTS,
      TENTHISINH: req.body['thiSinh.ten'],
      NGAYSINH: req.body['thiSinh.ngaySinh'],
      DIACHI: req.body['thiSinh.diaChi'],
      SĐT: req.body['thiSinh.sdt'],
      EMAIL: req.body['thiSinh.email'],
      MAPHIEUDANGKY: newMaPDK,
    });

    // 5. Trả lại modal thành công
    res.redirect('/dang-ky-du-thi/khach-hang-tu-do?success=true');

  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      layout: "login",
      message: "Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại sau."
    });
  }
});

module.exports = router;