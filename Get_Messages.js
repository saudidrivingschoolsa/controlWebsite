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

// نقطة النهاية لاسترجاع الرسائل بين المستخدمين (دون تحديد ثابت للمرسل والمستقبل)
router.get('/', (req, res) => {
  const { sender_id, receiver_id } = req.query;  // استلام sender_id و receiver_id من الاستعلام

  if (!sender_id || !receiver_id) {
    return res.status(400).json({ error: 'Both sender_id and receiver_id are required' });
  }

  // استعلام MySQL للحصول على الرسائل بين المرسل والمستقبل المحددين
  const query = `
    SELECT * 
    FROM chat_box 
    WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY timestamp ASC;
  `;

  // تنفيذ استعلام قاعدة البيانات مع تجنب هجمات SQL injection باستخدام ? 
  db.execute(query, [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err.stack); // طباعة تفاصيل الخطأ
      return res.status(500).json({ error: 'خطأ في استعلام قاعدة البيانات', details: err.message });
    }

    // التحقق من وجود رسائل
    if (results.length === 0) {
      // بدلاً من إرجاع خطأ، نرجع استجابة بنجاح مع رسالة إعلامية
      return res.status(200).json({ message: 'No messages found between the specified users' });
    }

    // إرجاع الرسائل في الاستجابة
    res.status(200).json(results);
  });
});

module.exports = router;
