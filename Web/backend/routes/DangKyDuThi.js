const express = require("express");
const router = express.Router();
const { isAuthenticated, hasRole } = require("./middleware");

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
      res.render("MH_DangKyDuThi_KHTuDo", {
        user: req.session.user,
        layout: "main"
      });
    } catch (error) {
      console.error("Lỗi truy cập trang KH tự do:", error);
      res.render("error", {
        layout: "login",
        message: "Không thể truy cập trang đăng ký dự thi - KH tự do."
      });
    }
  });

 module.exports = router;