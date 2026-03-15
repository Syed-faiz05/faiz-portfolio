const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    summary: {
        type: String,
        required: [true, 'Please add a summary'],
        maxlength: [300, 'Summary cannot be more than 300 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Tech', 'Coding', 'Data Science', 'Design', 'Other', 'Life'],
        default: 'Tech'
    },
    author: {
        type: String,
        default: 'Syed Faiz'
    },
    readTime: {
        type: String,
        default: '5 min read'
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    },
    tags: {
        type: [String],
        default: []
    },
    published: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
