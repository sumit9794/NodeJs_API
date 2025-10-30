const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateSession } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create a new project

//router.post('/create', authenticateSession, projectController.createProject);
router.post('/create',authenticateSession,upload.single('thumbnail'),projectController.createProject);

// Get all projects for the logged-in user
router.get('/', authenticateSession, projectController.getProjects);

// Get a single project by ID
router.get('/:id', authenticateSession, projectController.getProjectById);

// Update a project
router.put('/:id', authenticateSession, projectController.updateProject);

// Delete a project
router.delete('/:id', authenticateSession, projectController.deleteProject);

module.exports = router;
