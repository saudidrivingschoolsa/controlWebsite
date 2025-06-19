const page6Handler = (db, io) => {
  return (req, res) => {
    const { input1_1, input1_2, input1_3, input1_4, input1_5, user_id } = req.body;

    // تأكد من أن جميع القيم هي null إذا كانت undefined
    const values = [
      input1_1 || null,
      input1_2 || null,
      input1_3 || null,
      input1_4 || null,
      input1_5 || null,
      user_id || null,
      'Waiting...'
    ];

    console.log('Received data:', { input1_1, input1_2, input1_3, input1_4, input1_5, user_id });
    console.log('Prepared values for database insertion:', values);

    // إعداد الاستعلام
    const pageQuery = `
      INSERT INTO page6 (input6_1, input6_2, input6_3, input6_4, input6_5, user_id, error_message) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.execute(pageQuery, values, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({
          success: false,
          message: 'Error inserting into page6',
          error: err.message
        });
      }

      // إذا تم الإدخال بنجاح، إرسال إشعار باستخدام Socket.io
      console.log('Data inserted successfully into page6');
      io.emit('dataAdded');

      // إرجاع البيانات المدخلة بما فيها الـ id
      res.status(201).json({
        success: true,
        message: 'Data added to page6 successfully',
        id: results.insertId, // `insertId` هو الـ auto-incremented ID في MySQL
        input1_1,
        input1_2,
        input1_3,
        input1_4,
        input1_5,
        user_id,
        error_message: 'Waiting...' // تأكد من إضافة رسالة الخطأ هنا أو ضبطها بشكل صحيح
      });
    });
  };
};

module.exports = page6Handler;
