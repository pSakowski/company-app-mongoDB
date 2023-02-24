const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await req.db.collection('employees').find().toArray();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a random employee
router.get('/employees/random', async (req, res) => {
  try {
    const data = await req.db.collection('employees').aggregate([{ $sample: { size: 1 } }]).toArray();
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get an employee by id
router.get('/employees/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  req.db.collection('employees').findOne({ _id: new ObjectId(id) }, (err, data) => {
    if(err) res.status(500).json({ message: err });
    else if(!data) res.status(404).json({ message: 'Not found' });
    else res.json({id: data._id, firstName: data.firstName, lastName: data.lastName});
  });
});

// Create an employee
router.post('/employees', async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    await req.db.collection('employees').insertOne({ firstName, lastName, department });
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
    await req.db.collection('employees').updateOne({ _id: ObjectId(req.params.id) }, { $set: { firstName, lastName, department } });
    res.json({ message: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an employee
router.delete('/employees/:id', async (req, res) => {
  try {
    await req.db.collection('employees').deleteOne({ _id: ObjectId(req.params.id) });
    res.json({ message: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
