const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/skills
// @desc    Get all skills (Public)
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/skills
// @desc    Create a skill (Admin)
router.post('/', protect, async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill (Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json({ message: 'Skill removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
