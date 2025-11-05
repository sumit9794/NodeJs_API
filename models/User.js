const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'User' }, // can be Admin, etc.
  deleted_at: { type: Boolean, default: false },
  updated_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
 