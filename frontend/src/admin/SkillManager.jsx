import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';

const SkillManager = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', level: 80 });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/skills');
            const data = await res.json();
            setSkills(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newSkill)
            });
            if (res.ok) {
                setNewSkill({ name: '', category: 'Frontend', level: 80 });
                fetchSkills();
            }
        } catch (error) {
            alert('Failed to add skill');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`/api/skills/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setSkills(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    // Group skills by category for better visualization
    const groupedSkills = skills.reduce((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    if (loading) return <div className="text-sm text-gray-500">Loading skills...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Skills</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your technical expertise</p>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Add New Skill</h3>
                <form onSubmit={handleAdd} className="flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Skill Name</label>
                        <input
                            required
                            value={newSkill.name}
                            onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                            className="w-full text-sm p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. React.js"
                        />
                    </div>
                    <div className="w-[180px]">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                        <select
                            value={newSkill.category}
                            onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                            className="w-full text-sm p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Tools">Tools</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="w-[100px]">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Level ({newSkill.level}%)</label>
                        <input
                            type="number"
                            min="1" max="100"
                            value={newSkill.level}
                            onChange={e => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                            className="w-full text-sm p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        Add Skill
                    </button>
                </form>
            </div>

            {/* Grouped Lists */}
            <div className="space-y-6">
                {Object.keys(groupedSkills).length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No skills added yet.
                    </div>
                )}

                {Object.entries(groupedSkills).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-1">{category}</h3>
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {items.map(skill => (
                                    <li key={skill._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="font-medium text-slate-800 text-sm">{skill.name}</span>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-slate-800 h-full rounded-full"
                                                    style={{ width: `${skill.level}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-400 w-8 text-right">{skill.level}%</span>

                                            <button
                                                onClick={() => handleDelete(skill._id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors px-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillManager;
