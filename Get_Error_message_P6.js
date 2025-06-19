const selectLatestPage6Handler = (db) => {
  return (req, res) => {
    const { user_id } = req.body;

    // تأكد من وجود `user_id` في الطلب
    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // إعداد استعلام `SELECT` لاسترجاع آخر قيمة مضافة بناءً على `user_id`
    const selectQuery = `
      SELECT * FROM page6 
      WHERE user_id = ? 
      ORDER BY id DESC 
      LIMIT 1
    `;

    // تنفيذ الاستعلام
    db.execute(selectQuery, [user_id], (err, results) => {
      if (err) {
        console.error('Error executing SELECT query:', err);
        return res.status(500).json({
          success: false,
          message: 'Error fetching latest data from page6',
          error: err.message
        });
      }

      // إذا لم يتم العثور على أي سجل
      if (results.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No data found for this user_id, the table is empty',
        });
      }

      // إرسال الاستجابة مع البيانات
      res.status(200).json({
        success: true,
        message: 'Latest data fetched successfully',
        data: results[0] // إرجاع آخر سجل فقط
      });
    });
  };
};

module.exports = selectLatestPage6Handler;
