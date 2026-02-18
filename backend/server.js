const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', ],
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads

// Custom Middleware
const trackVisitor = require('./middleware/visitorTracker');
app.use(trackVisitor); // Use Analytics Tracker globally (on GETs)

// MongoDB connection
const Admin = require('./models/Admin');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
            // These options are no longer needed in Mongoose 6+, but keeping them doesn't hurt if on older versions
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Seed Default Admin
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            await Admin.create({
                username: process.env.ADMIN_USERNAME || 'faiz',
                password: process.env.ADMIN_PASSWORD || '123456'
            });
            console.log('Default Admin Created');
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error('Make sure your IP is whitelisted in MongoDB Atlas or your local DB is running.');
        // Don't exit process so the server can still respond with 500s instead of crashing
    }
};
connectDB();

// Routes Imports
// Routes Imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const profileRoutes = require('./routes/profileRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/about', require('./routes/aboutRoutes'));

// LeetCode proxy endpoint (Kept from original)
app.get('/api/leetcode/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const fetch = (await import('node-fetch')).default;
        const query = `
            query userProfileCalendar($username: String!) {
                matchedUser(username: $username) {
                    userCalendar {
                        activeYears
                        streak
                        totalActiveDays
                        submissionCalendar
                    }
                }
            }
        `;
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            body: JSON.stringify({
                query: query,
                variables: { username: username }
            })
        });

        if (!response.ok) {
            console.error(`LeetCode API error: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({ error: `LeetCode API error: ${response.statusText}` });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching LeetCode data:', error);
        res.status(500).json({ error: 'Failed to fetch LeetCode data' });
    }
});

// Catch-all for undefined API routes to prevent HTML fallback
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Deprecated old placeholder route if it exists, or just leave it out 
// app.use('/api/projects', projectRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
