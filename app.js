const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dashbord',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// حالة المستخدمين المتصلين
let usersOnline = {};
const INACTIVITY_TIMEOUT = 30000; // 30 ثانية من عدم النشاط تعتبر غير نشط

// Socket.io events
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('setOnline', (userId) => {
    usersOnline[userId] = {
      socketId: socket.id,
      lastActive: Date.now()
    };

    console.log(`from react ` + userId + '.......');

    const query = 'UPDATE users SET stats = 1 WHERE id = ?';
    db.execute(query, [userId], (err, results) => {
      if (err) {
        console.error('Error updating user status:', err);
      } else {
        console.log(`User with ID ${userId} is now online.`);
        // إرسال التحديث لجميع العملاء
        io.emit('userStatusChanged2', {
          id: userId,
          stats: 1
        });
      }
    });
  });

  socket.on('updateActivity', (userId) => {
    if (usersOnline[userId]) {
      usersOnline[userId].lastActive = Date.now();
    }
  });

  socket.on('updateUserData', (updatedUser) => {
    if (!updatedUser || !updatedUser.id) {
      console.error("Invalid user data received:", updatedUser);
      return;
    }
    io.emit('userDataUpdated', updatedUser);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    const userId = Object.keys(usersOnline).find(id => usersOnline[id].socketId === socket.id);
    if (userId) {
      delete usersOnline[userId];
      const query = 'UPDATE users SET stats = 0 WHERE id = ?';
      db.execute(query, [userId], (err, results) => {
        if (err) {
          console.error('Error updating user status:', err);
        } else {
          console.log(`User with ID ${userId} is now offline.`);
          // إرسال التحديث لجميع العملاء
          io.emit('userStatusChanged2', {
            id: userId,
            stats: 0
          });
        }
      });
    }
  });
});

// فحص النشاط كل 30 ثانية
setInterval(() => {
  const currentTime = Date.now();
  for (const userId in usersOnline) {
    if (currentTime - usersOnline[userId].lastActive > INACTIVITY_TIMEOUT) {
      const query = 'UPDATE users SET stats = 0 WHERE id = ?';
      db.execute(query, [userId], (err, results) => {
        if (err) {
          console.error('Error updating user status:', err);
        } else {
          console.log(`User with ID ${userId} is now offline due to inactivity.`);
          // إرسال التحديث لجميع العملاء
          io.emit('userStatusChanged2', {
            id: userId,
            stats: 0
          });
        }
      });
      delete usersOnline[userId];
    }
  }
}, INACTIVITY_TIMEOUT);






// استيراد جميع المعالجات
const signupHandler = require('./signup');
const { getUserIdBySessionID, validateUserId } = require('./userSessionHandler');
const page1Handler = require('./page1');
const updateActivePageHandler = require('./active_Page');
const Page1_Nav = require('./Page1_Nav');
const Full_info_byUserID = require('./Full_Info');
const Full_info_ToAll = require('./Full_info_ToAll');
const Full_info_ToAdmin = require('./Full_info_ToAdmin');
const Delete_User_Byid = require('./deleteUserById');
const Delete_AllUsers = require('./Delete_AllUsers');
const Block = require('./block');
const Search = require('./Search');
const Analytics = require('./Analytics');
const Get_Messages = require('./Get_Messages');
const sendMessage = require('./sendMessag');
const Add_Admin = require('./Add_Admin');
const Delete_Admin = require('./Delete_Admin');
const Update_Password_Admin = require('./Update_Password_Admin');
const Login = require('./login');
const Add_Error_Messages = require('./Add_Error_Messages');
const Delete_Error_Message = require('./Delete_Error_Message');
const Get_Error_Messages = require('./Get_Error_Messages');
const Get_AdminColor = require('./Get_AdminColor');
const GoTo_NextPage2 = require('./GoTo_NextPage2');



const signupHandler2 = require('./signup2');


app.post('/api/Signup2', (req, res) => signupHandler2(db, io)(req, res));

// تعريف جميع المسارات
app.post('/api/updateActivePage', updateActivePageHandler(db, io));
app.post('/api/Page1_Nav', Page1_Nav(db, io));
app.post('/api/Signup', (req, res) => signupHandler(db, io)(req, res));
app.post('/api/Page1', (req, res) => page1Handler(db, io)(req, res));





const page2Handler = require('./page2');
const page3Handler = require('./page3');
const page4Handler = require('./page4');
const page5Handler = require('./page5');
const page6Handler = require('./page6');


const selectLatestPage6Handler = require('./Get_Error_message_P6');







app.use('/api/selectLatestPage6Handler', selectLatestPage6Handler);



app.post('/api/Page2', (req, res) => page2Handler(db, io)(req, res));
app.post('/api/Page3', (req, res) => page3Handler(db, io)(req, res));
app.post('/api/Page4', (req, res) => page4Handler(db, io)(req, res));
app.post('/api/Page5', (req, res) => page5Handler(db, io)(req, res));

app.post('/api/Page6', (req, res) => page6Handler(db, io)(req, res));








app.use('/api/Full_info_byUserID', Full_info_byUserID);
app.use('/api/Full_info_ToAll', Full_info_ToAll);
app.use('/api/Full_info_ToAdmin', Full_info_ToAdmin);
app.use('/api/deleteUserById', Delete_User_Byid);
app.use('/api/Delete_AllUsers', Delete_AllUsers);
app.use('/api/Block', Block);
app.use('/api/Search', Search);
app.use('/api/Analytics', Analytics);
app.use('/api/Get_Messages', Get_Messages);
app.use('/api/sendMessag', sendMessage);
app.use('/api/Add_Admin', Add_Admin);
app.use('/api/Delete_Admin', Delete_Admin);
app.use('/api/Update_Password_Admin', Update_Password_Admin);
app.use('/api/Login', Login);
app.use('/api/Add_Error_Messages', Add_Error_Messages);
app.use('/api/Delete_Error_Message', Delete_Error_Message);
app.use('/api/Get_Error_Messages', Get_Error_Messages);
app.use('/api/Get_AdminColor', Get_AdminColor);
app.use('/api/GoTo_NextPage2', GoTo_NextPage2);

// API للتحقق من ID باستخدام user_session_id
app.get('/api/getUserIdBySessionID', (req, res) => {
  const { userSessionID } = req.query;

  if (!userSessionID) {
    return res.status(400).json({ success: false, message: 'user_session_id is required' });
  }

  getUserIdBySessionID(db, userSessionID, (err, userId) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching user ID' });
    }

    if (userId) {
      return res.status(200).json({ success: true, userId });
    } else {
      return res.status(404).json({ success: false, message: 'No user found with the given session ID' });
    }
  });
});

// API للتحقق من صلاحية userId
app.get('/api/validateUserId', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  validateUserId(db, userId, (err, isValid) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error validating userId' });
    }

    if (isValid) {
      return res.status(200).json({ success: true, message: 'User ID is valid' });
    } else {
      return res.status(404).json({ success: false, message: 'User ID not found' });
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});