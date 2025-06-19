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

// استعلام GET لعرض جميع الرسائل
router.get('/', (req, res) => {
  const query = 'SELECT id, message, time FROM errormessages';

  db.execute(query, (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err);
      return res.status(500).json({ error: 'خطأ في استعلام قاعدة البيانات' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No messages found' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;  // تصدير الـ router لاستخدامه في الملف الرئيسي
