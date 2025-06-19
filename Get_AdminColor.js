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

// نقطة النهاية لاسترجاع Admin_Color للمستخدم بناءً على Role و id
router.get('/', (req, res) => {
  const { id } = req.query;  // استلام id من الاستعلام

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  // استعلام MySQL للحصول على Admin_Color بناءً على role و id
  const query = `
    SELECT Admin_Color 
    FROM users 
    WHERE Role = 'admin' AND id = ?;
  `;

  // تنفيذ استعلام قاعدة البيانات مع تجنب هجمات SQL injection باستخدام ?
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err.stack); // طباعة تفاصيل الخطأ
      return res.status(500).json({ error: 'خطأ في استعلام قاعدة البيانات', details: err.message });
    }

    // التحقق من وجود نتيجة
    if (results.length === 0) {
      return res.status(404).json({ error: 'No admin found with the specified id' });
    }

    // إرجاع اللون في الاستجابة
    res.status(200).json({ Admin_Color: results[0].Admin_Color });
  });
});

module.exports = router;
