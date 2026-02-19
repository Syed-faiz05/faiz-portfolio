import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Rocket } from 'lucide-react';
import API_URL from '../config';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            if (response.status === 500) {
                console.error("Backend error 500: Check server logs");
                setLoading(false);
                return;
            }
            const data = await response.json();
            const published = Array.isArray(data)
                ? data.filter(p => !p.status || p.status === 'Published' || p.status === 'Completed' || p.status === 'Ongoing')
                : [];
            setProjects(published);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const getOptimizedUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/'); // Optimize width to 800px
        }
        return url;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                            <h3 className="text-xl font-bold text-slate-300">No projects yet</h3>
                            <p className="text-slate-500 mt-2">Projects added via the Admin Dashboard will appear here.</p>
                        </div>
                    </div>
                ) : (
                    // Projects grid
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                My <span className="text-cyan-400">Projects</span>
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Here are some of my featured projects
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
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
                                                <Rocket className="h-12 w-12 mb-3 opacity-20" />
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
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;
