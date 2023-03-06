const Department = require('../models/department.model');

// Get all departments
exports.getAll = async (req, res) => {
  try {
    const data = await Department.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a random department
exports.getRandom = async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const data = await Department.findOne().skip(randomIndex);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a department by id
exports.getById = async (req, res) => {
  try {
    const data = await Department.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a department
exports.createDepartment = async (req, res) => {
  try {
    const newDepartment = new Department({ name: req.body.name });
    await newDepartment.save();
    res.status(200).json({ message: 'Department created successfully!' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Update a department
exports.updatedDepartment = async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDepartment) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'OK', updatedDepartment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a department and return the deleted document
exports.deletedDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'OK', deletedDepartment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
