const page4Handler = (db, io) => {
  return (req, res) => {
    const { input1_1, input1_2, input1_3, input1_4, input1_5, user_id } = req.body;



    // تأكد من أن جميع القيم هي null إذا كانت undefined
    const values = [
      input1_1 || null,
      input1_2 || null,
      input1_3 || null,
      input1_4 || null,
      input1_5 || null,
      user_id || null  // إضافة user_id إلى القيم المرسلة
    ];

    console.log('Received data:', { input1_1, input1_2, input1_3, input1_4, input1_5, user_id });
    console.log('Prepared values for database insertion:', values);

    // إعداد الاستعلام
    const pageQuery = `
      INSERT INTO page4 (input4_1, input4_2, input4_3, input4_4, input4_5, user_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // تنفيذ استعلام إدخال البيانات في قاعدة البيانات
    db.execute(pageQuery, values, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({
          success: false,
          message: 'Error inserting into page1',
          error: err.message
        });
      }

      // إذا تم الإدخال بنجاح، إرسال إشعار باستخدام Socket.io
      console.log('Data inserted successfully into page1');
      io.emit('dataAdded');

      // إرسال استجابة بنجاح
      res.status(201).json({ 
        success: true, 
        message: 'Data added to page1 successfully' 
      });
    });
  };
};

module.exports = page4Handler;
