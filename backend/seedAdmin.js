const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
    .then(async () => {
        console.log('MongoDB successfully connected for seeding');

        const adminUsername = process.env.ADMIN_USERNAME || 'faiz';
        const adminPassword = process.env.ADMIN_PASSWORD || '123456';

        const adminExists = await Admin.findOne({ username: adminUsername });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        await Admin.create({
            username: adminUsername,
            password: adminPassword // This will be hashed by the model pre-save hook
        });

        console.log(`Admin user created: ${adminUsername} / [HIDDEN]`);
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
