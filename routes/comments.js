const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a task
router.get('/task/:taskId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      taskId: req.params.taskId 
    }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new comment
router.post('/', async (req, res) => {
  const comment = new Comment(req.body);
  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete comment
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
