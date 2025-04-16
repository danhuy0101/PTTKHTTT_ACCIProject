const express = require("express");
const router = express.Router();
const session = require('express-session');
const AuthBUS = require("../bus/AuthBUS");
const PhieuDuThi_Bus = require("../bus/PhieuDuThi_Bus");
const ThiSinh_Bus = require("../bus/ThiSinh_Bus");
const TrangChu_Bus = require("../bus/TrangChu_Bus");
const ChungChi_Bus = require('../bus/ChungChi_Bus');


// Set up session middleware
router.use(session({
  secret: 'acci-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/');
};

// Middleware to check if user has specific role
const hasRole = (role) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.ROLE === role) {
      return next();
    }
    res.status(403).render('error', { 
      message: 'Bạn không có quyền truy cập trang này',
      layout: 'login'
    });
  };
};

// Route for login page (now the entry point)
router.get("/", (req, res) => {
  if (req.session.user) {
    // If already logged in, redirect to welcome page
    return res.redirect('/welcome');
  }
  res.render("login", { layout: 'login' });
});

// Handle login form submission
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await AuthBUS.authenticate(username, password);
    
    if (result.authenticated) {
      // Store user in session
      req.session.user = result.user;
      return res.redirect('/welcome');
    } else {
      res.render('login', { 
        error: 'Tên đăng nhập hoặc mật khẩu không đúng', 
        layout: 'login' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { 
      error: 'Có lỗi xảy ra, vui lòng thử lại sau', 
      layout: 'login' 
    });
  }
});

// Welcome page after login (MH_TrangChu)
router.get("/welcome", isAuthenticated, (req, res) => {
  res.render('MH_TrangChu', { 
    user: req.session.user,
    layout: 'main'
  });
});

// Exam tickets page - only for "Phát hành" role (MH_LapPhieuDuThi)
router.get("/phat-hanh-phieu-du-thi", isAuthenticated, hasRole("Phát hành"), async (req, res) => {
  try {
    const danhSachPhieu = await PhieuDuThi_Bus.layDanhSachPhieuDuThi();
    res.render('MH_LapPhieuDuThi', { 
      danhSachPhieu,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching exam tickets:', error);
    res.render('error', { 
      message: 'Không thể lấy danh sách phiếu dự thi',
      error: error
    });
  }
});

// Search candidates
router.post("/tim-kiem-thi-sinh", isAuthenticated, hasRole("Phát hành"), async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const danhSachPhieu = await PhieuDuThi_Bus.timKiem(searchQuery);
    
    res.render('MH_LapPhieuDuThi', { 
      danhSachPhieu,
      searchQuery: searchQuery,
      user: req.session.user
    });
  } catch (error) {
    console.error('Search error:', error);
    res.render('error', { 
      message: 'Lỗi tìm kiếm thí sinh',
      error: error
    });
  }
});

// Update ticket status
router.post("/cap-nhat-trang-thai", isAuthenticated, hasRole("Phát hành"), async (req, res) => {
  try {
    const { maPhieuDuThi } = req.body;
    console.log('Mã phiếu dự thi nhận được:', maPhieuDuThi);
    
    if (!maPhieuDuThi) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không tìm thấy mã phiếu dự thi trong yêu cầu' 
      });
    }
    
    const result = await PhieuDuThi_Bus.CapNhatTrangThai(maPhieuDuThi, 'Đã gửi');
    
    // Trả về kết quả dạng JSON
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi cập nhật trạng thái phiếu dự thi' 
    });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

// Contact admin route
router.get("/contact-admin", (req, res) => {
  res.render("contact-admin", { layout: 'login' });
});

// Trang chọn loại khách hàng (Xử lý cấp chứng chỉ) – dành cho Tiếp nhận
router.get("/xu-ly-cap-chung-chi", isAuthenticated, hasRole("Tiếp nhận"), (req, res) => {
  res.render("MH_XuLyCapChungChi_LoaiKH", {
    user: req.session.user,
    layout: "main"
  });
});


router.get('/cap-chung-chi/tu-do', isAuthenticated, hasRole("Tiếp nhận"), async (req, res) => {
  const { maPhieu, maKH, hoTen } = req.query;
  let danhSach = [];
  let hasResult = false;
  let hoTenTuDong = hoTen;
  let isSearched = false;

  try {
    if (maPhieu || maKH || hoTen) {
      isSearched = true;
      danhSach = await ChungChi_Bus.LayDanhSachChungChi(maPhieu, maKH, hoTen);
      hasResult = danhSach.length > 0;

      if (!hoTen && (maPhieu || maKH)) {
        hoTenTuDong = await ChungChi_Bus.LayHoTenKhachHang(maPhieu, maKH);
      }
    }

    res.render('MH_XuLyTraoChungChi_KHTuDo', {
      layout: 'main',
      user: req.session.user,
      danhSach,
      hasResult,
      isSearched,
      maPhieu,
      maKH,
      hoTen: hoTenTuDong
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
      hoTen,
      error: "Lỗi khi tìm kiếm chứng chỉ!"
    });
  }
});

router.get('/lay-ten-khach-hang', async (req, res) => {
  const { maPhieu, maKH } = req.query;
  try {
    const ten = await ChungChi_Bus.LayHoTenKhachHang(maPhieu, maKH);
    res.json({ hoTen: ten });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});


router.post('/cap-chung-chi/xac-nhan-trao', isAuthenticated, hasRole("Tiếp nhận"), async (req, res) => {
  const { danhSachMaChungChi } = req.body;
  if (!danhSachMaChungChi || !Array.isArray(danhSachMaChungChi)) {
    return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
  }

  try {
    const result = await ChungChi_Bus.CapNhatTrangThaiChungChi(danhSachMaChungChi);
    res.json(result);
  } catch (err) {
    console.error('❌ Lỗi xác nhận trao:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.get('/cap-chung-chi/don-vi', isAuthenticated, hasRole("Tiếp nhận"), async (req, res) => {
  const { maPhieu, maKH } = req.query;
  let danhSach = [];
  let isSearched = false;
  let hasResult = false;

  try {
    if (maPhieu || maKH) {
      isSearched = true;
      danhSach = await ChungChi_Bus.LayDanhSachChungChi(maPhieu, maKH, null);
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

module.exports = router;
