const express = require("express");
const router = express.Router();
const session = require('express-session');
const AuthBUS = require("../bus/AuthBUS");
const PhieuDuThi_Bus = require("../bus/PhieuDuThi_Bus");
const ThiSinh_Bus = require("../bus/ThiSinh_Bus");
const TrangChu_Bus = require("../bus/TrangChu_Bus");

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
    const { tenThiSinh } = req.body;
    const danhSachPhieu = await PhieuDuThi_Bus.timKiemTheoTen(tenThiSinh);
    
    res.render('MH_LapPhieuDuThi', { 
      danhSachPhieu,
      searchQuery: tenThiSinh,
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
    await PhieuDuThi_Bus.capNhatTrangThaiPhieuDuThi(maPhieuDuThi);
    
    res.redirect('/phat-hanh-phieu-du-thi');
  } catch (error) {
    console.error('Update status error:', error);
    res.render('error', { 
      message: 'Lỗi cập nhật trạng thái phiếu dự thi',
      error: error
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

module.exports = router;