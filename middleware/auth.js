// middleware/auth.js
function authenticateSession(req, res, next) {
  console.log('🟢 Incoming request to protected route');
  console.log('Session object:', req.session); // check the session
  console.log('Cookies:', req.cookies);       // check cookies sent by frontend

  if (req.session && req.session.userId) {
    console.log('✅ Session found, user is logged in:', req.session.userId);
    req.user = { id: req.session.userId }; // attach session user info
    return next();
  }

  console.log('❌ Access denied, no session user found');
  return res.status(401).json({ message: 'Access denied. Please log in.' });
}

module.exports = authenticateSession;






// middleware/auth.js
// const authenticateSession = (req, res, next) => {
//   if (!req.session || !req.session.userId) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   console.log(`Authenticated session for userId: ${req.session.userId}`); // Debugging session
//   next(); // Proceed to the next middleware or controller
// };

// module.exports = authenticateSession;

