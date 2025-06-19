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

// نقطة النهاية الخاصة بتحديث حقل block بناءً على user_id
router.get('/', (req, res) => {
  const { user_id } = req.query;  // استلام user_id من الاستعلام (من الرابط)

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  // استعلام MySQL للحصول على قيمة block للمستخدم بناءً على user_id
  const queryGetBlockValue = `
    SELECT block FROM users WHERE id = ?;
  `;

  // استعلام لجلب قيمة block للمستخدم بناءً على user_id الذي تم تمريره
  db.execute(queryGetBlockValue, [user_id], (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err);
      return res.status(500).json({ error: 'خطأ في استعلام قاعدة البيانات' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const blockValue = results[0].block; // القيمة الحالية لـ block للمستخدم

    // استعلام لتحديث حقل block للمستخدم الذي id = user_id باستخدام القيمة المعكوسة
    const updateQuery = `
      UPDATE users
      SET block = ?
      WHERE id = ?;
    `;

    // تنفيذ الاستعلام لتحديث حالة الـ block للمستخدم
    db.execute(updateQuery, [!blockValue, user_id], (err, updateResults) => {
      if (err) {
        console.error('خطأ في استعلام التحديث:', err);
        return res.status(500).json({ error: 'خطأ في استعلام التحديث' });
      }

      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // إرجاع استجابة بنجاح العملية
      res.status(200).json({ message: 'User block status updated successfully' });
    });
  });
});

module.exports = router;
