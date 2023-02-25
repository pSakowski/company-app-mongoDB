const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  departments: { type: String },
});

module.exports = mongoose.model('Employee', employeeSchema);