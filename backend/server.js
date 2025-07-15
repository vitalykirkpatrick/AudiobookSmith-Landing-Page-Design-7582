// Node.js Express Backend Example
// This is a sample backend server you can deploy to your own server

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Database connection (replace with your preferred database)
// Example with MySQL
const mysql = require('mysql2/promise');

// Example with PostgreSQL
// const { Pool } = require('pg');

// Example with MongoDB
// const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Database connection (MySQL example)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'audiobooksmith'
};

let db;

// Initialize database connection
async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Create database tables
async function createTables() {
  // Users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Audiobook projects table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users_audiobooksmith (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      book_title VARCHAR(255),
      book_genre VARCHAR(100),
      word_count VARCHAR(50),
      plan VARCHAR(50) NOT NULL,
      sample_text TEXT,
      requirements TEXT,
      preferred_voice VARCHAR(100),
      payment_status VARCHAR(50),
      session_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_email (email)
    )
  `);

  // Audiobooks table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS audiobooks_audiobooksmith (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL,
      book_title VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'processing',
      audio_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users_audiobooksmith(email)
    )
  `);

  console.log('Database tables created successfully');
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token.' });
  }
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email, name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, email, name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Here you would typically send an email with reset instructions
    // For now, we'll just return a success message
    
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Database Operations Routes
app.post('/api/db/:table', authenticateToken, async (req, res) => {
  try {
    const { table } = req.params;
    const data = req.body;

    // Validate table name (security measure)
    const allowedTables = ['users_audiobooksmith', 'audiobooks_audiobooksmith'];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    // Build insert query
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const [result] = await db.execute(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
      values
    );

    res.status(201).json({
      message: 'Record created successfully',
      id: result.insertId,
      data: { id: result.insertId, ...data }
    });
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/db/:table', authenticateToken, async (req, res) => {
  try {
    const { table } = req.params;
    const filters = req.query;

    // Validate table name
    const allowedTables = ['users_audiobooksmith', 'audiobooks_audiobooksmith'];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    // Build select query
    let query = `SELECT * FROM ${table}`;
    const values = [];

    if (Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters)
        .filter(key => !['select', 'limit', 'order'].includes(key))
        .map(key => `${key} = ?`)
        .join(' AND ');
      
      if (conditions) {
        query += ` WHERE ${conditions}`;
        values.push(...Object.keys(filters)
          .filter(key => !['select', 'limit', 'order'].includes(key))
          .map(key => filters[key])
        );
      }
    }

    // Add ordering
    if (filters.order) {
      query += ` ORDER BY ${filters.order}`;
    }

    // Add limit
    if (filters.limit) {
      query += ` LIMIT ${parseInt(filters.limit)}`;
    }

    const [rows] = await db.execute(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Select error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/db/:table/upsert', authenticateToken, async (req, res) => {
  try {
    const { table } = req.params;
    const { data, conflictColumn } = req.body;

    // Validate table name
    const allowedTables = ['users_audiobooksmith', 'audiobooks_audiobooksmith'];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    // Build upsert query (MySQL syntax)
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const updateClause = Object.keys(data)
      .map(key => `${key} = VALUES(${key})`)
      .join(', ');
    const values = Object.values(data);

    const [result] = await db.execute(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) 
       ON DUPLICATE KEY UPDATE ${updateClause}`,
      values
    );

    res.json({
      message: 'Record upserted successfully',
      data: { ...data, id: result.insertId || 'updated' }
    });
  } catch (error) {
    console.error('Upsert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File Upload Route
app.post('/api/storage/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});