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
    const { maphieudangky, mathisinh } = req.body;
    console.log('Mã thí sinh nhận được:', mathisinh);
    console.log('Mã phiếu đăng ký nhận được:', maphieudangky);
    
    if (!maphieudangky || !mathisinh) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin cần thiết để phát hành phiếu dự thi' 
      });
    }
    
    // Create and issue an exam ticket based on both registration ID and candidate ID
    const result = await PhieuDuThi_Bus.LapPhieuDuThi(maphieudangky, parseInt(mathisinh));
    if (result) {
      // Update the status of the newly created ticket
      const updateResult = await PhieuDuThi_Bus.CapNhatTrangThai(result.MAPHIEUDUTHI, 'Đã gửi');
      return res.status(updateResult.success ? 200 : 400).json(updateResult);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Không thể tạo phiếu dự thi'
      });
    }
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


module.exports = router;
