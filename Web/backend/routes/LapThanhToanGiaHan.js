const express = require("express");
const router = express.Router();
const GiaHanBUS = require("../bus/PhieuGiaHan_Bus");
const ThanhToanGiaHan_Bus = require("../bus/ThanhToanGiaHan_Bus");
const { isAuthenticated, hasRole } = require("../middleware/auth");

// Trang lập phiếu gia hạn - chỉ cho kế toán
router.get("/lap-thanh-toan-gia-han", isAuthenticated, hasRole("Kế toán"), async (req, res) => {
  try {
    const danhSachPhieuGiaHan = await GiaHanBUS.layDanhSachPhieuGiaHan();

    res.render("MH_LapThanhToanGiaHan", {
        danhSachPhieuGiaHan,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Lỗi khi tải danh sách phiếu gia hạn:", error);
    res.render("error", {
      message: "Không thể tải danh sách phiếu gia hạn",
      error,
    });
  }
});

// Xử lý lập phiếu gia hạn
router.post("/lap-thanh-toan-gia-han", isAuthenticated, hasRole("Kế toán"), async (req, res) => {
  try {
    const { maPhieuGiaHan, trangThai, soTien, ngayThanhToan } = req.body;
    console.log('ROUTES');
    console.log(req.body);
    console.log(maPhieuGiaHan, trangThai, soTien, ngayThanhToan);

    if (!maPhieuGiaHan || !trangThai || !ngayThanhToan || !soTien) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin thanh toán gia hạn",
      });
    }

    const phieuGiaHan = await ThanhToanGiaHan_Bus.taoThanhToanGiaHan({maPhieuGiaHan, trangThai, soTien, ngayThanhToan});

    return res.status(200).json({
      success: true,
      message: "Tạo thanh toán gia hạn thành công!",
      data: phieuGiaHan,
    });
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán gia hạn:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo thanh toán gia hạn!",
    });
  }
});

// Tim kiem
router.post('/tim-kiem-phieu-gia-han', isAuthenticated, hasRole("Kế toán"), async (req, res) => {
  const { tuKhoa } = req.body;
  try {
    const danhSachPhieuGiaHan = await GiaHanBUS.timKiemPhieuGiaHan(tuKhoa);
    res.render('MH_LapThanhToanGiaHan', {
        danhSachPhieuGiaHan,
      tuKhoa,
      user: req.session.user
    });
  } catch (error) {
    console.error('Lỗi tìm kiếm phiếu gia hạn:', error);
    res.render('error', {
      message: 'Lỗi tìm kiếm phiếu gia hạn',
      error
    });
  }
});

// API lấy danh sách phiếu gia hạn dưới dạng JSON
router.get("/api/phieu-gia-han", isAuthenticated, hasRole("Kế toán"), async (req, res) => {
  try {
    const danhSachPhieuGiaHan = await GiaHanBUS.layDanhSachPhieuGiaHan();
    res.status(200).json({
      success: true,
      data: danhSachPhieuGiaHan,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phiếu gia hạn:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải danh sách phiếu gia hạn",
    });
  }
});


module.exports = router;
