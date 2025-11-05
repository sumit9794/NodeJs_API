const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const projectController = require('../controllers/projectController');
const authenticateSession = require('../middleware/auth');
const upload = require('../middleware/upload');
const { generateChatResponse, generateImage } = require('../controllers/genaiController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Protected route
router.get('/dashboard', authenticateSession,userController.getUsers);
router.get('/profile', authenticateSession,userController.getProfile);


// Create a new project
//router.post('/projects/create', authenticateSession, projectController.createProject);
router.post(
  '/projects/create',
  authenticateSession, // Make sure user is authenticated
  upload.single('thumbnail'), // This now works
  projectController.createProject
);

// Get all projects for the logged-in user
router.get('/projects', authenticateSession, projectController.getProjects);

// Get a single project by ID
router.get('/projects/edit/:id', authenticateSession, projectController.getProjectById);

// Update a project
router.put('/projects/update/:id', authenticateSession,upload.single('thumbnail'), projectController.updateProject);
// Filter Routes
router.get('/projects/search', authenticateSession,projectController.searchProjects);
// Delete a project
//router.delete('/projects/id', authenticateSession, projectController.deleteProject);
router.delete('/projects/:id', authenticateSession, projectController.deleteProject);

// AI Routes
router.post('genai/chat', authenticateSession, generateChatResponse);
router.post('genai/image', authenticateSession, generateImage);



module.exports = router;
