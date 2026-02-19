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
        seedAdmin();
    } catch (error) {
        console.error(`Mongo Error: ${error.message}`);
    }
};

// -----------------------------
// 3️⃣ MODELS
// -----------------------------

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    technologies: [String],
    tags: [String],
    githubLink: String,
    liveLink: String,
    image: String,
    thumbnail: String,
    status: { type: String, default: 'Published' },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', projectSchema);

const skillSchema = new mongoose.Schema({
    name: String,
    category: { type: String, default: 'Other' },
    level: { type: Number, default: 50 },
    icon: String
});
const Skill = mongoose.model('Skill', skillSchema);

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

const aboutSchema = new mongoose.Schema({
    description: String,
    resumeLink: String,
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String
    }
});
const About = mongoose.model('About', aboutSchema);

// -----------------------------
// 4️⃣ AUTH MIDDLEWARE
// -----------------------------

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
};

// -----------------------------
// 5️⃣ SEED ADMIN
// -----------------------------

const seedAdmin = async () => {
    try {
        const username = 'faiz';
        const password = '123456';

        const existingUser = await User.findOne({ username });
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUser) {
            existingUser.password = hashedPassword;
            await existingUser.save();
        } else {
            await User.create({ username, password: hashedPassword });
        }

        console.log('Admin ready');
    } catch (err) {
        console.error('Seed error:', err.message);
    }
};

// -----------------------------
// 6️⃣ ROUTES
// -----------------------------

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/profile', async (req, res) => {
    res.json({ message: "Profile endpoint working" });
});

app.get('/api/about', async (req, res) => {
    const about = await About.findOne();
    res.json(about || {
        description: "Full Stack Developer",
        resumeLink: "",
        socialLinks: {}
    });
});

app.get('/api/projects', async (req, res) => {
    const projects = await Project.find({});
    res.json(projects);
});

app.get('/api/skills', async (req, res) => {
    const skills = await Skill.find({});
    res.json(skills);
});

app.post('/api/messages', async (req, res) => {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
});

// -----------------------------
// 7️⃣ LEETCODE PROXY
// -----------------------------

app.get('/api/leetcode/:username', async (req, res) => {
    try {
        const { username } = req.params;

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
        }`;

        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query,
                variables: { username }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        if (!response.data) {
            return res.status(500).json({ error: "No data from LeetCode" });
        }

        return res.status(200).json(response.data);

    } catch (error) {
        console.error("LeetCode API error:", error.response?.data || error.message);
        return res.status(500).json({
            error: "LeetCode fetch failed",
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
