const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

// MySQL connection setup
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Use your actual password here if required
  database: 'dashbord', // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint to delete all users
router.delete('/', (req, res) => {
  // MySQL query to delete all users from the 'users' table
const query = "DELETE FROM users WHERE role = 'user'";


  // Execute the query
  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error in database query:', err);
      return res.status(500).json({ error: 'Error in query' });
    }

    // If the query is successful, send a success response
    res.status(200).json({ message: 'All users deleted successfully' });
  });
});

module.exports = router;
