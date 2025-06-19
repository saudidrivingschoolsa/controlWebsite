// الملف: messages.js

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

// استعلام GET لحذف رسالة بواسطة id
router.get('/', (req, res) => {
  const { id } = req.query;  // استلام الـ id من الاستعلام (من الرابط)

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  const query = 'DELETE FROM errormessages WHERE id = ?';

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err);
      return res.status(500).json({ error: 'خطأ في استعلام قاعدة البيانات' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  });
});

module.exports = router;  // تصدير الـ router لاستخدامه في الملف الرئيسي
