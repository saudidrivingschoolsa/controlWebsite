const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
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

// نقطة النهاية الخاصة بتسجيل مستخدم جديد (Signup)
router.post('/', (req, res) => {
  const { F_name, PASSWORD } = req.body;

  // تحقق من البيانات المدخلة
  if (!F_name || !PASSWORD) {
    return res.status(400).json({ success: false, message: 'F_name, PASSWORD are required' });
  }

  // تشفير كلمة المرور
  bcrypt.hash(PASSWORD, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Password hashing error:', err);
      return res.status(500).json({ success: false, message: 'Error hashing password' });
    }

    // استعلام لإدخال المستخدم في قاعدة البيانات
    const query = `
      INSERT INTO users (F_name, PASSWORD , role)
      VALUES (?, ?, ?);
    `;
    db.execute(query, [F_name, hashedPassword , 'user'], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Error creating user' });
      }

      res.status(201).json({ success: true, message: 'User created successfully' });
    });
  });
});

module.exports = router;
