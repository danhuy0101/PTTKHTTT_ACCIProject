const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();

// Cấu hình express-handlebars với layout
app.engine('hbs', exphbs.engine({
  extname: 'hbs',  // Phần mở rộng là .hbs
  defaultLayout: 'main',  // Chỉ định layout chính là main.hbs
  layoutsDir: path.join(__dirname, 'frontend/views/layouts'),  // Đảm bảo đúng thư mục layouts
  partialsDir: path.join(__dirname, 'frontend/views/components'),  // Đảm bảo đúng thư mục components
}));

// Thiết lập view engine và views
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'frontend/views'));  // Đảm bảo đúng thư mục views

// Cấu hình Express để phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'frontend/public')));

// Cấu hình Express để phục vụ các file tĩnh từ frontend/styles
app.use('/styles', express.static(path.join(__dirname, 'frontend/styles')));

// Cấu hình middleware để xử lý URL-encoded và JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Router
const mainRouter = require('./backend/routes/index');
app.use('/', mainRouter);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});