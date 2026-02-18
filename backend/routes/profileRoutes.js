const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// @route   GET /api/profile
// @desc    Get profile details (Public)
// @access  Public
// @route   GET /api/profile
// @desc    Get profile details (Public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        let profile = await Profile.findOne();

        // Auto-fix: If no profile exists OR it's the old default "My Name", recreate it
        if (!profile || profile.name === 'My Name') {
            if (profile) {
                await Profile.deleteOne({ _id: profile._id });
            }
            // Create new profile using the Schema defaults (which are now Syed Faiz, etc.)
            profile = await Profile.create({});
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
