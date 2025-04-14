const express = require("express");
const router = express.Router();
const ExampleBUS = require("../bus/ExampleBUS");

router.get("/", async (req, res) => {
  const danhSach = await ExampleBUS.layDanhSachKhachHang();
  res.render("home", { danhSach });
});

module.exports = router;