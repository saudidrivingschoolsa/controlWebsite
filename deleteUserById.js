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

// نقطة النهاية الخاصة بحذف المستخدم بناءً على user_id
router.delete('/', (req, res) => {
  const { user_id } = req.query;  // استلام user_id من الاستعلام

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  // استعلام MySQL لحذف المستخدم
  const query = `
   DELETE FROM users WHERE id = ?;
  `;

  // استعلام البيانات من قاعدة البيانات باستخدام Pool
  db.execute(query, [user_id], (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err);
      return res.status(500).json({ error: 'خطأ في الاستعلام' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // إرجاع استجابة تفيد بنجاح عملية الحذف
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
