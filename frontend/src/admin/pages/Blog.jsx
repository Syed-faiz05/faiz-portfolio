import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Search, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

const Blog = () => {
    const { token } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        content: '',
        category: 'Tech',
        author: 'Syed Faiz',
        readTime: '5 min read',
        image: '',
        tags: '',
        published: true
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`${API_URL}/api/blogs`);
            if (res.ok) {
                const data = await res.json();
                setBlogs(data);
            }
        } catch (error) {
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert tags from comma separated string to array if needed
        const tagsArray = typeof formData.tags === 'string' 
            ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            : formData.tags;

        const payload = {
            ...formData,
            tags: tagsArray
        };

        try {
            const url = editingId 
                ? `${API_URL}/api/blogs/${editingId}`
                : `${API_URL}/api/blogs`;
            
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? 'Blog updated successfully' : 'Blog created successfully');
                setIsModalOpen(false);
                resetForm();
                fetchBlogs();
            } else {
                const error = await res.json();
                toast.error(error.message || 'Error saving blog');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            title: blog.title,
            slug: blog.slug,
            summary: blog.summary,
            content: blog.content,
            category: blog.category,
            author: blog.author,
            readTime: blog.readTime,
            image: blog.image || '',
            tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
            published: blog.published
        });
        setEditingId(blog._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const res = await fetch(`${API_URL}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success('Blog deleted successfully');
                fetchBlogs();
            } else {
                toast.error('Error deleting blog');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            summary: '',
            content: '',
            category: 'Tech',
            author: 'Syed Faiz',
            readTime: '5 min read',
            image: '',
            tags: '',
            published: true
        });
        setEditingId(null);
    };

    const togglePublish = async (blog) => {
        try {
            const res = await fetch(`${API_URL}/api/blogs/${blog._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ published: !blog.published })
            });

            if (res.ok) {
                toast.success(`Blog ${!blog.published ? 'published' : 'unpublished'}`);
                fetchBlogs();
            }
        } catch (error) {
            toast.error('Failed to change publish status');
        }
    };

    const filteredBlogs = blogs.filter(b => 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BookOpen className="text-cyan-400" />
                        Blog Management
                    </h1>
                    <p className="text-slate-400 mt-1">Create and manage your articles</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-cyan-900/20"
                >
                    <Plus size={20} />
                    New Post
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search blogs by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none w-full placeholder-slate-500"
                />
            </div>

            {/* Blog List */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-700">
                                <th className="p-4 text-slate-300 font-semibold w-1/3">Title & Category</th>
                                <th className="p-4 text-slate-300 font-semibold">Date</th>
                                <th className="p-4 text-slate-300 font-semibold text-center">Status</th>
                                <th className="p-4 text-slate-300 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400">Loading...</td>
                                </tr>
                            ) : filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400">No blogs found. Create your first post!</td>
                                </tr>
                            ) : (
                                filteredBlogs.map((blog) => (
                                    <tr key={blog._id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white line-clamp-1">{blog.title}</div>
                                            <div className="text-xs text-cyan-400 mt-1">{blog.category}</div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => togglePublish(blog)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${blog.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}
                                            >
                                                {blog.published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Post' : 'New Post'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Title <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="Awesome Blog Title"
                                    />
                                </div>
                                
                                {/* Slug */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Slug (Auto-generates if empty)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="awesome-blog-title"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Category <span className="text-red-400">*</span></label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="Tech">Tech</option>
                                        <option value="Coding">Coding</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Design">Design</option>
                                        <option value="Life">Life</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Summary */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Summary (Short Preview) <span className="text-red-400">*</span></label>
                                    <textarea
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleInputChange}
                                        required
                                        rows="2"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
                                        placeholder="A brief overview of the article..."
                                    />
                                </div>

                                {/* Content area - Ideally this uses a rich text editor or markdown editor. Simple textarea for now. */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">
                                        Content (Markdown / HTML supported) <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        required
                                        rows="12"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                                        placeholder="# Main Heading\n\nStart writing your amazing content here..."
                                    />
                                </div>

                                {/* Image URL */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Cover Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Tags (Comma separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="React, Node.js, Tutorial"
                                    />
                                </div>

                                {/* Read Time */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Read Time</label>
                                    <input
                                        type="text"
                                        name="readTime"
                                        value={formData.readTime}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="5 min read"
                                    />
                                </div>

                                {/* Published Toggle */}
                                <div className="flex items-center gap-3 pt-6">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        name="published"
                                        checked={formData.published}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 accent-cyan-500 bg-slate-800 border-slate-700 rounded"
                                    />
                                    <label htmlFor="published" className="text-slate-300 font-medium cursor-pointer">
                                        Publish Immediately
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Check size={18} />
                                    {editingId ? 'Update Post' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Blog;
