const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS setup (for React frontend)
app.use(
  cors({
    origin: 'http://localhost:3000', // your React app URL
    credentials: true,
  })
);

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/node_api_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};
connectDB();

// ✅ Session middleware (must be before routes)
app.use(
  session({
    name: 'sid',
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set true in production (with HTTPS)
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// ✅ Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ✅ API Routes
app.use('/', userRoutes);

// ✅ Server Listen
const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
