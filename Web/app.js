const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { poolPromise } = require('./db'); // Import database connection pool
const app = express();

// Tạo instance handlebars với các helpers
const hbs = exphbs.create({
  extname: 'hbs',  // Phần mở rộng là .hbs
  defaultLayout: 'main',  // Chỉ định layout chính là main.hbs
  layoutsDir: path.join(__dirname, 'frontend/views/layouts'),  // Đảm bảo đúng thư mục layouts
  partialsDir: path.join(__dirname, 'frontend/views/components'),  // Đảm bảo đúng thư mục components
  helpers: {
    formatDate: function(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    eq: function(a, b) {
      return a === b;
    }
  }
});

app.engine('hbs', hbs.engine);

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
app.listen(PORT, async () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  
  try {
    await poolPromise;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
  }
});