const express = require('express');
const router = express.Router();

const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware');

const generateToken = require('../utils/generateToken');

// @route   POST /api/auth/login
// @desc    Auth admin & get token
router.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body.username);
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/profile
// @desc    Update Admin Profile (Username/Password)
router.put('/profile', protect, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);

        if (admin) {
            admin.username = req.body.username || admin.username;
            if (req.body.password) {
                admin.password = req.body.password;
            }

            const updatedAdmin = await admin.save();

            res.json({
                _id: updatedAdmin._id,
                username: updatedAdmin.username,
                token: generateToken(updatedAdmin._id),
            });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route    GET /api/auth/me
// @desc     Get current admin
router.get('/me', protect, async (req, res) => {
    res.json(req.admin);
});

module.exports = router;
