const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(helmet()); // Tăng cường bảo mật (headers)【12†L169-L177】【12†L198-L207】
app.use(cors());   // Thiết lập CORS (Access-Control-Allow-Origin: *)【10†L92-L100】

// Parse dữ liệu từ form (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Phục vụ file tĩnh
app.use(express.static(path.join(__dirname)));

// Route xử lý POST từ form liên hệ
app.post('/contact', (req, res) => {
  const { name, email, phone, message, honey } = req.body;
  // Spam protection: nếu honeypot có giá trị -> nghi spam
  if (honey) {
    return res.status(400).send('Không hợp lệ');
  }
  // Validate cơ bản
  if (!name || !email) {
    return res.status(400).send('Vui lòng cung cấp tên và email');
  }
  // Đọc file JSON lưu leads
  let leads = [];
  try {
    leads = JSON.parse(fs.readFileSync('leads.json'));
  } catch (err) {
    leads = [];
  }
  // Thêm lead mới
  leads.push({ name, email, phone, message, date: new Date().toISOString() });
  fs.writeFileSync('leads.json', JSON.stringify(leads, null, 2));
  // Có thể thêm lưu vào SQLite ở đây nếu cần (giống ví dụ trên, nhưng không bắt buộc)
  // Sau khi lưu, chuyển hướng (hoặc trả về trang cảm ơn)
  res.send("Gửi thành công!");
});

// Chạy server trên cổng 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server lắng nghe tại http://localhost:${PORT}`));

