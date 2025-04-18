const express = require("express");
const router = express.Router();
const PhieuDuThi_Bus = require("../bus/PhieuDuThi_Bus");
const { isAuthenticated, hasRole } = require("../middleware/auth");

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

module.exports = router;