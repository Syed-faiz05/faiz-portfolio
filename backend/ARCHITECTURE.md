# Backend Architecture & Documentation

This directory contains the Node.js/Express backend that powers the Portfolio CMS. It exposes RESTful APIs to deliver dynamic content to the React frontend, manages state in a MongoDB database, and secures restricted `/admin` routes using JWT.

## 📁 1. Full Folder Structure

```text
/backend
│── .env                 # Environment secrets (PORT, MONGO_URI, JWT_SECRET, etc)
│── package.json         # Node.js Dependencies (express, mongoose, bcryptjs, etc)
│── server.js            # Main entry point and Express App setup
│
├── /models              # Mongoose DB Schemas
│   ├── Admin.js         # Stores encrypted Admin credentials
│   ├── Message.js       # Contact form submissions
│   ├── Profile.js       # Settings and Hero configuration
│   ├── Project.js       # Portfolio projects data
│   ├── Skill.js         # Skills array and proficiencies
│   ├── TimelineItem.js  # About Me / Milestones data
│   └── Visitor.js       # Tracks unique visitor statistics
│
├── /routes              # Express API Endpoint definitions
│   ├── authRoutes.js    # /api/auth (Login, Validate token)
│   ├── aboutRoutes.js   # /api/about (Timeline management)
│   ├── dashboardRoutes.js # /api/dashboard (Calculates stats overview including visitors and milestones)
│   ├── messageRoutes.js # /api/messages (Contact form CRUD)
│   ├── profileRoutes.js # /api/profile (Admin profile details)
│   ├── projectRoutes.js # /api/projects (Project board CRUD)
│   └── skillRoutes.js   # /api/skills (Skills overview)
│
├── /middleware          # Request interceptors
│   └── authMiddleware.js # Validates JWT token before hitting protected routes
│
└── /scripts             # Database initialization utilities
    ├── resetAdmin.js    # Resets superadmin credentials
    ├── seedAdmin.js     # Script to generate the initial superadmin account
    ├── seedProfile.js   # Seeds initial profile configuration
    └── updateProfileTitle.js # Utility for editing profile info
```

---

## 💻 2. Core Architecture Code

The following sections define how the backend application is heavily structured. 

### A. The Entry Point (`server.js`)
Configures the express application, attaches BodyParsers and CORS, connects to MongoDB, and binds all router prefixes.

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-frontend-deploy.vercel.app'],
    credentials: true,
}));

// Route Mapping
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
// ... other route imports

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// ... attach other routes

// Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("Database Error:", err.message));
```

### B. Security & Authentication Middleware (`middleware/authMiddleware.js`)
Intercepts HTTP requests aimed at `/admin` routes. It verifies that a valid JWT token was passed inside the `Authorization: Bearer <TOKEN>` header.

```javascript
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;
    
    // Check if the auth header exists and holds a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Decode and verify the token signature
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach admin ID to request for following controllers
            req.admin = { id: decoded.id };
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
```

### C. A Standard Model (`models/Project.js`)
Defines the structure of a given collection inside MongoDB.

```javascript
// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    githubLink: { type: String },
    liveLink: { type: String },
    image: { type: String }, // Can store a Cloudinary URL or Base64 string
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Project', projectSchema);
```

### D. A Standard Router (`routes/projectRoutes.js`)
Handles mapping exact URL endpoints to database operations, applying the `protect` middleware to routes that mutate state.

```javascript
// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

