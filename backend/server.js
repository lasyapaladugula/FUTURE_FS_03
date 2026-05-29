const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// lowdb v1 usage
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
app.use(cors());
app.use(express.json());

const dbFile = path.join(__dirname, 'db.json');
const adapter = new FileSync(dbFile);
const db = low(adapter);

// Set defaults
db.defaults({ users: [], messages: [] }).write();

// Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const emailLower = email.toLowerCase();
  const existing = db.get('users').find({ email: emailLower }).value();
  if (existing) return res.status(409).json({ error: 'Account already exists' });
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = { id: Date.now(), name: name || '', email: emailLower, password: hash };
  db.get('users').push(user).write();
  const { password: _p, ...safe } = user;
  res.json({ user: safe });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const emailLower = email.toLowerCase();
  const user = db.get('users').find({ email: emailLower }).value();
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const { password: _p, ...safe } = user;
  res.json({ user: safe });
});

// Contact messages
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
  const entry = { id: Date.now(), name, email, message, createdAt: new Date().toISOString() };
  db.get('messages').push(entry).write();
  res.json({ ok: true });
});

// Simple endpoint to list users (for testing only)
app.get('/api/users', (req, res) => {
  const users = db.get('users').map(u => ({ id: u.id, name: u.name, email: u.email })).value();
  res.json({ users });
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log(`Backend running on http://localhost:${port}`));
