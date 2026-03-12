const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Visitor = require('../models/Visitor');
const Message = require('../models/Message');
const TimelineItem = require('../models/TimelineItem');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard stats (Admin)
router.get('/stats', protect, async (req, res) => {
    try {
        const [
            totalProjects,
            totalSkills,
            totalMessages,
            totalVisitors,
            totalMilestones
        ] = await Promise.all([
            Project.countDocuments(),
            Skill.countDocuments(),
            Message.countDocuments(),
            Visitor.countDocuments(),
            TimelineItem.countDocuments()
        ]);

        // Recent Items
        const latestMessages = await Message.find().sort({ createdAt: -1 }).limit(5);
        const latestProjects = await Project.find().sort({ createdAt: -1 }).limit(5);
        const latestVisitors = await Visitor.find().sort({ timestamp: -1 }).limit(5);

        res.json({
            counts: {
                projects: totalProjects,
                skills: totalSkills,
                messages: totalMessages,
                visitors: totalVisitors,
                milestones: totalMilestones
            },
            recentMessages: latestMessages,
            recentProjects: latestProjects,
            recentVisitors: latestVisitors
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
