import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Loader2, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const Projects = ({ limit = null }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${API_URL}/api/projects`);
                const data = await res.json();
                // Filter for published projects only
                const publishedProjects = Array.isArray(data)
                    ? data.filter(p => !p.status || p.status === 'Published' || p.status === 'Completed' || p.status === 'Ongoing')
                    : [];
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
            return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/'); // Optimize width to 800px
        }
        return url;
    };

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
                    <h2 className="text-3xl font-bold text-cyan-400">
                        {limit ? "Featured Projects" : "My Projects"}
                    </h2>
                    <p className="mt-4 text-gray-300">
                        {limit
                            ? "A glimpse of what I've been working on."
                            : "Check out some of the things I've built."
                        }
                    </p>
                </motion.div>

                {displayProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayProjects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-[#0f1016] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 hover:-translate-y-2 hover:shadow-cyan-500/20 transition-all duration-300 group flex flex-col"
                            >
                                {/* Image Section */}
                                <div className="h-64 bg-slate-900 overflow-hidden relative">
                                    {(project.thumbnail || (project.images && project.images.length > 0) || project.image) ? (
                                        <img
                                            src={getOptimizedUrl(project.image || project.thumbnail || (project.images && project.images[0]))}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-700 bg-[#0a0b10]">
                                            <Layers className="h-12 w-12 mb-3 opacity-20" />
                                            <span className="text-sm font-medium opacity-50">No Preview</span>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 animate-fade-in">
                                        <div className={`
                                            flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border backdrop-blur-md shadow-lg
                                            ${(project.status === 'Completed' || !project.status)
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20'
                                                : project.status === 'Ongoing'
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/20'
                                            }
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${(project.status === 'Completed' || !project.status) ? 'bg-emerald-400' : 'bg-current'} animate-pulse`}></span>
                                            {(project.status || 'Completed').toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex-1 flex flex-col bg-[#0f1016]">
                                    <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 leading-tight">
                                        {project.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.technologies && project.technologies.slice(0, 4).map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="text-xs font-medium bg-[#1a1b23] text-blue-400 px-4 py-1.5 rounded-full border border-slate-800/50"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {project.technologies && project.technologies.length > 4 && (
                                            <span className="text-xs font-medium bg-[#1a1b23] text-slate-500 px-3 py-1.5 rounded-full border border-slate-800/50">
                                                +{project.technologies.length - 4}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 mt-auto">
                                        <a
                                            href={project.liveLink || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`
                                                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300
                                                ${project.liveLink
                                                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-500/25 hover:-translate-y-0.5'
                                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                                }
                                            `}
                                        >
                                            <ExternalLink size={18} />
                                            Live Demo
                                        </a>

                                        <a
                                            href={project.githubLink || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`
                                                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-[#1a1b23] border border-slate-700/50 text-white transition-all duration-300
                                                ${project.githubLink
                                                    ? 'hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-0.5'
                                                    : 'opacity-50 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            <Github size={18} />
                                            GitHub
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                        <Layers className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                        <h3 className="text-lg font-medium text-slate-400">No projects to display</h3>
                        <p className="text-slate-500 mt-2">Check back soon for updates!</p>
                    </div>
                )}

                {/* View All Button */}
                {limit && projects.length > limit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex justify-center mt-12"
                    >
                        <Link to="/projects">
                            <button className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-semibold transition-all hover:scale-105">
                                View All Projects <ArrowRight size={20} />
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Projects;
