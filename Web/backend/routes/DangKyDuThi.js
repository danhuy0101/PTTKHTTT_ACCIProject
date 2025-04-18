const express = require("express");
const router = express.Router();
const { isAuthenticated, hasRole } = require("./middleware");

const LinhVuc_Bus = require('../bus/LinhVuc_Bus');
const LoaiDanhGiaNangLuc_Bus = require('../bus/LoaiDanhGiaNangLuc_Bus');
const LichThi_Bus = require('../bus/LichThi_Bus');

// const KhachHang_Bus = require('../bus/KhachHang_Bus');
// const ThiSinh_Bus = require('../bus/ThiSinh_Bus');

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
    const danhSachLichThi = await LichThi_Bus.LayDanhSachLichThi(req.params.maDanhGia);
    res.json(danhSachLichThi);
  } catch (err) {
    console.error("Lỗi lấy lịch thi:", err);
    res.status(500).json({ error: "Không lấy được lịch thi." });
  }
});

module.exports = router;