import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Trash2, Edit2, ExternalLink, Github, X, Image as ImageIcon, Video, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config';

// Predefined project categories (stored as tags)
const PROJECT_CATEGORIES = ['Web', 'Mobile', 'AI', 'ML', 'Backend', 'API', 'Design', 'Game', 'Tool'];

const ProjectManager = () => {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        tags: '',
        categories: [], // New: category checkboxes
        githubLink: '',
        liveLink: '',
        images: [],
        status: 'Published',
        featured: false
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/api/projects`);
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryToggle = (cat) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat]
        }));
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`Image ${file.name} is larger than 5MB`);
                return false;
            }
            return true;
        });

        const readFiles = validFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        const newBase64Images = await Promise.all(readFiles);

        setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), ...newBase64Images]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        // Merge categories into tags
        const categoryTags = formData.categories || [];
        const extraTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        const allTags = [...new Set([...categoryTags, ...extraTags])];

        const payload = {
            ...formData,
            tags: allTags,
            technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
            images: formData.images || [],
            thumbnail: (formData.images && formData.images.length > 0) ? formData.images[0] : null
        };

        try {
            const method = currentId ? 'PUT' : 'POST';
            const url = currentId ? `${API_URL}/api/projects/${currentId}` : `${API_URL}/api/projects`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.status === 401) {
                logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save project');
            }

            toast.success(currentId ? 'Project updated' : 'Project created');
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error('Save Error:', error);
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            const res = await fetch(`${API_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (res.status === 401) {
                logout();
                throw new Error('Session expired. Please login again.');
            }

            toast.success('Project deleted');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleEdit = (project) => {
        setIsEditing(true);
        setCurrentId(project._id);
        // Separate known categories from custom tags
        const tags = project.tags || [];
        const knownCats = tags.filter(t => PROJECT_CATEGORIES.includes(t));
        const customTags = tags.filter(t => !PROJECT_CATEGORIES.includes(t));
        const projectImages = project.images && project.images.length > 0 
            ? project.images 
            : (project.image || project.thumbnail ? [project.image || project.thumbnail] : []);

        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies ? project.technologies.join(', ') : '',
            tags: customTags.join(', '),
            categories: knownCats,
            githubLink: project.githubLink || '',
            liveLink: project.liveLink || '',
            images: projectImages,
            status: project.status || 'Published',
            featured: project.featured || false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: '', description: '', technologies: '', tags: '',
            categories: [],
            githubLink: '', liveLink: '', images: [],
            status: 'Published', featured: false
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Projects</h2>
                    <p className="text-slate-400 mt-1">Manage and showcase your best work</p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                        <Plus className="h-4 w-4 mr-2" /> New Project
                    </Button>
                )}
            </div>

            {/* Form Section */}
            {isEditing && (
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 lg:p-8 rounded-xl border border-slate-700/50 shadow-xl">
                    <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                        {currentId ? <Edit2 className="h-5 w-5 text-cyan-400" /> : <Plus className="h-5 w-5 text-cyan-400" />}
                        {currentId ? 'Edit Project' : 'Create New Project'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Project Title" name="title" value={formData.title} onChange={handleInputChange} required />
                            <Input label="Status" name="status" type="select" value={formData.status} onChange={handleInputChange}>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                                <option value="Completed">Completed</option>
                                <option value="Ongoing">Ongoing</option>
                            </Input>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                            <textarea
                                className="block w-full rounded-lg border-slate-700 bg-slate-900/50 text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm px-4 py-3 border placeholder-slate-600 transition-colors"
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Category / Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {PROJECT_CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleCategoryToggle(cat)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                formData.categories.includes(cat)
                                                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/20'
                                                    : 'bg-slate-800 text-slate-400 border-slate-700/50 hover:text-white hover:bg-slate-700'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[11px] text-slate-600 mt-1.5">Categories power the filter tabs on the Projects page.</p>
                            </div>
                            <Input label="Extra Tags (comma separated)" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g. OpenSource, Portfolio" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="GitHub Link" name="githubLink" value={formData.githubLink} onChange={handleInputChange} placeholder="https://github.com/..." />
                            <Input label="Live Demo Link" name="liveLink" value={formData.liveLink} onChange={handleInputChange} placeholder="https://..." />
                        </div>

                        <div className="flex items-center gap-3 bg-slate-900/30 p-3 rounded-lg border border-slate-700/50 w-full md:w-1/2">
                            <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-slate-600 rounded bg-slate-800" />
                            <label htmlFor="featured" className="text-sm text-slate-300 font-medium cursor-pointer">Feature on Home Page</label>
                        </div>

                        {/* Image Upload */}
                        <div className="border-t border-slate-700/50 pt-6">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Project Images (Cloudinary)</label>
                            <div className="flex flex-col gap-4">
                                <div className="relative h-32 border-2 border-dashed border-slate-700 rounded-xl hover:border-cyan-500/50 transition-colors bg-slate-900/30 flex flex-col items-center justify-center text-center group">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <Upload className="h-8 w-8 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                                    <p className="text-xs text-slate-400 group-hover:text-slate-300">
                                        <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop multiple images
                                    </p>
                                    <p className="text-[10px] text-slate-600 mt-1">First image will be used as thumbnail</p>
                                </div>
                                {formData.images && formData.images.length > 0 && (
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="h-24 w-24 relative rounded-xl overflow-hidden border border-slate-700 shadow-lg shrink-0 group/img">
                                                <img src={img} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }))}
                                                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity z-20"
                                                >
                                                    <Trash2 className="h-5 w-5 mb-1 text-red-400" />
                                                    <span className="text-[10px] font-bold text-red-400">Remove</span>
                                                </button>
                                                {index === 0 && (
                                                    <div className="absolute top-0 left-0 bg-cyan-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                                                        THUMBNAIL
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/50">
                            <Button type="button" variant="ghost" onClick={resetForm} disabled={uploading}>Cancel</Button>
                            <Button type="submit" disabled={uploading}>
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Save Project'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table Section */}
            {!isEditing && (
                <div className="bg-slate-800/50 backdrop-blur-sm shadow-xl rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700/50">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
                                                    {project.image || project.thumbnail ? (
                                                        <img className="h-10 w-10 object-cover" src={project.image || project.thumbnail} alt="" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-5 w-5 text-slate-600" /></div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-100">{project.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${project.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    project.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        project.status === 'Ongoing' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                            'bg-slate-700 text-slate-400 border border-slate-600'}`}>
                                                {project.status || 'Published'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {(project.tags || []).slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50">{tag}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(project)} className="text-slate-400 hover:text-cyan-400 transition-colors p-1"><Edit2 className="h-4 w-4" /></button>
                                                <button onClick={() => handleDelete(project._id)} className="text-slate-400 hover:text-red-400 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectManager;
