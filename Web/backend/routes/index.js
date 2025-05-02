const express = require("express");
const router = express.Router();
const session = require('express-session');
const { isAuthenticated, hasRole } = require("../middleware/auth");
const AuthBUS = require("../bus/AuthBUS");
const LoaiDanhGiaNangLuc_Bus = require("../bus/LoaiDanhGiaNangLuc_Bus");

// Set up session middleware
router.use(session({
  secret: 'acci-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));

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
        error: 'Tên đăng nhập hoặc mật khẩu không đúng!', 
        layout: 'login' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { 
      error: 'Có lỗi xảy ra, vui lòng thử lại sau.', 
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

// Include pages
router.use('/', require('./PhatHanhPhieuDuThi'));
router.use('/', require('./XuLyCapChungChi'));
router.use('/', require('./DangKyDuThi'));
router.use('/', require('./LapPhieuGiaHan'));
router.use('/', require('./LapThanhToanGiaHan'));

module.exports = router;