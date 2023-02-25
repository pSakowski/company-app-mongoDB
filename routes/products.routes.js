const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

const Product = require('../models/product.model');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Get a random products
router.get('/products/random', async (req, res) => {
  try {
    const data = await Product.aggregate([{ $sample: { size: 1 } }]);
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
    const data = await Product.findById(id);
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
    const product = new Product({ name, client });
    await product.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, client },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
