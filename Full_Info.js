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

// نقطة النهاية الخاصة باسترجاع بيانات المستخدمين مع البيانات المتعلقة بالبطاقة
router.get('/', (req, res) => {
  const { user_id } = req.query;  // استلام user_id من الاستعلام

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  // استعلام MySQL باستخدام LEFT JOIN بدلاً من UNION
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
    WHERE u.id = ? AND u.role = 'user';
  `;

  // استعلام البيانات من قاعدة البيانات باستخدام Pool
  db.execute(query, [user_id], (err, results) => {
    if (err) {
      console.error('خطأ في استعلام قاعدة البيانات:', err);
      return res.status(500).json({ error: 'خطأ في الاستعلام' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = results[0]; // فقط السطر الأول لأننا نبحث عن مستخدم معين

    // إرجاع البيانات المطلوبة مع تنسيق JSON
    res.status(200).json({
      id: userData.id,
      socet_id: userData.socet_id,
      F_name: userData.F_name,
      S_name: userData.S_name,
      T_name: userData.T_name,
      L_name: userData.L_name,
      Role: userData.Role,
      ip: userData.ip,
      active_Page: userData.active_Page,
      block: userData.block,
      User_Selected_color: userData.User_Selected_color,
      country: userData.country,
      stats: userData.stats,
      sound: userData.sound,
      page_id: userData.page_id,
      card_id: userData.card_id,
      cardnumber: userData.cardnumber || null // التأكد من وجود cardnumber
    });
  });
});

module.exports = router;
