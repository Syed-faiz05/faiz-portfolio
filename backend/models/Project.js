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
