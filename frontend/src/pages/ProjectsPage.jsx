import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Rocket, Search, X, Filter, Calendar, Layers } from 'lucide-react';
import API_URL from '../config';

const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors z-10"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative h-64 md:h-96 w-full bg-slate-800">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-600">
                                <Rocket size={48} />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-32" />
                        <div className="absolute bottom-6 left-6 md:left-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{project.title}</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.status && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        project.status === 'Ongoing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {project.status}
                                    </span>
                                )}
                                {project.featured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                        Featured
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 space-y-8">
                        {/* Links */}
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={project.liveLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${project.liveLink
                                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                <ExternalLink size={18} /> Visit Live Site
                            </a>
                            <a
                                href={project.githubLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${project.githubLink
                                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                                    }`}
                            >
                                <Github size={18} /> View Source Code
                            </a>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                        <Layers className="text-cyan-400" size={20} /> About the Project
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-lg">
                                        {project.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.map((tech, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-slate-800 text-cyan-300 text-sm rounded-lg border border-slate-700/50">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {project.createdAt && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                            <Calendar className="text-slate-400" size={18} /> Date
                                        </h3>
                                        <p className="text-slate-400">
                                            {new Date(project.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTech, setSelectedTech] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

    // Filter Chips - Dynamic based on available tech
    const [availableTechs, setAvailableTechs] = useState(['All']);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            if (response.ok) {
                const data = await response.json();
                setProjects(data);

                // Extract unique technologies for filter
                const techs = new Set(['All']);
                data.forEach(p => p.technologies?.forEach(t => techs.add(t)));
                // Initial set of popular/common tags to avoid clutter
                const commonTechs = ['All', 'React', 'Node.js', 'Python', 'Next.js', 'MongoDB', 'TypeScript'];
                // Filter available techs to only include ones that actually exist in the projects
                const filteredTechs = commonTechs.filter(t => t === 'All' || [...techs].some(pt => pt.toLowerCase() === t.toLowerCase()));

                setAvailableTechs(filteredTechs);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const getOptimizedUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
        }
        return url;
    };

    // Filter and Search Logic
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = (project.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (project.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
            const matchesTech = selectedTech === 'All' ||
                (project.technologies || []).some(t => t.toLowerCase() === selectedTech.toLowerCase());
            return matchesSearch && matchesTech;
        });
    }, [projects, searchQuery, selectedTech]);

    const featuredProjects = filteredProjects.filter(p => p.featured);
    const normalProjects = filteredProjects.filter(p => !p.featured);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-4"
                    >
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Projects</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto"
                    >
                        Explore my latest work, side projects, and open source contributions.
                    </motion.p>
                </div>

                {/* Controls: Search & Filter */}
                <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-800/30 p-4 rounded-2xl backdrop-blur-md border border-slate-700/50">

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        {availableTechs.map(tech => (
                            <button
                                key={tech}
                                onClick={() => setSelectedTech(tech)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTech === tech
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'
                                    }`}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-purple-400">✦</span> Featured Projects
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {featuredProjects.map((project, index) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group relative bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300"
                                >
                                    <div className="h-64 sm:h-80 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors z-10" />
                                        {project.image ? (
                                            <img
                                                src={getOptimizedUrl(project.image)}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                <Rocket size={48} className="text-slate-600 opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-3 py-1 rounded-full bg-purple-500/90 text-white text-xs font-bold backdrop-blur-md shadow-lg">
                                                Featured
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">{project.title}</h3>
                                                <div className="flex gap-2 mb-4">
                                                    {project.technologies?.slice(0, 3).map((t, i) => (
                                                        <span key={i} className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/30">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedProject(project)}
                                                className="p-3 bg-slate-700/50 rounded-xl hover:bg-purple-600 hover:text-white transition-all text-slate-300"
                                            >
                                                <ExternalLink size={20} />
                                            </button>
                                        </div>
                                        <p className="text-slate-400 line-clamp-2 mb-6">
                                            {project.description}
                                        </p>
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-purple-500/50 transition-all font-semibold"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Projects Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">All Projects</h2>
                    {normalProjects.length === 0 && featuredProjects.length === 0 ? (
                        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
                            <p className="text-slate-500 text-lg">No projects match your search.</p>
                            <button onClick={() => { setSearchQuery(''); setSelectedTech('All') }} className="mt-4 text-cyan-400 hover:underline">Clear filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {normalProjects.map((project, index) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedProject(project)}
                                    className="bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all cursor-pointer group"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        {project.image ? (
                                            <img
                                                src={getOptimizedUrl(project.image)}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                                                <Rocket size={32} />
                                            </div>
                                        )}
                                        {project.status && (
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-emerald-500/90 text-white' : 'bg-blue-500/90 text-white'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies?.slice(0, 3).map((t, i) => (
                                                <span key={i} className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                                                    {t}
                                                </span>
                                            ))}
                                            {project.technologies?.length > 3 && (
                                                <span className="text-xs text-slate-500 px-2 py-1">+ {project.technologies.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
};

export default ProjectsPage;
