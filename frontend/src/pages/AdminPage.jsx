
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, ExternalLink, Github } from 'lucide-react';
import API_URL from '../config';

const AdminPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        githubLink: '',
        liveLink: '',
        image: '',
        featured: false
    });

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            const data = await response.json();
            setProjects(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const projectData = {
            ...formData,
            technologies: formData.technologies.split(',').map(t => t.trim())
        };

        try {
            const url = editingProject
                ? `${API_URL}/api/projects/${editingProject._id}`
                : `${API_URL}/api/projects`;

            const method = editingProject ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });

            if (response.ok) {
                fetchProjects();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await fetch(`${API_URL}/api/projects/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchProjects();
                }
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies.join(', '),
            githubLink: project.githubLink || '',
            liveLink: project.liveLink || '',
            image: project.image || '',
            featured: project.featured
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            technologies: '',
            githubLink: '',
            liveLink: '',
            image: '',
            featured: false
        });
        setEditingProject(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        Admin <span className="text-cyan-400">Panel</span>
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        {showForm ? 'Cancel' : 'Add Project'}
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 mb-8"
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="4"
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.technologies}
                                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                    placeholder="React, Node.js, MongoDB"
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">GitHub Link</label>
                                    <input
                                        type="url"
                                        value={formData.githubLink}
                                        onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Live Link</label>
                                    <input
                                        type="url"
                                        value={formData.liveLink}
                                        onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-400"
                                />
                                <label htmlFor="featured" className="text-sm font-medium">
                                    Featured Project
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    {editingProject ? 'Update' : 'Create'} Project
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Projects List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">All Projects ({projects.length})</h2>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
                            <p className="text-gray-400">No projects yet. Create your first project!</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 hover:border-cyan-400 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">{project.title}</h3>
                                            {project.featured && (
                                                <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-slate-700 text-cyan-400 text-sm px-3 py-1 rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-4">
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-cyan-400 flex items-center gap-1"
                                                >
                                                    <Github size={16} /> GitHub
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-cyan-400 flex items-center gap-1"
                                                >
                                                    <ExternalLink size={16} /> Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
