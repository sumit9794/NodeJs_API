function authenticateSession(req, res, next) {
  console.log('🟢 Incoming request to protected route');
  console.log('Session object:', req.session); // Logs the full session object
  console.log('Cookies:', req.cookies);         // Logs cookies sent by frontend

  // ✅ Check if a valid session user exists
  if (req.session && req.session.userId) {
    console.log('✅ Session found, user is logged in:', req.session.userId);

    // Attach the user ID to the request for downstream handlers
    req.user = { id: req.session.userId };

    return next(); // Proceed to controller or next middleware
  }

  // ❌ No session user found → deny access
  console.log('❌ Access denied, no session user found');
  return res.status(401).json({ message: 'Access denied. Please log in.' });
}

module.exports = authenticateSession;
