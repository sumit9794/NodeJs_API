const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup (allow frontend to send cookies)
const allowedOrigins = [
  'http://localhost:3000',               // for local dev
  'https://react-js-code-api.vercel.app' // your deployed React app
];

app.use(
  cors({
    origin: function (origin, callback) {
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

// ✅ MongoDB Connection
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

// ✅ Session Middleware (Mongo store)
app.set('trust proxy', 1); // needed for secure cookies on Render

app.use(
  session({
    name: 'sid',
    secret: 'supersecret', // change this to env var in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      secure: true,        // true since Render uses HTTPS
      sameSite: 'none',    // must be 'none' for cross-domain cookies (Vercel → Render)
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// ✅ Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/', userRoutes);

// ✅ Root check
app.get('/', (req, res) => {
  res.send('🚀 Node API is running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
