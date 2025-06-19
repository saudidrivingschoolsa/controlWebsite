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

// استعلام POST لإضافة رسالة جديدة
router.post('/', (req, res) => {
  const { message, time } = req.body;  // استلام البيانات من الجسم (body)

  // التحقق من وجود البيانات المطلوبة
  if (!message || !time) {
    return res.status(400).json({ error: 'Message and time are required' });
  }

  const query = 'INSERT INTO errormessages (message, time) VALUES (?, ?)';

  db.execute(query, [message, time], (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err);
      return res.status(500).json({ error: 'خطأ في استعلام قاعدة البيانات' });
    }

    res.status(201).json({ message: 'Message added successfully', id: results.insertId });
  });
});

module.exports = router;  // تصدير الـ router لاستخدامه في الملف الرئيسي
