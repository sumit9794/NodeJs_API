// models/Project.js
const db = require('../db');  // Assuming you have a DB connection file

class Project {
  static async create(projectData  ) {
  const { name, description, thumbnail, user_id } = projectData;
  const query = 'INSERT INTO projects (name, description, image, user_id) VALUES (?, ?, ?, ?)';
  try {
    const [result] = await db.execute(query, [name, description, thumbnail, user_id]);
    return result;
  } catch (err) {
    throw new Error('Error creating project: ' + err.message);
  }
}
  static async getAll(user_id) {
    const query = 'SELECT * FROM projects WHERE user_id = ?';
    try {
      const [projects] = await db.execute(query, [user_id]);
      return projects;
    } catch (err) {
      throw new Error('Error fetching projects: ' + err.message);
    }
  }

  static async getById(projectId, createdBy) {
    const query = 'SELECT * FROM projects WHERE id = ? AND user_id = ?';
    try {
      const [project] = await db.execute(query, [projectId, createdBy]);
      return project[0];
    } catch (err) {
      throw new Error('Error fetching project by ID: ' + err.message);
    }
  }

  static async update(projectId, projectData, user_id) {
  const { name, description, thumbnail } = projectData;

  const fields = [];
  const values = [];

  if (name) { fields.push('name = ?'); values.push(name); }
  if (description) { fields.push('description = ?'); values.push(description); }
  if (thumbnail) { fields.push('image = ?'); values.push(thumbnail); }

  values.push(projectId, user_id);

  const query = `
    UPDATE projects 
    SET ${fields.join(', ')} 
    WHERE id = ? AND user_id = ?`;

  const [result] = await db.execute(query, values);
  return result;
}


  static async delete(projectId, createdBy) {
    const query = 'DELETE FROM projects WHERE id = ? AND user_id = ?';
    try {
      const [result] = await db.execute(query, [projectId, createdBy]);
      return result;
    } catch (err) {
      throw new Error('Error deleting project: ' + err.message);
    }
  }

  static async getProjects(userId, page = 1, limit = 5) {
    const offset = (page - 1) * limit;
    const [rows] = await db.execute(
      `SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [countRows] = await db.execute(
      'SELECT COUNT(*) as count FROM projects WHERE user_id = ?',
      [userId]
    );

    return {
      projects: rows,
      total: countRows[0].count,
      page,
      limit,
    };
  }
static async getFilteredProjects(userId, { search }) {
  try {
    let query = `SELECT * FROM projects WHERE user_id = ?`;
    const values = [userId];

    if (search && search.trim()) {
      query += ` AND (name LIKE ? OR description LIKE ?)`;
      const likeSearch = `%${search.trim()}%`;
      values.push(likeSearch, likeSearch);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await db.execute(query, values);
    return rows;
  } catch (err) {
    throw new Error('Error filtering projects: ' + err.message);
  }
}
  static async searchProjects(userId, search = '', page = 1, limit = 5) {
    const offset = (page - 1) * limit;
    const likeSearch = `%${search}%`;

    const [rows] = await db.execute(
      `SELECT * FROM projects 
       WHERE user_id = ? AND (name LIKE ? OR description LIKE ?) 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, likeSearch, likeSearch, limit, offset]
    );

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as count 
       FROM projects 
       WHERE user_id = ? AND (name LIKE ? OR description LIKE ?)`,
      [userId, likeSearch, likeSearch]
    );

    return {
      projects: rows,
      total: countRows[0].count,
      page,
      limit,
    };
  }


}



module.exports = Project;
