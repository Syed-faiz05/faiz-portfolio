import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

const SkillManager = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ name: '', level: 50 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/skills');
            const data = await res.json();
            setSkills(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
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
                setNewSkill({ name: '', level: 50 });
                fetchSkills();
            }
        } catch (error) { }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`/api/skills/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setSkills(prev => prev.filter(s => s._id !== id));
        } catch (error) { }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Skill Manager</h2>

            {/* Quick Add Form */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Add New Skill</h3>
                <form onSubmit={handleAdd} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Skill Name</label>
                        <input
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                            value={newSkill.name}
                            onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                            placeholder="e.g. React"
                            required
                        />
                    </div>
                    <div className="w-32">
                        <label className="block text-xs text-gray-400 mb-1">Proficiency (%)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                            value={newSkill.level}
                            onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
                            min="1" max="100"
                        />
                    </div>
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-white p-2.5 rounded-lg">
                        <Plus size={20} />
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {skills.map(skill => (
                    <div key={skill._id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center group hover:border-cyan-500/30 transition-colors">
                        <div>
                            <div className="font-bold text-white">{skill.name}</div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 w-24">
                                <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(skill._id)}
                            className="bg-red-500/10 text-red-400 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillManager;
