require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_me';

// -----------------------------
// 1️⃣  MIDDLEWARE
// -----------------------------

app.use(express.json({ limit: '50mb' }));

// ✅ CONFIGURED CORS
const allowedOrigins = [
    'https://faiz-portfolio-bcpk13mdw-syedfaiz052004-9082s-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:5000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// -----------------------------
// 2️⃣ DATABASE CONNECTION
// -----------------------------

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Mongo Error: ${error.message}`);
    }
};

// -----------------------------
// 3️⃣ ROUTES
// -----------------------------

app.get('/', (req, res) => {
    res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);

// -----------------------------
// 7️⃣ LEETCODE PROXY
// -----------------------------

app.get('/api/leetcode/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // ATTEMPT 1: Try the simple open API first
        try {
            const response = await axios.get(
                `https://leetcode-stats-api.herokuapp.com/${username}`,
                { timeout: 5000 } // Short timeout so it fails fast
            );

            if (response.data && response.data.status === 'success') {
                return res.status(200).json(response.data);
            }
        } catch (apiErr) {
            console.log("LeetCode Stats API failed, falling back to direct GraphQL:", apiErr.message);
        }

        // ATTEMPT 2: Fallback to direct LeetCode GraphQL (Extremely Reliable)
        const query = `
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                profile {
                    ranking
                }
                submitStats: submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
            allQuestionsCount {
                difficulty
                count
            }
        }`;

        const gqlResponse = await axios.post(
            'https://leetcode.com/graphql',
            { query, variables: { username } },
            { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        );

        if (!gqlResponse.data || !gqlResponse.data.data.matchedUser) {
            return res.status(404).json({ error: "User not found on LeetCode" });
        }

        const user = gqlResponse.data.data.matchedUser;
        const acStats = user.submitStats.acSubmissionNum;
        const totalQs = gqlResponse.data.data.allQuestionsCount;

        // Extract submissions by difficulty
        const getCount = (diff, arr) => (arr.find(item => item.difficulty === diff) || { count: 0 }).count;

        // Format exactly like the heroku api so the React frontend needs zero changes
        const mappedData = {
            status: "success",
            totalSolved: getCount("All", acStats),
            totalQuestions: getCount("All", totalQs),
            easySolved: getCount("Easy", acStats),
            totalEasy: getCount("Easy", totalQs),
            mediumSolved: getCount("Medium", acStats),
            totalMedium: getCount("Medium", totalQs),
            hardSolved: getCount("Hard", acStats),
            totalHard: getCount("Hard", totalQs),
            ranking: user.profile.ranking || 0
        };

        return res.status(200).json(mappedData);

    } catch (error) {
        console.error("Critical LeetCode proxy failure:", error.message);
        return res.status(500).json({
            error: "All LeetCode fetches failed",
            details: error.message
        });
    }
});

// -----------------------------
// 8️⃣ START SERVER
// -----------------------------

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
