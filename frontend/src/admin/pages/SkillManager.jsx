import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Trash2, Edit2, X, Save, Wrench, Code2, Database, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config';

const SkillManager = () => {
    const { user, logout } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', level: 50, category: 'Frontend' });

    useEffect(() => {
        fetchSkills();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch(`${API_URL}/api/skills`);
            if (res.status === 401) {
                logout();
                return;
            }
            const data = await res.json();
            setSkills(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to load skills');
            setSkills([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${API_URL}/api/skills/${editingId}` : `${API_URL}/api/skills`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.status === 401) {
                logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) throw new Error('Failed to save skill');

            toast.success(editingId ? 'Skill updated' : 'Skill added');
            setFormData({ name: '', level: 50, category: 'Frontend' });
            setEditingId(null);
            fetchSkills();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;

        try {
            const res = await fetch(`${API_URL}/api/skills/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (res.status === 401) {
                logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) throw new Error('Failed to delete');

            toast.success('Skill deleted');
            fetchSkills();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEdit = (skill) => {
        setEditingId(skill._id);
        setFormData({ name: skill.name, level: skill.level, category: skill.category || 'Frontend' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ name: '', level: 50, category: 'Frontend' });
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Frontend': return <LayoutTemplate className="h-5 w-5" />;
            case 'Backend': return <Database className="h-5 w-5" />;
            case 'Tools': return <Wrench className="h-5 w-5" />;
            default: return <Code2 className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Skills</h2>
                    <p className="text-slate-400 mt-1">Add and manage your technical expertise</p>
                </div>
            </div>

            {/* Add/Edit Form Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-lg">
                <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
                    {editingId ? <Edit2 className="h-5 w-5 text-cyan-400" /> : <Plus className="h-5 w-5 text-cyan-400" />}
                    {editingId ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <Input
                            label="Skill Name"
                            placeholder="e.g. React"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="w-24">
                        <Input
                            label="Level %"
                            type="number"
                            min="0" max="100"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        />
                    </div>
                    <div className="w-48">
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Category</label>
                        <div className="relative">
                            <select
                                className="block w-full rounded-lg border-slate-700 bg-slate-900/50 text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm px-4 py-2.5 border transition-colors appearance-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Frontend</option>
                                <option>Backend</option>
                                <option>Tools</option>
                                <option>Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 pb-0.5">
                        <Button type="submit" variant="primary">
                            {editingId ? <Save className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                            {editingId ? 'Update' : 'Add'}
                        </Button>
                        {editingId && (
                            <Button type="button" variant="ghost" onClick={handleCancel}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-slate-800/30 shadow-xl sm:rounded-xl overflow-hidden border border-slate-700/50">
                <ul className="divide-y divide-slate-700/50">
                    {Array.isArray(skills) && skills.map((skill) => (
                        <li key={skill._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400 border border-slate-700 shadow-sm">
                                    {getCategoryIcon(skill.category)}
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-slate-100">{skill.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                                            {skill.category || 'General'}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            • {skill.level}% Proficiency
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Proficiency Bar */}
                                <div className="hidden sm:block w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                                        style={{ width: `${skill.level}%` }}
                                    ></div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(skill)}
                                        className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-700 rounded-full transition-all"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill._id)}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-full transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {skills.length === 0 && !loading && (
                        <li className="px-6 py-12 text-center text-slate-500">
                            <Wrench className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            No skills added yet. start building your profile.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SkillManager;
