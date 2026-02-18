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
