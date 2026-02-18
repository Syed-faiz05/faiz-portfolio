const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('../models/Profile');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedProfile = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete existing profiles to start clean
        await Profile.deleteMany({});

        const profile = await Profile.create({
            name: 'Syed Faiz',
            title: 'Full Stack Developer & Junior Data Scientist',
            bio: 'I build scalable web applications and data driven solutions using React, Node.js, and Python. Passionate about solving complex problems and creating intuitive user experiences.',
            socialLinks: {
                github: 'https://github.com/Syed-faiz05',
                linkedin: 'https://www.linkedin.com/in/syed-faiz-547a2a2a4/',
                leetcode: 'https://leetcode.com/u/Syed_Faiz05/',
                email: 'syedfaiz052005@gmail.com'
            }
        });

        console.log('Profile Seeded Successfully:');
        console.log(profile);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedProfile();
