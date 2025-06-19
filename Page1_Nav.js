const page1Handler = (db, io) => {
  return (req, res) => {
    const { user_id } = req.body; // الحصول على user_id من جسم الطلب (body)

    // التأكد من أن user_id موجود في الطلب
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    // إعداد الاستعلام لاستخراج قيمة accept_to_go
    const query = 'SELECT accept_to_go FROM page1 WHERE user_id = ?';

    // تنفيذ الاستعلام
    db.execute(query, [user_id], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({
          success: false,
          message: 'Error fetching data from page1',
          error: err.message
        });
      }

      // التأكد من وجود النتائج
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found in page1'
        });
      }

      // إرسال النتائج (الـ accept_to_go)
      res.status(200).json({
        success: true,
        message: 'User data fetched successfully',
        accept_to_go: results[0].accept_to_go
      });
    });
  };
};

module.exports = page1Handler;
