import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, ChevronRight, Loader2 } from 'lucide-react';
import NetworkParticles from '../components/NetworkParticles';
import API_URL from '../config';

const BlogCard = ({ blog, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 shadow-xl group flex flex-col h-full transition-all duration-300 hover:-translate-y-2"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={blog.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-cyan-400 border border-slate-700/50">
                    {blog.category}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 font-medium">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {blog.readTime}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                </h3>

                <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {blog.summary}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">
                        By {blog.author}
                    </span>
                    <Link
                        to={`/blogs/${blog.slug}`}
                        className="flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/btn"
                    >
                        Read More <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blogs`);
                if (res.ok) {
                    const data = await res.json();
                    setBlogs(data.filter(blog => blog.published));
                }
            } catch (error) {
                console.error("Failed to load blogs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans pt-20 pb-24 border-b border-transparent">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <NetworkParticles />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 pointer-events-none"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/30">
                            <BookOpen className="w-10 h-10 text-cyan-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-sm">
                        Technical Blog
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
                        Thoughts, tutorials, and insights on web development, data science, and my journey in tech.
                    </p>
                </motion.div>

                {/* Blogs Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <BlogCard key={blog._id} blog={blog} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-dashed border-slate-700">
                        <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                        <p className="text-slate-500 text-lg">No blogs published yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
