const express = require('express');
const bcrypt = require('bcrypt'); // لاستخدام bcrypt لتشفير كلمات المرور
const router = express.Router();
const mysql = require('mysql2');

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // أدخل كلمة المرور الخاصة بك إذا كانت هناك
  database: 'dashbord',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// تغيير كلمة المرور
router.post('/', (req, res) => {
  const { id, new_password } = req.body;

  // التحقق من وجود جميع الحقول
  if (!id || !new_password) {
    return res.status(400).json({
      success: false,
      error: 'User ID and new password are required'
    });
  }

  // تشفير كلمة المرور الجديدة باستخدام bcrypt
  bcrypt.hash(new_password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Bcrypt error:', err);
      return res.status(500).json({
        success: false,
        error: 'Error hashing the new password'
      });
    }

    // استعلام لتحديث كلمة المرور في قاعدة البيانات
    const updateQuery = 'UPDATE users SET PASSWORD = ? WHERE id = ?';

    db.execute(updateQuery, [hashedPassword, id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error',
          details: err.message
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    });
  });
});

module.exports = router;
