require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// --- Auth middleware ---
function requireAuth(req, res, next) {
  const token = req.cookies.admin_token;
  if (token === process.env.ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// --- API Routes ---

// Submit a lead
app.post('/api/leads', async (req, res) => {
  const { fullName, email, phone, timeline, vin, mileage, modifications, askingPrice } = req.body;

  if (!fullName || !email || !phone || !timeline) {
    return res.status(400).json({ error: 'Name, email, phone, and timeline are required.' });
  }

  try {
    await pool.query(
      `INSERT INTO leads (full_name, email, phone, timeline, vin, mileage, modifications, asking_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [fullName, email, phone, timeline, vin || null, mileage ? parseInt(mileage) : null, modifications || null, askingPrice || null]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error inserting lead:', err);
    res.status(500).json({ error: 'Failed to save lead.' });
  }
});

// Admin login
app.post('/api/login', (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.cookie('admin_token', process.env.ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    return res.json({ success: true });
  }

  res.status(401).json({ error: 'Invalid password.' });
});

// Admin logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

// Check auth status
app.get('/api/auth', requireAuth, (req, res) => {
  res.json({ authenticated: true });
});

// Get all leads (admin only)
app.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads.' });
  }
});

// --- Serve React app in production ---
const clientDist = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.use((req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// --- Start ---
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
