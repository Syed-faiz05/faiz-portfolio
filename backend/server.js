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

// server.js

// 1. Updated whitelist to include your specific Vercel URL
const allowedOrigins = [
    "https://faiz-portfolio-pvij.vercel.app",
    "https://faiz-portfolio-pvij-git-main-syedfaiz052004-9082s-projects.vercel.app",
    "https://faiz-portfolio-sepia.vercel.app",
    "http://localhost:5173"
];

// 2. Updated CORS middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// 3. Handle Preflight Properly
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// -----------------------------
// 2️⃣ DATABASE CONNECTION
// -----------------------------

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
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
const blogRoutes = require('./routes/blogRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blogs', blogRoutes);

// -----------------------------
// 7️⃣ LEETCODE PROXY
// -----------------------------

const leetcodeCache = {}; // Simple in-memory cache

app.get('/api/leetcode/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Check Cache limit API abuse
        if (leetcodeCache[username] && Date.now() - leetcodeCache[username].timestamp < 3600000) { // 1 hour cache
            return res.status(200).json(leetcodeCache[username].data);
        }

        let finalData = null;

        // ATTEMPT 1: Try the simple open API first for base stats (has acceptance rate built-in)
        try {
            const response = await axios.get(
                `https://leetcode-stats-api.herokuapp.com/${username}`,
                { timeout: 5000 }
            );

            if (response.data && response.data.status === 'success') {
                finalData = response.data;
            }
        } catch (apiErr) {
            console.log("LeetCode Stats API failed, falling back to direct GraphQL:", apiErr.message);
        }

        // ATTEMPT 2: Fallback to direct LeetCode GraphQL if HerokuAPI fails
        if (!finalData) {
            const baseQuery = `
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
                { query: baseQuery, variables: { username } },
                { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
            );

            if (!gqlResponse.data || !gqlResponse.data.data.matchedUser) {
                return res.status(404).json({ error: "User not found on LeetCode" });
            }

            const user = gqlResponse.data.data.matchedUser;
            const acStats = user.submitStats.acSubmissionNum;
            const totalQs = gqlResponse.data.data.allQuestionsCount;

            const getCount = (diff, arr) => (arr.find(item => item.difficulty === diff) || { count: 0 }).count;
            const totalSolved = getCount("All", acStats);
            const totalQuestions = getCount("All", totalQs);

            finalData = {
                status: "success",
                totalSolved,
                totalQuestions,
                easySolved: getCount("Easy", acStats),
                totalEasy: getCount("Easy", totalQs),
                mediumSolved: getCount("Medium", acStats),
                totalMedium: getCount("Medium", totalQs),
                hardSolved: getCount("Hard", acStats),
                totalHard: getCount("Hard", totalQs),
                ranking: user.profile.ranking || 0,
                acceptanceRate: totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(2) : 0
            };
        }

        // Step 3: Fetch Streak and Contest Rating natively from LeetCode
        const queryRanking = `
            query userContestRankingInfo($username: String!) {
              userContestRanking(username: $username) {
                rating
              }
            }
        `;
        const queryProfile = `
            query userProfileUserQuestionProgressV2($userSlug: String!) {
              matchedUser(username: $userSlug) {
                userCalendar {
                  streak
                }
              }
            }
        `;

        try {
            const githubHeaders = { 
                'Content-Type': 'application/json',
                'Referer': `https://leetcode.com/${username}/`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            };

            const [rankingRes, profileRes] = await Promise.all([
                axios.post('https://leetcode.com/graphql', { query: queryRanking, variables: { username } }, { headers: githubHeaders, timeout: 5000 }),
                axios.post('https://leetcode.com/graphql', { query: queryProfile, variables: { userSlug: username } }, { headers: githubHeaders, timeout: 5000 })
            ]);

            const rating = rankingRes.data?.data?.userContestRanking?.rating || 0;
            const streak = profileRes.data?.data?.matchedUser?.userCalendar?.streak || 0;

            finalData.contestRating = Math.round(rating);
            finalData.streak = streak;
        } catch (e) {
            console.error("Error fetching extra LeetCode stats:", e.message);
            finalData.contestRating = finalData.contestRating || 0;
            finalData.streak = finalData.streak || 0;
        }

        // Save to cache
        leetcodeCache[username] = {
            data: finalData,
            timestamp: Date.now()
        };

        return res.status(200).json(finalData);

    } catch (error) {
        console.error("Critical LeetCode proxy failure:", error.message);
        return res.status(500).json({
            error: "All LeetCode fetches failed",
            details: error.message
        });
    }
});

// -----------------------------
// 8️⃣ GLOBAL ERROR HANDLER
// -----------------------------
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Internal Server Error"
    });
});

// -----------------------------
// 9️⃣ START SERVER
// -----------------------------

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

