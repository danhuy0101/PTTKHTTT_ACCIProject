const express = require("express");
const router = express.Router();
const ChungChi_Bus = require('../bus/ChungChi_Bus');
const { isAuthenticated, hasRole } = require("./middleware");

// Trang chọn loại khách hàng (Xử lý cấp chứng chỉ) – dành cho Tiếp nhận
router.get("/xu-ly-cap-chung-chi", isAuthenticated, hasRole("Tiếp nhận"), (req, res) => {
  res.render("MH_XuLyCapChungChi_LoaiKH", {
    user: req.session.user,
    layout: "main"
  });
});


// Tự do
router.get('/cap-chung-chi/tu-do', isAuthenticated, hasRole("Tiếp nhận"), async (req, res) => {
  const { maPhieu, maKH } = req.query;
  let danhSach = [];
  let hasResult = false;
  let isSearched = false;

  try {
    if (maPhieu || maKH) {
      isSearched = true;
      danhSach = await ChungChi_Bus.LayDanhSachChungChi(maPhieu, maKH, 'Tự do');
      hasResult = danhSach.length > 0;
    }

    res.render('MH_XuLyTraoChungChi_KHTuDo', {
      layout: 'main',
      user: req.session.user,
      danhSach,
      hasResult,
      isSearched,
      maPhieu,
      maKH
    });
  } catch (err) {
    console.error('❌ Lỗi tìm kiếm chứng chỉ:', err);
    res.render('MH_XuLyTraoChungChi_KHTuDo', {
      layout: 'main',
      user: req.session.user,
      danhSach: [],
      hasResult: false,
      isSearched: true,
      maPhieu,
      maKH,
      error: "Lỗi khi tìm kiếm chứng chỉ!"
    });
  }
});


// Đơn vị
router.get('/cap-chung-chi/don-vi', isAuthenticated, hasRole("Tiếp nhận"), async (req, res) => {
  const { maPhieu, maKH } = req.query;
  let danhSach = [];
  let isSearched = false;
  let hasResult = false;

  try {
    if (maPhieu || maKH) {
      isSearched = true;
      danhSach = await ChungChi_Bus.LayDanhSachChungChi(maPhieu, maKH, 'Đơn vị');
      hasResult = danhSach.length > 0;
    }

    res.render('MH_XuLyTraoChungChi_KHDonVi', {
      layout: 'main',
      user: req.session.user,
      danhSach,
      maPhieu,
      maKH,
      isSearched,
      hasResult
    });
  } catch (err) {
    console.error('❌ Lỗi KH đơn vị:', err);
    res.render('MH_XuLyTraoChungChi_KHDonVi', {
      layout: 'main',
      user: req.session.user,
      danhSach: [],
      isSearched: true,
      hasResult: false,
      maPhieu,
      maKH
    });
  }
});

router.post('/cap-chung-chi/xac-nhan-trao', isAuthenticated, hasRole("Tiếp nhận"), async (req, res) => {
  try {
    const { danhSachMaChungChi } = req.body;
    const result = await ChungChi_Bus.CapNhatTrangThaiChungChi(danhSachMaChungChi);
    res.json(result); 
  } catch (err) {
    console.error("❌ Lỗi xác nhận trao:", err);
    res.status(500).json({ success: false, message: "Lỗi server khi xác nhận chứng chỉ!" });
  }
});


module.exports = router;