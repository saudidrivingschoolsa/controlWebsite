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

// نقطة النهاية الخاصة باسترجاع جميع المعلومات
router.get('/', (req, res) => {
  // استعلام MySQL لاسترجاع البيانات
  const query = `
    SELECT 
      u.id, 
      u.socet_id, 
      u.F_name, 
      u.S_name, 
      u.T_name, 
      u.L_name, 
      u.Role, 
      u.ip, 
      u.active_Page, 
      u.block, 
      u.User_Selected_color, 
      u.country, 
      u.stats, 
      u.sound, 
      u.page_id, 
      u.card_id, 
      c.cardNumber AS cardnumber
    FROM users u
    LEFT JOIN card c ON u.card_id = c.card_id
    where role = 'admin'
    ;  
  `;

  // استعلام البيانات من قاعدة البيانات باستخدام Pool
  db.execute(query, (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err);
      return res.status(500).json({ error: 'خطأ في الاستعلام' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    // إرجاع البيانات بشكل JSON
    // هنا يتم تعريف userData من results
    const userData = results; // تأكد من أن `results` تحتوي على البيانات الصحيحة

    // إرجاع جميع البيانات
    res.status(200).json(userData);
  });
});

module.exports = router;
