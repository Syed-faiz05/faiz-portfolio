import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, CheckCircle, Upload, Search, Filter, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentProject({ ...currentProject, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(prev => prev.filter(p => p._id !== id));
            showNotification('Project deleted successfully');
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const url = currentProject._id
                ? `/api/projects/${currentProject._id}`
                : '/api/projects';

            const method = currentProject._id ? 'PUT' : 'POST';

            const payload = { ...currentProject };
            // Ensure technologies is an array
            if (typeof payload.technologies === 'string') {
                payload.technologies = payload.technologies.split(',').map(t => t.trim()).filter(Boolean);
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsEditing(false);
                setCurrentProject(initialFormState);
                fetchProjects();
                showNotification(currentProject._id ? 'Project updated' : 'Project created');
            }
        } catch (error) {
            alert('Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-6 left-1/2 min-w-[300px] z-[100] bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm"
                    >
                        <CheckCircle size={16} className="text-green-400" />
                        <span>{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your portfolio showcase items</p>
                </div>
                <button
                    onClick={() => { setCurrentProject(initialFormState); setIsEditing(true); }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {/* List View (Table Style) */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Project Info</th>
                                <th className="px-6 py-4">Tech Stack</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {projects.map(project => (
                                <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
                                                {project.image ? (
                                                    <img src={project.image} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={16} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{project.title}</p>
                                                <div className="flex gap-2 mt-1">
                                                    {project.liveLink && <a href={project.liveLink} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1"><ExternalLink size={10} /> Live</a>}
                                                    {project.githubLink && <a href={project.githubLink} target="_blank" className="text-xs text-slate-500 hover:underline flex items-center gap-1"><ExternalLink size={10} /> Code</a>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {project.technologies?.slice(0, 3).map((t, i) => (
                                                <span key={i} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200">
                                                    {t}
                                                </span>
                                            ))}
                                            {project.technologies?.length > 3 && <span className="text-xs text-gray-400">+{project.technologies.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Published'
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                            }`}>
                                            {project.status || 'Published'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setCurrentProject(project); setIsEditing(true); }}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-gray-400">
                                        No projects found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800">
                                    {currentProject._id ? 'Edit Project' : 'New Project'}
                                </h3>
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label="Title" value={currentProject.title} onChange={v => setCurrentProject({ ...currentProject, title: v })} placeholder="Project Name" />
                                    <div>
                                        <label className="block text-slate-500 text-xs font-medium mb-1.5">Status</label>
                                        <select
                                            value={currentProject.status || 'Published'}
                                            onChange={e => setCurrentProject({ ...currentProject, status: e.target.value })}
                                            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="Published">Published</option>
                                            <option value="Draft">Draft</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label="Live Link" value={currentProject.liveLink} onChange={v => setCurrentProject({ ...currentProject, liveLink: v })} placeholder="https://..." />
                                    <Input label="GitHub Link" value={currentProject.githubLink} onChange={v => setCurrentProject({ ...currentProject, githubLink: v })} placeholder="https://github.com/..." />
                                </div>

                                <div>
                                    <label className="block text-slate-500 text-xs font-medium mb-1.5">Description</label>
                                    <textarea
                                        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                        value={currentProject.description}
                                        onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                                        placeholder="Project description..."
                                    ></textarea>
                                </div>

                                <Input
                                    label="Technologies (comma separated)"
                                    value={Array.isArray(currentProject.technologies) ? currentProject.technologies.join(', ') : currentProject.technologies}
                                    onChange={v => setCurrentProject({ ...currentProject, technologies: v })}
                                    placeholder="React, Node.js, MongoDB..."
                                />

                                <div>
                                    <label className="block text-slate-500 text-xs font-medium mb-2">Project Image</label>
                                    <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                                        <div className="w-32 h-20 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            {currentProject.image ? (
                                                <img src={currentProject.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="text-gray-400" size={24} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-medium py-2 px-3 rounded-md inline-flex items-center gap-2 transition-colors shadow-sm">
                                                <Upload size={14} /> Upload Image
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                            <p className="text-xs text-gray-400 mt-2">Recommended: 1200x675px (16:9). Max 5MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Project'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
    <div>
        <label className="block text-slate-500 text-xs font-medium mb-1.5">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
        />
    </div>
);

const initialFormState = {
    title: '', description: '', image: '', technologies: '', liveLink: '', githubLink: '', status: 'Published'
};

export default ProjectManager;
