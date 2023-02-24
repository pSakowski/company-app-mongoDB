const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/departments', (req, res) => {
  req.db.collection('departments').find().toArray((err, data) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    res.json(data);
  });
});

router.get('/departments/random', (req, res) => {
  req.db.collection('departments').aggregate([{ $sample: { size: 1 } }]).toArray((err, data) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    res.json(data[0]);
  });
});

router.get('/departments/:id', (req, res) => {
  req.db.collection('departments').findOne({ _id: ObjectId(req.params.id) }, (err, data) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (!data) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(data);
  });
});

router.post('/departments', (req, res) => {
  const { name } = req.body;
  req.db.collection('departments').insertOne({ name }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    res.json({ message: 'OK' });
  });
});

router.put('/departments/:id', (req, res) => {
  const { name } = req.body;
  req.db.collection('departments').updateOne({ _id: ObjectId(req.params.id) }, { $set: { name } }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    res.json({ message: 'OK' });
  });
});

router.delete('/departments/:id', (req, res) => {
  req.db.collection('departments').deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    res.json({ message: 'OK' });
  });
});

module.exports = router;
