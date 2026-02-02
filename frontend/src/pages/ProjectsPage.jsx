import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Rocket } from 'lucide-react';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            const published = Array.isArray(data)
                ? data.filter(p => !p.status || p.status === 'Published')
                : [];
            setProjects(published);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
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
                    // Empty state - matching your design
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center min-h-[60vh]"
                    >
                        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 max-w-2xl text-center">
                            <h1 className="text-4xl font-bold mb-6">Projects</h1>
                            <p className="text-gray-400 text-lg mb-8">
                                I'm currently working on real-world projects focused on full stack development and data-driven solutions.
                            </p>
                            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-full">
                                <Rocket size={20} />
                                <span>Projects coming soon</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-8">
                                Meanwhile, feel free to explore my skills, background, and contact me.
                            </p>
                        </div>
                    </motion.div>
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
                                    className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-400 transition-all group"
                                >
                                    {project.image && (
                                        <div className="relative h-48 overflow-hidden bg-slate-700">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            {project.featured && (
                                                <span className="absolute top-3 right-3 bg-cyan-500 text-white text-xs px-3 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.slice(0, 3).map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-slate-700/50 text-cyan-400 text-xs px-3 py-1 rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 3 && (
                                                <span className="text-gray-500 text-xs px-2 py-1">
                                                    +{project.technologies.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                                                >
                                                    <Github size={18} />
                                                    <span className="text-sm">Code</span>
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                                                >
                                                    <ExternalLink size={18} />
                                                    <span className="text-sm">Live</span>
                                                </a>
                                            )}
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
