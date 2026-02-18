const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Frontend', 'Backend', 'Tools', 'Other'], default: 'Other' },
    level: { type: Number, min: 1, max: 100 }, // Percentage
    icon: { type: String }, // URL or icon name
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
