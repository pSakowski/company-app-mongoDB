const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

const Employee = require('../models/employee.model');

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a random employee
router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomEmployee = await Employee.findOne().skip(randomIndex);
    res.json(randomEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get an employee by id
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err);
    if (err instanceof ObjectId) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create an employee
router.post('/employees', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const employee = new Employee({ firstName, lastName, department });
    await employee.save();
    res.json({ message: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an employee
router.put('/employees/:id', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, department },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'OK' });
  } catch (err) {
    console.error(err);
    if (err instanceof ObjectId) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'OK' });
  } catch (err) {
    console.error(err);
    if (err instanceof ObjectId) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
