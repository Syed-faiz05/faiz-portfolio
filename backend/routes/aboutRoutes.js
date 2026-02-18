const express = require('express');
const router = express.Router();
const TimelineItem = require('../models/TimelineItem');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/about
// @desc    Get all public timeline items (sorted by order)
router.get('/', async (req, res) => {
    try {
        const items = await TimelineItem.find({ isVisible: true }).sort('order');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/about/all
// @desc    Get ALL timeline items (admin, even hidden, sorted)
router.get('/all', protect, async (req, res) => {
    try {
        const items = await TimelineItem.find({}).sort('order');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/about
// @desc    Create a new timeline item (Protected)
router.post('/', protect, async (req, res) => {
    try {
        const newItem = new TimelineItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/about/:id
// @desc    Update a timeline item (Protected)
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedItem = await TimelineItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/about/:id
// @desc    Delete a timeline item (Protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        await TimelineItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Timeline Item Deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
