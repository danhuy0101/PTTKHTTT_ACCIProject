const ExampleDAO = require("../dao/exampleDAO");

class ExampleBUS {
  static async layDanhSachKhachHang() {
    return await ExampleDAO.getDanhSachKhachHang();
  }
}

module.exports = ExampleBUS;