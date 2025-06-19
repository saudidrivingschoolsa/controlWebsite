const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// إعداد الاتصال بقاعدة البيانات (يجب أن يكون مشتركاً أو يتم استيراده من ملف آخر)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // أدخل كلمة المرور الخاصة بك إذا كانت هناك
  database: 'dashbord',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

router.post('/', (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ 
      success: false,
      error: 'sender_id, receiver_id, and message are required' 
    });
  }

  const query = `
    INSERT INTO chat_box (sender_id, receiver_id, message, timestamp) 
    VALUES (?, ?, ?, NOW());
  `;

  db.execute(query, [sender_id, receiver_id, message], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        details: err.message 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Message sent successfully',
      message_id: results.insertId 
    });
  });
});

module.exports = router;