// Public Route - Accessible by portfolio visitors
// GET /api/projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({ status: 'published' }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Route - Only accessible by authenticated superusers
// POST /api/projects
router.post('/', protect, async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin Route - Update 
// PUT /api/projects/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
```

---

## ⚡ Deployment Instructions (Render, Railway, or Heroku)

1. Make sure your `.env` contains specific secrets in your hosting dashboard:
    * `PORT=5000`
    * `MONGO_URI=mongodb+srv://<username>:<password>@cluster0...` (Use MongoDB Atlas)
    * `JWT_SECRET=any_strong_random_string`
2. Push your code to GitHub.
3. Import the repository into your PaaS of choice (e.g. **Render**).
4. Set the Root Directory to `backend` (if supported) OR configure the start command to execute `node backend/server.js`.
5. Run the DB Seeder to create your initial login account.
    * Locally: `node scripts/seedAdmin.js` 
    * Remote: Trigger the seeder script in the deployment shell.
6. Copy the newly generated backend URL (e.g., `https://my-backend.onrender.com`) and place it inside your **Frontend** `.env` file under `VITE_API_URL` so the frontend knows where to fetch data.
## 📦 3. Full Codebase Dump

The following section contains the full code for every file in the Backend to allow for easy copying.

### /middleware/authMiddleware.js
```javascript
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback_key_123');

            req.admin = { _id: decoded.id, username: 'faiz' };
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };

```

### /middleware/visitorTracker.js
```javascript
const Visitor = require('../models/Visitor');

const trackVisitor = async (req, res, next) => {
    try {
        // Simple tracking (ignoring static assets to prevent spam)
        if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
            await Visitor.create({
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
                path: req.originalUrl
            });
        }
        next();
    } catch (err) {
        // Don't block request if tracking fails
        console.error("Tracking Error:", err);
        next();
    }
};

module.exports = trackVisitor;

```

### /models/Admin.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true, // simplified from previous unique: true to avoid index issues if they occur, but practically should be unique
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Admin', adminSchema);

```

### /models/Message.js
```javascript
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    starred: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);

```

### /models/Profile.js
```javascript
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

```

### /models/Project.js
```javascript
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    images: [{ type: String }], // Base64 strings
    thumbnail: { type: String },
    video: { type: String }, // Optional video URL
    tags: { type: [String], default: [] }, // Comma separated tags
    technologies: { type: [String], default: [] }, // Kept for backward compatibility if needed, or alias to tags
    liveLink: { type: String },
    githubLink: { type: String },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['Draft', 'Published', 'Completed', 'Ongoing'], default: 'Published' },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);

```

### /models/Skill.js
```javascript
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Frontend', 'Backend', 'Tools', 'Other'], default: 'Other' },
    level: { type: Number, min: 1, max: 100 }, // Percentage
    icon: { type: String }, // URL or icon name
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);

```

### /models/TimelineItem.js
```javascript
const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
    period: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['education', 'experience', 'achievement', 'goal', 'other'],
        default: 'experience'
    },
    order: {
        type: Number,
        default: 0
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    icon: {
        type: String, // standardized icon name or visual helper
        default: 'briefcase'
    }
}, { timestamps: true });

module.exports = mongoose.model('TimelineItem', timelineItemSchema);

```

### /models/Visitor.js
```javascript
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    ip: { type: String },
    userAgent: { type: String },
    path: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);

```

### /routes/aboutRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const TimelineItem = require('../models/TimelineItem');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/about
// @desc    Get all public timeline items (sorted by order)
router.get('/', async (req, res) => {
    try {
        const items = await TimelineItem.find({ isVisible: true }).sort('order');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/about/all
// @desc    Get ALL timeline items (admin, even hidden, sorted)
router.get('/all', protect, async (req, res) => {
    try {
        const items = await TimelineItem.find({}).sort('order');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/about
// @desc    Create a new timeline item (Protected)
router.post('/', protect, async (req, res) => {
    try {
        const newItem = new TimelineItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/about/:id
// @desc    Update a timeline item (Protected)
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedItem = await TimelineItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/about/:id
// @desc    Delete a timeline item (Protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        await TimelineItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Timeline Item Deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

```

