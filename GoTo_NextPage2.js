const express = require('express');
const mysql = require('mysql2');
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

// نقطة النهاية لتحديث accept_to_go
router.post('/', (req, res) => {
  const { user_id } = req.body; // الحصول على user_id من الجسم (body)

  // التأكد من وجود user_id
  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: 'user_id is required'
    });
  }

  // استعلام تحديث قيمة accept_to_go
  const query = 'UPDATE page1 SET accept_to_go = true WHERE user_id = ?';

  // تنفيذ استعلام قاعدة البيانات لتحديث قيمة accept_to_go
  db.execute(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating accept_to_go',
        error: err.message
      });
    }

    // التحقق من تأثر السجل
    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // إرسال استجابة بنجاح
    res.status(200).json({
      success: true,
      message: 'accept_to_go updated successfully'
    });
  });
});

module.exports = router;
