const Employee = require('../models/employee.model');

// Get all employee
exports.getAll= async (req, res) => {
    try {
      const employees = await Employee.find().populate('department');
      res.json(employees);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Get a random employee
exports.getRandom = async (req, res) => {
    try {
      const count = await Employee.countDocuments();
      const randomIndex = Math.floor(Math.random() * count);
      const randomEmployee = await Employee.findOne().skip(randomIndex).populate('department');
      res.json(randomEmployee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Get a employee by id
exports.getById = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id).populate('department');
      if (!employee) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json(employee);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid ID' });
    }
  };

// Create a employee
exports.createEmployee = async (req, res) => {
    const { firstName, lastName, department } = req.body;
    try {
      const employee = new Employee({ firstName, lastName, department });
      await employee.save();
      res.json({ message: 'OK' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Update a employee
exports.updatedEmployee = async (req, res) => {
    const { firstName, lastName, department } = req.body;
    try {
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, department },
        { new: true }
      ).populate('department');
      if (!employee) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json({ message: 'OK', employee });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid ID' });
    }
  };

// Delete a employee and return the deleted document
exports.deletedEmployee = async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id).populate('department');
      if (!employee) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json({ message: 'OK', employee });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid ID' });
    }
  };