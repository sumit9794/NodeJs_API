const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Allowed frontend origins (no trailing slash!)
const allowedOrigins = [
  'http://localhost:3000', // for local development
  'https://react-js-code-api.vercel.app', // your deployed React app
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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

// ✅ Session middleware (before routes)
app.use(
  session({
    name: 'sid',
    secret: 'supersecret', // change this to a secure value
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// ✅ Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/', userRoutes);

// ✅ Root check route
app.get('/', (req, res) => {
  res.send('🚀 Node API is running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
