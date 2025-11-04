const Project = require("../models/Projects");

// ✅ Create a new project
const createProject = async (req, res) => {
  try {
    const user_id = req.session.userId ?? null;
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const name = req.body?.name?.trim() ?? null;
    const description = req.body?.description?.trim() ?? null;
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const projectData = {
      name,
      description,
      image: thumbnail ?? null,
      user_id,
    };

    const project = await Project.createProject(projectData);

    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ error: "Error creating project", message: err.message });
  }
};

// ✅ Get all projects (with pagination)
const getProjects = async (req, res) => {
  try {
    const user_id = req.session?.userId ?? null;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const data = await Project.getProjects(user_id, page, limit);
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects", message: err.message });
  }
};

// ✅ Get a single project
const getProjectById = async (req, res) => {
  try {
    const user_id = req.session?.userId ?? null;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const project = await Project.getById(req.params.id, user_id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ project });
  } catch (err) {
    console.error("❌ Error fetching project:", err);
    res.status(500).json({ message: "Error fetching project", error: err.message });
  }
};

// ✅ Update project
const updateProject = async (req, res) => {
  try {
    const user_id = req.session?.userId ?? null;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const projectId = req.params.id;
    const name = req.body?.name?.trim();
    const description = req.body?.description?.trim();
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const updateData = { name, description };
    if (thumbnail) updateData.image = thumbnail;

    const updatedProject = await Project.updateProject(projectId, updateData, user_id);
    if (!updatedProject)
      return res.status(404).json({ message: "Project not found or unauthorized" });

    res.json({ message: "Project updated successfully", project: updatedProject });
  } catch (err) {
    console.error("❌ Error updating project:", err);
    res.status(500).json({ message: "Error updating project", error: err.message });
  }
};

// ✅ Search projects
const searchProjects = async (req, res) => {
  try {
    const user_id = req.session?.userId ?? null;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const { search = "", page = 1, limit = 4 } = req.query;
    const data = await Project.searchProjects(user_id, search, parseInt(page), parseInt(limit));
    res.json(data);
  } catch (err) {
    console.error("❌ Error searching projects:", err);
    res.status(500).json({ error: "Failed to search projects", message: err.message });
  }
};

// ✅ Delete project
const deleteProject = async (req, res) => {
  try {
    const user_id = req.session?.userId ?? null;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const result = await Project.deleteProject(req.params.id, user_id);
    if (!result || result.deletedCount === 0)
      return res.status(404).json({ message: "Project not found or unauthorized to delete" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting project:", err);
    res.status(500).json({ message: "Error deleting project", error: err.message });
  }
};

// ✅ Export all methods
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  searchProjects,
  deleteProject,
};
