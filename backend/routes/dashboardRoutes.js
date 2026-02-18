const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Visitor = require('../models/Visitor'); // Keep visitor stats if valid
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard stats (Admin)
router.get('/stats', protect, async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const totalSkills = await Skill.countDocuments();
        const totalMessages = await Message.countDocuments();

        // Recent Items
        const latestMessages = await Message.find().sort({ createdAt: -1 }).limit(5);
        const latestProjects = await Project.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            counts: {
                projects: totalProjects,
                skills: totalSkills,
                messages: totalMessages
            },
            recentMessages: latestMessages,
            recentProjects: latestProjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
