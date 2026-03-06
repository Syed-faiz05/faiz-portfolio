const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const jwt = require('jsonwebtoken');
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_fallback_key_123', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/login
// @desc    Auth admin & get token
router.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body.username);
    const { username, password } = req.body;

    try {
        if (username === 'faiz' && password === '1234faiz') {
            res.json({
                _id: 'admin_123',
                username: 'faiz',
                token: generateToken('admin_123'),
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
    // We'll skip profile updating in this simple setup
    res.json({
        _id: 'admin_123',
        username: 'faiz',
        token: generateToken('admin_123'),
    });
});

// @route    GET /api/auth/me
// @desc     Get current admin
router.get('/me', protect, async (req, res) => {
    res.json(req.admin);
});

module.exports = router;
