import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Trash2, Edit2, GripVertical, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config';

const AboutManager = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        period: '',
        title: '',
        subtitle: '',
        description: '',
        type: 'experience',
        isVisible: true,
        order: 0
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch(`${API_URL}/api/about/all`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to load timeline items');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = currentId ? 'PUT' : 'POST';
            const url = currentId ? `${API_URL}/api/about/${currentId}` : `${API_URL}/api/about`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to save item');

            toast.success(currentId ? 'Updated successfully' : 'Created successfully');
            resetForm();
            fetchItems();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this timeline item?')) return;
        try {
            await fetch(`${API_URL}/api/about/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Deleted successfully');
            fetchItems();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrentId(item._id);
        setFormData({
            period: item.period,
            title: item.title,
            subtitle: item.subtitle || '',
            description: item.description || '',
            type: item.type || 'experience',
            isVisible: item.isVisible,
            order: item.order || 0
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            period: '', title: '', subtitle: '', description: '',
            type: 'experience', isVisible: true, order: items.length + 1
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">About Me Timeline</h2>
                    <p className="text-slate-400 mt-1">Manage your journey milestones</p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                        <Plus className="h-4 w-4 mr-2" /> New Milestone
                    </Button>
                )}
            </div>

            {/* Form */}
            {isEditing && (
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                    <h3 className="text-lg font-semibold text-slate-200 mb-6">
                        {currentId ? 'Edit Milestone' : 'Add New Milestone'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Year / Period" name="period" value={formData.period} onChange={handleInputChange} placeholder="e.g. 2024 - Present" required />
                            <Input label="Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Developer" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Subtitle (Optional)" name="subtitle" value={formData.subtitle} onChange={handleInputChange} placeholder="e.g. Company Name or Institution" />
                            <Input label="Type" name="type" type="select" value={formData.type} onChange={handleInputChange}>
                                <option value="experience">Experience</option>
                                <option value="education">Education</option>
                                <option value="achievement">Achievement</option>
                                <option value="goal">Goal</option>
                                <option value="other">Other</option>
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
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <Input label="Order Priority" name="order" type="number" value={formData.order} onChange={handleInputChange} className="w-24" />

                            <div className="flex items-center gap-3 bg-slate-900/30 p-3 rounded-lg border border-slate-700/50 mt-6">
                                <input type="checkbox" id="isVisible" name="isVisible" checked={formData.isVisible} onChange={handleInputChange} className="h-5 w-5 text-cyan-600 rounded bg-slate-800" />
                                <label htmlFor="isVisible" className="text-sm text-slate-300 font-medium cursor-pointer">Visible Publicly</label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                            <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                            <Button type="submit">Save Milestone</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            {!isEditing && (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item._id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-slate-500 cursor-grab active:cursor-grabbing p-2 hover:bg-slate-800 rounded">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono text-cyan-400 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/20">{item.period}</span>
                                        <h4 className="font-semibold text-slate-200">{item.title}</h4>
                                        {!item.isVisible && <span className="text-xs text-amber-500 flex items-center gap-1 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded"><XCircle className="w-3 h-3" /> Hidden</span>}
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{item.subtitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"><Edit2 className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && !loading && (
                        <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                            <p className="text-slate-500">No milestones yet. Create one to get started!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AboutManager;
