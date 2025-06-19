const updateActivePageHandler = (db, io) => {
  return (req, res) => {
    const { user_id, activePage } = req.body; // الحصول على user_id و activePage من الجسم

    // التأكد من وجود البيانات المطلوبة
    if (!user_id || !activePage) {
      return res.status(400).json({
        success: false,
        message: 'Both user_id and activePage are required.'
      });
    }

    console.log('Received data for updating active page:', { user_id, activePage });

    // إعداد الاستعلام لتحديث active_Page بناءً على user_id
    const updateQuery = `
      UPDATE users
      SET active_Page = ?
      WHERE id = ?
    `;

    // تنفيذ استعلام التحديث
    db.execute(updateQuery, [activePage, user_id], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({
          success: false,
          message: 'Error updating active page in users table',
          error: err.message
        });
      }

      // إذا تم التحديث بنجاح، إرسال إشعار باستخدام Socket.io
      console.log('User active page updated successfully');
      io.emit('activePageUpdated', { userId: user_id, activePage });

      // إرسال استجابة بنجاح
      res.status(200).json({
        success: true,
        message: 'User active page updated successfully'
      });
    });
  };
};

module.exports = updateActivePageHandler;
