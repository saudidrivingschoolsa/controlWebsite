const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// إعداد الاتصال بقاعدة بيانات MySQL باستخدام Pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // أدخل كلمة المرور الخاصة بك إذا كانت هناك
  database: 'dashbord',  // اسم قاعدة البيانات
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

router.post('/', (req, res) => {
  const { F_name, password } = req.body;

  console.log("Received login data:", req.body); // لطباعة البيانات التي تم استلامها

  // استعلام للتحقق من بيانات المستخدم في قاعدة البيانات
  db.execute("SELECT * FROM users WHERE role = 'admin' AND F_name = ?", [F_name], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const user = results[0];

    // التحقق من كلمة المرور المدخلة
    bcrypt.compare(password, user.PASSWORD, (err, isMatch) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).json({ success: false, message: 'Error comparing password' });
      }

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // إنشاء JWT Token
      const token = jwt.sign({ userId: user.id, role: user.Role }, 'your_jwt_secret', { expiresIn: '1h' });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        userId: user.id,  // إرجاع الـ id مع التوكن
        token: token,  // إرسال التوكن للمستخدم
      });
    });
  });
});

module.exports = router;
