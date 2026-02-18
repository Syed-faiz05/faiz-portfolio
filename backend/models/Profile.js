const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: { type: String, default: 'Syed Faiz' },
    title: { type: String, default: 'Full Stack Web Developer' },
    bio: { type: String, default: 'Full Stack Developer & Junior Data Scientist with a passion for building scalable web applications and data-driven solutions. Specialized in React, Node.js, and Python, I transform complex problems into intuitive, user-centric digital experiences.' },
    resumeUrl: { type: String, default: '' },
    socialLinks: {
        github: { type: String, default: 'https://github.com/Syed-faiz05' },
        linkedin: { type: String, default: 'https://www.linkedin.com/in/syed-faiz-547a2a2a4/' },
        leetcode: { type: String, default: 'https://leetcode.com/u/Syed_Faiz05/' },
        email: { type: String, default: 'syedfaiz052005@gmail.com' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
