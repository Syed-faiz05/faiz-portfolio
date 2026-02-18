const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create new message (Contact Form)
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const newMessage = await Message.create({
            name,
            email,
            subject,
            message
        });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update message status (read/starred)
// @route   PUT /api/messages/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (message) {
            message.read = req.body.read !== undefined ? req.body.read : message.read;
            message.starred = req.body.starred !== undefined ? req.body.starred : message.starred;

            const updatedMessage = await message.save();
            res.json(updatedMessage);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (message) {
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
