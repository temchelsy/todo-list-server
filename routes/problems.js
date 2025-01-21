const express = require('express');
const router = express.Router();
const CodingProblem = require('../models/CodingProblem');

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await CodingProblem.find()
      .populate('comments')
      .sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get problems by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const problems = await CodingProblem.find({ 
      platform: req.params.platform.toLowerCase() 
    }).populate('comments');
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new problem
router.post('/', async (req, res) => {
  const problem = new CodingProblem(req.body);
  try {
    const newProblem = await problem.save();
    res.status(201).json(newProblem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update problem
router.patch('/:id', async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (req.body.status) problem.status = req.body.status;
    if (req.body.solution) problem.solution = req.body.solution;
    
    const updatedProblem = await problem.save();
    res.json(updatedProblem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete problem
router.delete('/:id', async (req, res) => {
  try {
    await CodingProblem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
