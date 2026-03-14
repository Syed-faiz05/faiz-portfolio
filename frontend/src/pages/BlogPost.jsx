import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, User, Tag, Loader2 } from 'lucide-react';
import NetworkParticles from '../components/NetworkParticles';
import API_URL from '../config';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blogs/slug/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setBlog(data);
                } else {
                    navigate('/blogs');
                }
            } catch (error) {
                console.error("Failed to fetch blog post", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans pt-24 pb-24">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <NetworkParticles />
                <div className="absolute inset-0 bg-slate-950/80 pointer-events-none"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Link */}
                <Link 
                    to="/blogs" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to all posts
                </Link>

                {/* Article Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-semibold border border-cyan-500/20">
                            {blog.category}
                        </span>
                        {blog.tags && blog.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                                <Tag className="w-3 h-3" /> {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            {blog.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            {blog.readTime}
                        </span>
                    </div>
                </motion.header>

                {/* Cover Image */}
                {blog.image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-16 shadow-2xl border border-slate-700/50"
                    >
                        <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                )}

                {/* Content Body */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="prose prose-invert prose-lg max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-code:text-pink-400 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700/50"
                >
                    {/* Simplified Render: For a real app, use a markdown parser like react-markdown. 
                        For now, assuming plain text with basic line break support, or raw HTML.
                        Using dangerouslySetInnerHTML if it's HTML, or just splitting lines if text. */}
                    <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
                </motion.div>

                {/* Footer Divider */}
                <div className="mt-20 pt-10 border-t border-slate-800">
                    <p className="text-center text-slate-500 font-medium text-sm">
                        Thanks for reading! Keep coding, keep building.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default BlogPost;
