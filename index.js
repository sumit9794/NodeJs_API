const express = require('express');
const session = require('express-session');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // React app
  credentials: true,
}));

// ✅ Session middleware must come before routes
app.use(session({
  name: 'sid',
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // false for local dev
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60, // 1 hour
  }
}));

app.use('/', userRoutes);
app.use('/uploads', express.static('uploads'));
app.listen(8000, () => console.log('Server running on port 8000'));
