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
  const { F_name, PASSWORD, Admin_Color } = req.body;  // لا نحتاج لـ Role هنا

  // تحقق من الحقول المطلوبة
  if (!F_name || !PASSWORD || !Admin_Color) {  // تأكد من أن الحقول المطلوبة موجودة
    return res.status(400).json({ 
      success: false,
      error: 'F_name, PASSWORD, and Admin_Color are required' 
    });
  }

  // تعيين Role إلى "Admin" بشكل افتراضي
  const Role = 'Admin';

  // استعلام لإضافة المستخدم الجديد إلى قاعدة البيانات
  const query = `
    INSERT INTO users (
      F_name, PASSWORD, Admin_Color, Role  
    ) 
    VALUES (?, ?, ?, ?);
  `;

  db.execute(query, [F_name, PASSWORD, Admin_Color, Role], (err, results) => {
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
      message: 'User added successfully',
      user_id: results.insertId // ID of the newly created user
    });
  });
});

module.exports = router;
