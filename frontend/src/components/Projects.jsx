import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const projectsData = [
    {
        title: 'Project One',
        description: 'A brief description of project one. It is a web application built with React and Node.js.',
        tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
        github: '#',
        demo: '#',
        placeholderColor: 'bg-blue-900'
    },
    {
        title: 'Project Two',
        description: 'A brief description of project two. This one focuses on real-time data visualization.',
        tags: ['Vue.js', 'Firebase', 'D3.js'],
        github: '#',
        demo: '#',
        placeholderColor: 'bg-purple-900'
    },
    {
        title: 'Project Three',
        description: 'A mobile-first e-commerce platform with stripe integration.',
        tags: ['Next.js', 'Stripe', 'PostgreSQL'],
        github: '#',
        demo: '#',
        placeholderColor: 'bg-indigo-900'
    }
];

const Projects = () => {
    return (
        <section id="projects" className="py-20 bg-slate-900/50 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-blue-500">My Projects</h2>
                    <p className="mt-4 text-gray-300">Check out some of the things I've built.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsData.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-blue-500 transition-all flex flex-col"
                        >
                            <div className={`h-48 ${project.placeholderColor} flex items-center justify-center`}>
                                <span className="text-white/50 text-xl font-bold">{project.title} Preview</span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                                    <div className="flex space-x-3">
                                        <a href={project.github} className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                                        <a href={project.demo} className="text-gray-400 hover:text-white transition-colors"><ExternalLink size={20} /></a>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-4 flex-1">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tags.map((tag, tagIndex) => (
                                        <span key={tagIndex} className="text-xs bg-slate-900 text-blue-400 px-2 py-1 rounded-full border border-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
