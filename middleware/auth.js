function authenticateSession(req, res, next) {
  console.log('🟢 Incoming request to protected route');
  console.log('Session object:', req.session);
  console.log('Cookies:', req.cookies);

  if (req.session && req.session.userId) {
    console.log('✅ Session found, user is logged in:', req.session.userId);
    req.user = { id: req.session.userId };
    return next();
  }

  console.log('❌ Access denied, no session user found');
  return res.status(401).json({ message: 'Access denied. Please log in.' });
}

module.exports = authenticateSession;
