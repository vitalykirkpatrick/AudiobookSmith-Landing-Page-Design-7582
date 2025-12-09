const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CRITICAL FIX: Enhanced CORS Configuration ---
// This explicitly allows requests from any origin with credentials
app.use(cors({
  origin: true, // Reflects the request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());

// --- File System Setup ---
// Use absolute path ensures we write to the correct location
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at:', uploadsDir);
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
  }
}

// Serve static files so the frontend can display them
app.use('/uploads', express.static(uploadsDir));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'audiobooksmith'
};

let db;

async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    await createTables();
  } catch (error) {
    console.warn('⚠️ Database connection failed. Server running in API-only mode.');
    console.warn('   Error:', error.message);
  }
}

async function createTables() {
  if (!db) return;
  
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users_audiobooksmith (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      book_title VARCHAR(255),
      book_genre VARCHAR(100),
      word_count VARCHAR(50),
      plan VARCHAR(50),
      sample_text TEXT,
      manuscript_url VARCHAR(500),
      requirements TEXT,
      preferred_voice VARCHAR(100),
      payment_status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await db.execute(`
    CREATE TABLE IF NOT EXISTS voice_demos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      voice_id VARCHAR(255) NOT NULL,
      text_hash VARCHAR(255) NOT NULL,
      audio_url VARCHAR(500) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_demo (voice_id, text_hash)
    )
  `);
}

// Helper: Get Base URL
const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`;
};

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'upload-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// --- Routes ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', uploadsDir });
});

app.post('/api/storage/upload', upload.single('file'), (req, res) => {
  console.log('Received upload request');
  try {
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `${getBaseUrl(req)}/uploads/${req.file.filename}`;
    console.log('File uploaded successfully:', fileUrl);
    
    res.json({ 
      message: 'File uploaded successfully', 
      url: fileUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed: ' + error.message });
  }
});

app.post('/api/public/project', async (req, res) => {
  console.log('Received project submission:', req.body.email);
  
  // If DB not connected, just log and succeed (Mock Mode)
  if (!db) {
    console.log('MOCK DB INSERT - DB Not Connected');
    console.log('Data:', req.body);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return res.status(201).json({ message: 'Project submitted (Mock Mode)' });
  }

  try {
    const { email, name, book_title, book_genre, word_count, plan, sample_text, manuscript_url, requirements, preferred_voice, payment_status } = req.body;
    
    await db.execute(
      `INSERT INTO users_audiobooksmith 
      (email, name, book_title, book_genre, word_count, plan, sample_text, manuscript_url, requirements, preferred_voice, payment_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      name=VALUES(name), book_title=VALUES(book_title), manuscript_url=VALUES(manuscript_url)`,
      [email, name, book_title, book_genre, word_count, plan, sample_text, manuscript_url, requirements, preferred_voice, payment_status || 'pending']
    );

    res.status(201).json({ message: 'Project submitted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// Start Server on 0.0.0.0 to ensure external accessibility in container
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving uploads from: ${uploadsDir}`);
  });
});