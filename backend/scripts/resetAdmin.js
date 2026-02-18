const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete existing admin
        await Admin.deleteMany({});
        console.log('Existing admins removed');

        // Create new admin
        const admin = await Admin.create({
            username: 'faiz',
            password: '123456'
        });

        console.log('New Admin Created:');
        console.log(`Username: ${admin.username}`);
        console.log(`Password: 123456`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAdmin();
