const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employees.controller');

router.get('/employees', EmployeeController.getAll);
router.get('/employees/random', EmployeeController.getRandom);
router.get('/employees/:id', EmployeeController.getById);
router.post('/employees', EmployeeController.createEmployee);
router.put('/employees/:id', EmployeeController.updatedEmployee);
router.delete('/employees/:id', EmployeeController.deletedEmployee);

// // Get all employees
// router.get('/employees', async (req, res) => {
//   try {
//     const employees = await Employee.find().populate('department');
//     res.json(employees);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Get a random employee
// router.get('/employees/random', async (req, res) => {
//   try {
//     const count = await Employee.countDocuments();
//     const randomIndex = Math.floor(Math.random() * count);
//     const randomEmployee = await Employee.findOne().skip(randomIndex).populate('department');
//     res.json(randomEmployee);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Get an employee by id
// router.get('/employees/:id', async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id).populate('department');
//     if (!employee) {
//       return res.status(404).json({ message: 'Not found' });
//     }
//     res.json(employee);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: 'Invalid ID' });
//   }
// });

// // Create an employee
// router.post('/employees', async (req, res) => {
//   const { firstName, lastName, department } = req.body;
//   try {
//     const employee = new Employee({ firstName, lastName, department });
//     await employee.save();
//     res.json({ message: 'OK' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Update an employee
// router.put('/employees/:id', async (req, res) => {
//   const { firstName, lastName, department } = req.body;
//   try {
//     const employee = await Employee.findByIdAndUpdate(
//       req.params.id,
//       { firstName, lastName, department },
//       { new: true }
//     ).populate('department');
//     if (!employee) {
//       return res.status(404).json({ message: 'Not found' });
//     }
//     res.json({ message: 'OK', employee });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: 'Invalid ID' });
//   }
// });

// // Delete an employee
// router.delete('/employees/:id', async (req, res) => {
//   try {
//     const employee = await Employee.findByIdAndDelete(req.params.id).populate('department');
//     if (!employee) {
//       return res.status(404).json({ message: 'Not found' });
//     }
//     res.json({ message: 'OK', employee });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: 'Invalid ID' });
//   }
// });

module.exports = router;
