const bcrypt = require('bcryptjs');

const signupHandler2 = (db, io) => {
  return (req, res) => {
    const { ip, country, user_session_id, F_name, PASSWORD } = req.body;

    // التحقق من وجود الحقول الأساسية
    if (!F_name || !PASSWORD || !ip || !country || !user_session_id) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // تشفير كلمة المرور
    bcrypt.hash(PASSWORD, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error hashing password' });
      }

      // استعلام لإدخال المستخدم في قاعدة البيانات
      const query = `INSERT INTO users (F_name, PASSWORD, role, stats, block, ip, country, user_session_id , active_Page) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;

      // تنفيذ الاستعلام
      db.execute(query, [F_name, hashedPassword, 'user', 1, 0, ip, country, user_session_id ,'Page1'], (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error creating user' });
        }

        // إرسال إشعار إلى جميع المتصلين عبر Socket.io
        io.emit('userAdded', { F_name });

        // إرسال استجابة بنجاح مع الـ userId الذي تم تعيينه
        res.status(201).json({ success: true, message: 'User created successfully', userId: results.insertId });
      });
    });
  };
};

module.exports = signupHandler2;
