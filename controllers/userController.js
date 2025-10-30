const bcrypt = require('bcryptjs');
const db = require('../db');

exports.signup = async (req, res) => {
  const { name, user_name, email, password } = req.body;

  if (!name || !user_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE user_name = ? OR email = ?',
      [user_name, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, user_name, email, password) VALUES (?, ?, ?, ?)',
      [name, user_name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Signup successful', userId: result.insertId });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Login with sessions
exports.login = async (req, res) => {
  console.log('🟢 Incoming login request');
  console.log('Session before login:', req.session);

  const { user_name, password } = req.body;
  if (!user_name || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_name = ?', [user_name]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    if (!req.session) {
      console.error('🚨 req.session is undefined!');
      return res.status(500).json({ message: 'Session not initialized' });
    }

    // Set session
    req.session.userId = user.id;

    // Save session before sending response
    req.session.save(err => {
      if (err) {
        console.error('🚨 Session save error:', err);
        return res.status(500).json({ message: 'Failed to save session' });
      }
      console.log('✅ Session after setting userId:', req.session);
      res.json({ message: 'Login successful', userId: user.id });
    });

  } catch (err) {
    console.error('🔥 Login route failed:', err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Dashboard route (protected)
exports.getUsers = async (req, res) => {
  // Check if session userId exists, if not return Unauthorized status
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Query the database to get the user matching the session ID
    const [rows] = await db.query(
      'SELECT id, name, user_name, email FROM users WHERE id = ?',
      [req.session.userId]
    );

    // If no user is found, return a 404 with a "User not found" message
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data back as the response with custom name 'user'
    res.json({ user: rows[0] });
  } catch (err) {
    // If an error occurs, return a 500 status with the error message
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.getProfile = async (req, res) => {
  
  const userId = req.session.userId;

  if (!userId) 
    
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Only fetch the user matching the session ID
    const [rows] = await db.query(
      'SELECT id, name, user_name, email FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) 
      return res.status(404).json({ message: 'User not found' });
     
    res.json({ user: rows[0] }); // return the single user object
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Logout
// ✅ Logout Controller
exports.logout = (req, res) => {
  // If session doesn’t exist, user is already logged out
  if (!req.session) {
    return res.status(200).json({ message: 'No active session' });
  }

  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }

    // Clear the session cookie — must match the session cookie name ("sid")
    res.clearCookie('sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  });
};

