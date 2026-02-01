import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon } from 'lucide-react';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            // Ensure array
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
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

            // Split technologies string into array if needed
            const payload = { ...currentProject };
            if (typeof payload.technologies === 'string') {
                payload.technologies = payload.technologies.split(',').map(t => t.trim());
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
            }
        } catch (error) {
            alert('Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Project Manager</h2>
                <button
                    onClick={() => { setCurrentProject(initialFormState); setIsEditing(true); }}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} /> Add Project
                </button>
            </div>

            {/* Form Modal/Overlay */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {currentProject._id ? 'Edit Project' : 'New Project'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Title" value={currentProject.title} onChange={v => setCurrentProject({ ...currentProject, title: v })} />
                                <Input label="Live Link" value={currentProject.liveLink} onChange={v => setCurrentProject({ ...currentProject, liveLink: v })} />
                            </div>

                            <Input label="GitHub Link" value={currentProject.githubLink} onChange={v => setCurrentProject({ ...currentProject, githubLink: v })} />

                            {/* Image URL Input (Simplest for now) */}
                            <Input label="Image URL" value={currentProject.image} onChange={v => setCurrentProject({ ...currentProject, image: v })} />

                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Description</label>
                                <textarea
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none h-24"
                                    value={currentProject.description}
                                    onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                                ></textarea>
                            </div>

                            <Input
                                label="Technologies (comma separated)"
                                value={Array.isArray(currentProject.technologies) ? currentProject.technologies.join(', ') : currentProject.technologies}
                                onChange={v => setCurrentProject({ ...currentProject, technologies: v })}
                            />

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                                >
                                    <Save size={18} /> {loading ? 'Saving...' : 'Save Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project._id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group hover:border-cyan-500/50 transition-colors">
                        <div className="h-40 bg-slate-900 relative overflow-hidden">
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <ImageIcon size={40} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                                <button
                                    onClick={() => { setCurrentProject(project); setIsEditing(true); }}
                                    className="p-2 bg-blue-500 text-white rounded-full hover:scale-110 transition-transform"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white text-lg truncate">{project.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mt-1">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {project.technologies?.slice(0, 3).map((t, i) => (
                                    <span key={i} className="text-xs bg-slate-700 text-cyan-400 px-2 py-1 rounded">{t}</span>
                                ))}
                                {project.technologies?.length > 3 && (
                                    <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {projects.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                    No projects found. Add one to get started!
                </div>
            )}
        </div>
    );
};

const Input = ({ label, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-gray-400 text-sm mb-1">{label}</label>
        <input
            type={type}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-cyan-500 outline-none transition-colors"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
        />
    </div>
);

const initialFormState = {
    title: '', description: '', image: '', technologies: '', liveLink: '', githubLink: ''
};

export default ProjectManager;
