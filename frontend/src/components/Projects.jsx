import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Loader2, Layers, ArrowRight, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const CATEGORY_CONFIG = {
    'Web': { color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
    'Mobile': { color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
    'AI': { color: 'bg-purple-500/15 text-purple-300 border-purple-500/30', dot: 'bg-purple-400' },
    'ML': { color: 'bg-violet-500/15 text-violet-300 border-violet-500/30', dot: 'bg-violet-400' },
    'Backend': { color: 'bg-orange-500/15 text-orange-300 border-orange-500/30', dot: 'bg-orange-400' },
    'API': { color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', dot: 'bg-cyan-400' },
    'Design': { color: 'bg-pink-500/15 text-pink-300 border-pink-500/30', dot: 'bg-pink-400' },
    'Game': { color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', dot: 'bg-yellow-400' },
    'Tool': { color: 'bg-slate-500/15 text-slate-300 border-slate-500/30', dot: 'bg-slate-400' },
};

const getPrimaryCategory = (project) => {
    if (!project.tags || project.tags.length === 0) return null;
    for (const key of Object.keys(CATEGORY_CONFIG)) {
        if (project.tags.some(t => t.toLowerCase() === key.toLowerCase())) return key;
    }
    return project.tags[0];
};

const Projects = ({ limit = null }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${API_URL}/api/projects`);
                const data = await res.json();
                const publishedProjects = Array.isArray(data)
                    ? data.filter(p => !p.status || p.status === 'Published' || p.status === 'Completed' || p.status === 'Ongoing')
                    : [];
                // Sort by order, then featured, then date
                publishedProjects.sort((a, b) => {
                    if (a.order !== b.order) return a.order - b.order;
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setProjects(publishedProjects);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const getOptimizedUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
        }
        return url;
    };

    const getProjectImage = (p) =>
        p.image || p.thumbnail || (p.images && p.images[0]) || null;

    const displayProjects = limit ? projects.slice(0, limit) : projects;

    if (loading) {
        return (
            <section id="projects" className="py-20 bg-slate-900/50 text-white flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </section>
        );
    }

    return (
        <section id="projects" className="py-20 bg-slate-900/50 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-cyan-500 text-sm font-semibold uppercase tracking-widest mb-2">Portfolio</p>
                    <h2 className="text-3xl font-bold text-white">
                        {limit ? 'Featured Projects' : 'My Projects'}
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                        {limit
                            ? "A glimpse of what I've been working on. Click any card for a live preview."
                            : "Check out some of the things I've built."
                        }
                    </p>
                </motion.div>

                {displayProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayProjects.map((project, index) => {
                            const img = getOptimizedUrl(getProjectImage(project));
                            const cat = getPrimaryCategory(project);
                            const cfg = cat ? (CATEGORY_CONFIG[cat] || { color: 'bg-slate-600/20 text-slate-300 border-slate-600/30', dot: 'bg-slate-400' }) : null;

                            return (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                    className="bg-[#0f1016] rounded-2xl overflow-hidden shadow-xl border border-slate-800/60 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-cyan-500/10 transition-all duration-300 group flex flex-col"
                                >
                                    {/* Image Section */}
                                    <div className="h-52 bg-slate-900 overflow-hidden relative shrink-0">
                                        {img ? (
                                            <img
                                                src={img}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-700 bg-[#0a0b10]">
                                                <Layers className="h-10 w-10 mb-2 opacity-20" />
                                                <span className="text-xs opacity-40">No Preview</span>
                                            </div>
                                        )}
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1016]/80 via-transparent to-transparent" />

                                        {/* Top badges */}
                                        <div className="absolute top-3 left-3 flex gap-1.5">
                                            {cfg && (
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider backdrop-blur-sm ${cfg.color}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                    {cat}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status badge top right */}
                                        <div className="absolute top-3 right-3">
                                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md
                                                ${(project.status === 'Completed' || !project.status)
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : project.status === 'Ongoing'
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${(project.status === 'Completed' || !project.status) ? 'bg-emerald-400' : 'bg-current'} animate-pulse`} />
                                                {(project.status || 'Completed').toUpperCase()}
                                            </div>
                                        </div>

                                        {/* Live badge bottom */}
                                        {project.liveLink && (
                                            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-green-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                <span className="text-[10px] text-green-400 font-semibold">LIVE</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 leading-tight">
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                                            {project.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-5">
                                            {project.technologies && project.technologies.slice(0, 4).map((tag, tagIndex) => (
                                                <span key={tagIndex}
                                                    className="text-xs font-medium bg-[#1a1b23] text-blue-400 px-3 py-1 rounded-full border border-slate-800/50">
                                                    {tag}
                                                </span>
                                            ))}
                                            {project.technologies && project.technologies.length > 4 && (
                                                <span className="text-xs font-medium bg-[#1a1b23] text-slate-500 px-2 py-1 rounded-full border border-slate-800/50">
                                                    +{project.technologies.length - 4}
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 mt-auto">
                                            <Link to="/projects" className="flex-1">
                                                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300">
                                                    <Monitor size={15} />
                                                    {project.liveLink ? 'Preview' : 'Details'}
                                                </button>
                                            </Link>
                                            <a
                                                href={project.githubLink || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-[#1a1b23] border border-slate-700/50 text-white transition-all duration-300
                                                    ${project.githubLink ? 'hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-0.5' : 'opacity-40 cursor-not-allowed'}`}
                                            >
                                                <Github size={15} />
                                                Code
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                        <Layers className="h-12 w-12 mx-auto mb-4 text-slate-600 opacity-50" />
                        <h3 className="text-lg font-medium text-slate-400">No projects to display</h3>
                        <p className="text-slate-500 mt-2 text-sm">Check back soon for updates!</p>
                    </div>
                )}

                {/* View All Button */}
                {limit && projects.length > limit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex justify-center mt-12"
                    >
                        <Link to="/projects">
                            <button className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-semibold transition-all hover:scale-105">
                                View All Projects <ArrowRight size={18} />
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Projects;
