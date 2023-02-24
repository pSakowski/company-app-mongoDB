const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await req.db.collection('products').find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Get a random products
router.get('/products/random', async (req, res) => {
  try {
    const data = await req.db.collection('products').aggregate([{ $sample: { size: 1 } }]).toArray();
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a products by id
router.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const data = await req.db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!data) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json({ id: data._id, name: data.name });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Create a products
router.post('/products', async (req, res) => {
  const { name, client } = req.body;
  try {
    const result = await req.db.collection('products').insertOne({ name, client });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Update a products
router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const result = await req.db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: { name, client } });
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json({ message: 'OK' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Delete a products
router.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const result = await req.db.collection('products').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json({ message: 'OK' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
