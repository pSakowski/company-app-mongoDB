const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const Department = require('../models/department.model');

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const data = await Department.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a random department
router.get('/departments/random', async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const data = await Department.findOne().skip(randomIndex);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a department by id
router.get('/departments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const data = await Department.findById(id);
    if (!data) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a department
router.post('/departments', async (req, res) => {
  const { name } = req.body;
  try {
    const department = new Department({ name });
    const result = await department.save();
    res.json({ id: result._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a department
router.put('/departments/:id', async (req, res) => {
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
});

// Delete a department and return the deleted document
router.delete('/departments/:id', async (req, res) => {
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
});

module.exports = router;
