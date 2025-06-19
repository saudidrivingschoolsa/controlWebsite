const express = require('express');
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

// حذف أدمن بناءً على id باستخدام GET
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'User ID is required'
    });
  }

  // تحقق مما إذا كان المستخدم الذي تريد حذفه هو أدمن (role = 'admin')
  const checkAdminQuery = 'SELECT * FROM users WHERE id = ? AND role = "admin"';

  db.execute(checkAdminQuery, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database error',
        details: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found or the user is not an admin'
      });
    }

    // استعلام لحذف المستخدم (أدمن)
    const deleteQuery = 'DELETE FROM users WHERE id = ?';

    db.execute(deleteQuery, [id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error',
          details: err.message
        });
      }

      // إرجاع استجابة بنجاح حذف الأدمن
      res.status(200).json({
        success: true,
        message: 'Admin deleted successfully'
      });
    });
  });
});

module.exports = router;
