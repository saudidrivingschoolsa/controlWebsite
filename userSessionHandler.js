// دالة للحصول على userId بناءً على user_session_id
const getUserIdBySessionID = (db, userSessionID, callback) => {
  const query = `SELECT id FROM users WHERE user_session_id = ?`;
  db.execute(query, [userSessionID], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      return callback(null, results[0].id); // إرجاع id إذا تم العثور عليه
    } else {
      return callback(null, null); // إذا لم يتم العثور على الـ user_session_id
    }
  });
};

// دالة للتحقق من صلاحية userId في قاعدة البيانات
const validateUserId = (db, userId, callback) => {
  const query = `SELECT id FROM users WHERE id = ?`;

  db.execute(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null); // إرجاع الخطأ في حال حدوثه
    }

    if (results.length > 0) {
      // إذا وجدنا الـ userId في قاعدة البيانات
      return callback(null, true); // إرجاع true إذا كان موجودًا
    } else {
      // إذا لم نجد الـ userId في قاعدة البيانات
      return callback(null, false); // إرجاع false إذا لم يكن موجودًا
    }
  });
};

module.exports = { getUserIdBySessionID, validateUserId };
