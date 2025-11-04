const mongoose = require('mongoose');

// Define Project Schema
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    image: {
      type: String, // stores file path (e.g. "/uploads/realestate.jpg")
      default: '',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

//
// ✅ Static Methods for CRUD operations
//
projectSchema.statics = {
  // 🟢 Create a new project
  async createProject(data) {
    try {
      const project = new this(data);
      return await project.save();
    } catch (err) {
      throw new Error(`Error creating project: ${err.message}`);
    }
  },

  // 🟢 Get all projects (with pagination)
  async getProjects(user_id, page = 1, limit = 5) {
    try {
      const skip = (page - 1) * limit;
      const [projects, total] = await Promise.all([
        this.find({ user_id })
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit),
        this.countDocuments({ user_id }),
      ]);
      return { projects, total, page, limit };
    } catch (err) {
      throw new Error(`Error fetching projects: ${err.message}`);
    }
  },

  // 🟢 Get a single project by ID
  async getById(projectId, user_id) {
    try {
      return await this.findOne({ _id: projectId, user_id });
    } catch (err) {
      throw new Error(`Error fetching project: ${err.message}`);
    }
  },

  // 🟢 Update a project
  async updateProject(projectId, data, user_id) {
    try {
      return await this.findOneAndUpdate(
        { _id: projectId, user_id },
        { $set: data },
        { new: true }
      );
    } catch (err) {
      throw new Error(`Error updating project: ${err.message}`);
    }
  },

  // 🟢 Delete a project
  async deleteProject(projectId, user_id) {
    try {
      return await this.findOneAndDelete({ _id: projectId, user_id });
    } catch (err) {
      throw new Error(`Error deleting project: ${err.message}`);
    }
  },

  // 🟢 Search projects by name or description
  async searchProjects(user_id, search = '', page = 1, limit = 5) {
    try {
      const skip = (page - 1) * limit;
      const query = {
        user_id,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };

      const [projects, total] = await Promise.all([
        this.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
        this.countDocuments(query),
      ]);

      return { projects, total, page, limit };
    } catch (err) {
      throw new Error(`Error searching projects: ${err.message}`);
    }
  },
};

// Export model
module.exports = mongoose.model('Projects', projectSchema);
