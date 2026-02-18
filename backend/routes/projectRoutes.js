const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/projects
// @desc    Get all projects (Public)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/projects
// @desc    Create a project (Admin)
router.post('/', protect, async (req, res) => {
    try {
        console.log('--- POST /api/projects ---');
        // Conceal large image data in logs
        const loggedBody = { ...req.body };
        if (loggedBody.images && Array.isArray(loggedBody.images)) loggedBody.images = `Array(${loggedBody.images.length})`;
        if (loggedBody.thumbnail && loggedBody.thumbnail.length > 100) loggedBody.thumbnail = '...thumbnail data...';
        // console.log('Request Body:', loggedBody);

        const { images, tags, technologies, ...otherData } = req.body;

        // Ensure arrays and filter empty strings
        const processedTags = Array.isArray(tags)
            ? tags
            : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

        const processedTechs = Array.isArray(technologies)
            ? technologies
            : (technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

        const projectData = {
            ...otherData,
            images: images || [],
            tags: processedTags,
            technologies: processedTechs
        };

        const project = await Project.create(projectData);
        console.log('Project created successfully:', project._id);
        res.status(201).json(project);
    } catch (error) {
        console.error('Project Create Error:', error);
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update a project (Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.body.tags !== undefined) {
            updateData.tags = Array.isArray(req.body.tags)
                ? req.body.tags
                : (req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
        }
        if (req.body.technologies !== undefined) {
            updateData.technologies = Array.isArray(req.body.technologies)
                ? req.body.technologies
                : (req.body.technologies ? req.body.technologies.split(',').map(t => t.trim()).filter(Boolean) : []);
        }

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
