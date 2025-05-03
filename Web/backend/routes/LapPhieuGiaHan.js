const express = require("express");
const router = express.Router();
const GiaHanBUS = require("../bus/PhieuGiaHan_Bus");
const PhieuDangKyBUS = require("../bus/PhieuDangKy_Bus");
const { isAuthenticated, hasRole } = require("../middleware/auth");

// Trang lập phiếu gia hạn - chỉ cho kế toán
router.get("/lap-phieu-gia-han", isAuthenticated, hasRole("Kế toán"), async (req, res) => {
  try {
    const danhSachPhieuDangKy = await PhieuDangKyBUS.layDanhSachPhieuDangKyChoGiaHan();

    res.render("MH_LapPhieuGiaHan", {
      danhSachPhieuDangKy,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Lỗi khi tải danh sách phiếu đăng ký:", error);
    res.render("error", {
      message: "Không thể tải danh sách phiếu đăng ký",
      error,
    });
  }
});

// Xử lý lập phiếu gia hạn
router.post("/lap-phieu-gia-han", isAuthenticated, hasRole("Kế toán"), async (req, res) => {
  try {
    const { maPhieuDangKy, truongHop, ngayGiaHan, phiGiaHan, lyDoGiaHan } = req.body;
    console.log('ROUTES');
    console.log(req.body);
    console.log(maPhieuDangKy, truongHop, ngayGiaHan, phiGiaHan, lyDoGiaHan);

    if (!maPhieuDangKy || !truongHop || !ngayGiaHan || !phiGiaHan) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin phiếu gia hạn!",
      });
    }

    // Nếu là 'Đặc biệt' thì lý do bắt buộc
    if (truongHop === "Đặc biệt" && !lyDoGiaHan) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn lý do gia hạn cho trường hợp đặc biệt!",
      });
    }

    const phieuGiaHan = await GiaHanBUS.lapPhieuGiaHan({maPhieuDangKy, truongHop, ngayGiaHan, phiGiaHan, lyDoGiaHan});
    
    return res.status(200).json({
      success: true,
      message: "Tạo phiếu gia hạn thành công!",
      data: phieuGiaHan,
    });
  } catch (error) {
    console.error("Lỗi khi tạo phiếu gia hạn:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo phiếu gia hạn!",
    });
  }
});

// Tim kiem
router.post('/tim-kiem-phieu-dang-ky', isAuthenticated, hasRole("Kế toán"), async (req, res) => {
  const { tuKhoa } = req.body;
  try {
    const danhSachPhieuDangKy = await PhieuDangKyBUS.timKiemPhieuDangKyChoGiaHan(tuKhoa);
    res.render('MH_LapPhieuGiaHan', {
      danhSachPhieuDangKy,
      tuKhoa,
      user: req.session.user
    });
  } catch (error) {
    console.error('Lỗi tìm kiếm phiếu đăng ký:', error);
    res.render('error', {
      message: 'Lỗi tìm kiếm phiếu đăng ký',
      error
    });
  }
});

// API lấy danh sách phiếu đăng ký cho JS
router.get('/api/danh-sach-phieu-dang-ky', isAuthenticated, hasRole("Kế toán"), async (req, res) => {
  try {
    const danhSachPhieuDangKy = await PhieuDangKyBUS.layDanhSachPhieuDangKyChoGiaHan();
    res.json(danhSachPhieuDangKy);
  } catch (error) {
    console.error("Lỗi khi tải danh sách phiếu đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});



module.exports = router;
