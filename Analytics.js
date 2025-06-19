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

// نقطة النهاية الخاصة بالتحليلات
router.get('/', (req, res) => {
  // استعلامات MySQL للثلاثة تحليلات:
  const totalVisitorsQuery = `SELECT COUNT(DISTINCT ip) AS total_visitors FROM users`;
  const visitorsByCountryQuery = `
    SELECT country, COUNT(DISTINCT ip) AS unique_visitors, GROUP_CONCAT(DISTINCT ip) AS ip_addresses
    FROM users
    GROUP BY country
  `;
  const duplicateVisitorsQuery = `
    SELECT ip, COUNT(*) AS visit_count
    FROM users
    GROUP BY ip
    HAVING visit_count > 1
  `;

  // تنفيذ الاستعلامات
  db.execute(totalVisitorsQuery, (err, totalVisitorsResult) => {
    if (err) {
      console.error('Error in total visitors query:', err);
      return res.status(500).json({ error: 'Error fetching total visitors' });
    }

    db.execute(visitorsByCountryQuery, (err, visitorsByCountryResult) => {
      if (err) {
        console.error('Error in visitors by country query:', err);
        return res.status(500).json({ error: 'Error fetching visitors by country' });
      }

      db.execute(duplicateVisitorsQuery, (err, duplicateVisitorsResult) => {
        if (err) {
          console.error('Error in duplicate visitors query:', err);
          return res.status(500).json({ error: 'Error fetching duplicate visitors' });
        }

        // دمج جميع النتائج في استجابة واحدة
        const analyticsData = {
          total_visitors: totalVisitorsResult[0].total_visitors,
          visitors_by_country: visitorsByCountryResult,
          duplicate_visitors: duplicateVisitorsResult
        };

        // إرجاع البيانات بشكل JSON
        res.status(200).json(analyticsData);
      });
    });
  });
});

module.exports = router;
