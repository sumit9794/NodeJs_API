const bcrypt = require('bcryptjs');
const User = require('../models/User'); // 👈 your MongoDB model

// ======================
// 🟢 SIGNUP CONTROLLER
// ======================
exports.signup = async (req, res) => {
  const { name, user_name, email, password, role } = req.body;

  // Basic validation
  if (!name || !user_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ user_name }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      user_name,
      email,
      password: hashedPassword,
      role: role || 'User',
      deleted_at: false,
      updated_on: new Date(),
    });

    res.status(201).json({
      message: 'Signup successful',
      userId: newUser._id,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ======================
// 🟢 LOGIN CONTROLLER
// ======================
exports.login = async (req, res) => {
  console.log('🟢 Incoming login request');
  console.log('Session before login:', req.session);

  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password required' });
  }

  try {
    const user = await User.findOne({ user_name });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!req.session) {
      console.error('🚨 req.session is undefined!');
      return res.status(500).json({ message: 'Session not initialized' });
    }

    // Set session userId
    req.session.userId = user._id;

    req.session.save((err) => {
      if (err) {
        console.error('🚨 Session save error:', err);
        return res.status(500).json({ message: 'Failed to save session' });
      }

      console.log('✅ Session after setting userId:', req.session);
      res.json({
        message: 'Login successful',
        userId: user._id,
        role: user.role,
      });
    });
  } catch (err) {
    console.error('🔥 Login route failed:', err);
    res.status(500).json({ error: err.message });
  }
};

// ======================
// 🟢 GET USERS (Dashboard)
// ======================
exports.getUsers = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(req.session.userId).select(
      'name user_name email role'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ======================
// 🟢 PROFILE CONTROLLER
// ======================
exports.getProfile = async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId).select(
      'name user_name email role updated_on'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ======================
// 🟢 LOGOUT CONTROLLER
// ======================
exports.logout = (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: 'No active session' });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }

    // Clear session cookie
    res.clearCookie('sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  });
};
