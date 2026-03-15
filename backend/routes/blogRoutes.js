const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getBlogs)
    .post(protect, createBlog);

router.route('/:id')
    .put(protect, updateBlog)
    .delete(protect, deleteBlog);

// Get by slug uses a different path slightly to avoid conflict with ID, or we can handle it in the controller.
// Since Mongodb IDs are 24 chars hex, and slugs usually aren't, we can route specific slug fetch here:
router.route('/slug/:slug').get(getBlogBySlug);

module.exports = router;
