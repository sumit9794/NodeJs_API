const Project = require('../models/project');

// Create a new project
// exports.createProject = async (req, res) => {
//   try {
//     const { name, description, userId } = req.body;

//     // Validate input
//     if (!name || !description || !userId) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Create the project
//     const newProject = await Project.create({ name, description, user_id: userId });

//     return res.status(201).json(newProject); // Send the created project as the response
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

exports.createProject = async (req, res) => {
  try {
    const user_id = req.session?.userId ?? null; // renamed to match DB

    if (!user_id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const name = req.body?.name?.trim() ?? null;
    const description = req.body?.description?.trim() ?? null;
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const projectData = {
      name,
      description,
      thumbnail: thumbnail ?? null,
      user_id, // match the DB column
    };

    const project = await Project.create(projectData);

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({
      error: 'Error creating project',
      message: err.message,
    });
  }
};


// Get all projects for the logged-in user
// Example: GET /projects?page=1&limit=5
exports.getProjects = async (req, res) => {
  try {
    const userId = req.session.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const data = await Project.getProjects(userId, page, limit);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};


// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const createdBy = req.session.userId;
    console.log(createdBy);

    if (!createdBy) {
      return res.status(400).json({ message: 'User ID is missing or not authenticated' });
    }

    const project = await Project.getById(projectId, createdBy);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (err) {
    console.error('Error fetching project:', err);
    return res.status(500).json({ error: 'Error fetching project', message: err.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const user_id = req.session?.userId ?? null;
    if (!user_id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // Extract text fields and file
    const name = req.body?.name?.trim() ?? null;
    const description = req.body?.description?.trim() ?? null;
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
    // Validate input
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }
    // Prepare update data
    const projectData = { name, description, thumbnail };
    // Call your model’s update method
    const result = await Project.update(projectId, projectData, user_id);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Project not found or you are not authorized to update it',
      });
    }
    res.status(200).json({
      message: 'Project updated successfully',
      project: { id: projectId, ...projectData },
    });
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({
      error: 'Error updating project',
      message: err.message,
    });
  }
};



exports.searchProjects = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { search = '', page = 1, limit = 4 } = req.query;

    const data = await Project.searchProjects(userId, search, parseInt(page), parseInt(limit));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search projects' });
  }
};


// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const createdBy = req.session.userId;

    if (!createdBy) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const result = await Project.delete(projectId, createdBy);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found or you are not authorized to delete it' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
};