### /routes/authRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const jwt = require('jsonwebtoken');
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_fallback_key_123', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/login
// @desc    Auth admin & get token
router.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body.username);
    const { username, password } = req.body;

    try {
        if (username === 'faiz' && password === '1234faiz') {
            res.json({
                _id: 'admin_123',
                username: 'faiz',
                token: generateToken('admin_123'),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/profile
// @desc    Update Admin Profile (Username/Password)
router.put('/profile', protect, async (req, res) => {
    // We'll skip profile updating in this simple setup
    res.json({
        _id: 'admin_123',
        username: 'faiz',
        token: generateToken('admin_123'),
    });
});

// @route    GET /api/auth/me
// @desc     Get current admin
router.get('/me', protect, async (req, res) => {
    res.json(req.admin);
});

module.exports = router;

```

### /routes/dashboardRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Visitor = require('../models/Visitor');
const Message = require('../models/Message');
const TimelineItem = require('../models/TimelineItem');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard stats (Admin)
router.get('/stats', protect, async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const totalSkills = await Skill.countDocuments();
        const totalMessages = await Message.countDocuments();
        const totalVisitors = await Visitor.countDocuments();
        const totalMilestones = await TimelineItem.countDocuments();

        // Recent Items
        const latestMessages = await Message.find().sort({ createdAt: -1 }).limit(5);
        const latestProjects = await Project.find().sort({ createdAt: -1 }).limit(5);
        const latestVisitors = await Visitor.find().sort({ timestamp: -1 }).limit(5);

        res.json({
            counts: {
                projects: totalProjects,
                skills: totalSkills,
                messages: totalMessages,
                visitors: totalVisitors,
                milestones: totalMilestones
            },
            recentMessages: latestMessages,
            recentProjects: latestProjects,
            recentVisitors: latestVisitors
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

```

### /routes/messageRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create new message (Contact Form)
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const newMessage = await Message.create({
            name,
            email,
            subject,
            message
        });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update message status (read/starred)
// @route   PUT /api/messages/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (message) {
            message.read = req.body.read !== undefined ? req.body.read : message.read;
            message.starred = req.body.starred !== undefined ? req.body.starred : message.starred;

            const updatedMessage = await message.save();
            res.json(updatedMessage);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (message) {
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

```

### /routes/profileRoutes.js
```javascript
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

```

### /routes/projectRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/projects
// @desc    Get all projects (Public)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/projects
// @desc    Create a project (Admin)
router.post('/', protect, async (req, res) => {
    try {
        console.log('--- POST /api/projects ---');
        // Conceal large image data in logs
        const loggedBody = { ...req.body };
        if (loggedBody.images && Array.isArray(loggedBody.images)) loggedBody.images = `Array(${loggedBody.images.length})`;
        if (loggedBody.thumbnail && loggedBody.thumbnail.length > 100) loggedBody.thumbnail = '...thumbnail data...';
        // console.log('Request Body:', loggedBody);

        const { images, tags, technologies, ...otherData } = req.body;

        // Ensure arrays and filter empty strings
        const processedTags = Array.isArray(tags)
            ? tags
            : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

        const processedTechs = Array.isArray(technologies)
            ? technologies
            : (technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

        const projectData = {
            ...otherData,
            images: images || [],
            tags: processedTags,
            technologies: processedTechs
        };

        const project = await Project.create(projectData);
        console.log('Project created successfully:', project._id);
        res.status(201).json(project);
    } catch (error) {
        console.error('Project Create Error:', error);
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update a project (Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.body.tags !== undefined) {
            updateData.tags = Array.isArray(req.body.tags)
                ? req.body.tags
                : (req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
        }
        if (req.body.technologies !== undefined) {
            updateData.technologies = Array.isArray(req.body.technologies)
                ? req.body.technologies
                : (req.body.technologies ? req.body.technologies.split(',').map(t => t.trim()).filter(Boolean) : []);
        }

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

```

### /routes/skillRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/skills
// @desc    Get all skills (Public)
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/skills
// @desc    Create a skill (Admin)
router.post('/', protect, async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill (Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json({ message: 'Skill removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

```

### /scripts/resetAdmin.js
```javascript
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

```

### /scripts/seedProfile.js
```javascript
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

```

### /scripts/updateProfileTitle.js
```javascript
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

```

### /seedAdmin.js
```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
    .then(async () => {
        console.log('MongoDB successfully connected for seeding');

        const adminExists = await Admin.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        await Admin.create({
            username: 'admin',
            password: 'password123' // This will be hashed by the model pre-save hook
        });

        console.log('Admin user created: admin / password123');
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

```

### /server.js
```javascript
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

```

### /testmongo.js
```javascript
const mongoose = require('mongoose');
const uri = "mongodb+srv://syedfaiz052004_db_user:hGLkU4ClktChwxug@cluster0.amwst5g.mongodb.net/";

async function run() {
    try {
        console.log("Connecting...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected successfully to MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}
run();

```

### /utils/generateToken.js
```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_dev_only', {
        expiresIn: '30d'
    })
};

module.exports = generateToken;

```

