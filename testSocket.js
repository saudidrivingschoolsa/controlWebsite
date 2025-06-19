const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // استيراد مكتبة CORS

// إعداد التطبيق و Socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// تمكين CORS لجميع الطلبات
app.use(cors({
  origin: 'http://localhost:3000', // السماح للعميل في localhost:3000
  methods: ['GET', 'POST'], // السماح بالـ GET و POST
  allowedHeaders: ['Content-Type'],
}));

// عندما يتصل العميل عبر WebSocket
io.on('connection', (socket) => {
  console.log('Socket connected');  // عند الاتصال بالخادم

  // عند قطع الاتصال
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

// بدء الخادم على المنفذ 5001
server.listen(5001, () => {
  console.log('Server is running on http://localhost:5001');
});
