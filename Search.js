const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // أدخل كلمة المرور إذا كانت موجودة
  database: 'dashbord', // اسم قاعدة البيانات
});

router.get('/', async (req, res) => {
  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const searchValue = `%${searchTerm.trim()}%`;  // إزالة الفراغات الزائدة من البحث وإضافة الـ wildcard

  // الاستعلام للبحث في 16 عمودًا
  const query = `
    SELECT *
    FROM users
    WHERE TRIM(CAST(id AS CHAR)) LIKE ? 
    OR TRIM(CAST(socet_id AS CHAR)) LIKE ?
    OR TRIM(F_name) LIKE ?
    OR TRIM(S_name) LIKE ?
    OR TRIM(T_name) LIKE ?
    OR TRIM(L_name) LIKE ?
    OR TRIM(Role) LIKE ?
    OR TRIM(ip) LIKE ?
    OR TRIM(active_Page) LIKE ?
    OR TRIM(CAST(block AS CHAR)) LIKE ?
    OR TRIM(User_Selected_color) LIKE ?
    OR TRIM(country) LIKE ?
    OR TRIM(stats) LIKE ?
    OR TRIM(sound) LIKE ?
    OR TRIM(CAST(page_id AS CHAR)) LIKE ?
    OR TRIM(CAST(card_id AS CHAR)) LIKE ?`;

  try {
    // إرسال البحث باستخدام معاملة واحدة
    const [rows] = await db.promise().execute(query, [
      searchValue, searchValue, searchValue, searchValue, searchValue,
      searchValue, searchValue, searchValue, searchValue, searchValue,
      searchValue, searchValue, searchValue, searchValue, searchValue,
      searchValue
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error executing query:', err.message); // طباعة رسالة الخطأ
    return res.status(500).json({ error: 'Error executing query', details: err.message }); // إرسال التفاصيل في الاستجابة
  }
});

module.exports = router;
