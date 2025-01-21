const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  try {
    const newTask = await task.save();
    
    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: task.assignedTo,
      subject: 'New Task Assigned',
      text: `You have been assigned a new task: ${task.title}\nDescription: ${task.description}\nDue Date: ${task.dueDate}`
    };

    transporter.sendMail(mailOptions);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update task status
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (req.body.status) {
      task.status = req.body.status;
      if (req.body.status === 'completed') {
        task.completedAt = new Date();
        
        // Send completion notification
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: task.supervisor,
          subject: 'Task Completed',
          text: `Task "${task.title}" has been marked as completed.\nLink: ${task.link}`
        };
        
        transporter.sendMail(mailOptions);
      }
    }
    if (req.body.link) task.link = req.body.link;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
