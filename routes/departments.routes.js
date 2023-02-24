const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const data = await req.db.collection('departments').find().toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a random department
router.get('/departments/random', async (req, res) => {
  try {
    const data = await req.db.collection('departments').aggregate([{ $sample: { size: 1 } }]).toArray();
    res.json(data[0]);
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
    const data = await req.db.collection('departments').findOne({ _id: new ObjectId(id) });
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
    const result = await req.db.collection('departments').insertOne({ name });
    res.json({ id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a department
router.put('/departments/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await req.db.collection('departments').updateOne({ _id: ObjectId(req.params.id) }, { $set: { name } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a department
router.delete('/departments/:id', async (req, res) => {
  try {
    const result = await req.db.collection('departments').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
