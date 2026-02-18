const mongoose = require('mongoose');
require('dotenv').config();
const Profile = require('../models/Profile');

const updateProfile = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for update...');

        // Update all profiles with the new title
        const result = await Profile.updateMany({}, {
            $set: {
                title: 'Full Stack Web Developer'
            }
        });

        console.log(`Updated ${result.modifiedCount} profiles.`);
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
};

updateProfile();
