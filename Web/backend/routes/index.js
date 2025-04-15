const express = require("express");
const router = express.Router();
const ExampleBUS = require("../bus/ExampleBUS");

// Route for login page (now the entry point)
router.get("/", (req, res) => {
  res.render("login", { layout: 'login' }); // Use login layout without header/footer
});

// Original home route moved to /home
router.get("/home", async (req, res) => {
  const danhSach = await ExampleBUS.layDanhSachKhachHang();
  res.render("home", { danhSach });
});

// Handle login form submission
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // TODO: Add authentication logic here
  
  // For now, just redirect to home page
  res.redirect("/home");
});

// Contact admin route
router.get("/contact-admin", (req, res) => {
  res.render("contact-admin");
});

module.exports = router;