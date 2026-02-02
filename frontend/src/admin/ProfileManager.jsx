import { useEffect, useState } from 'react';
import { Save, User, Loader2 } from 'lucide-react';

const ProfileManager = () => {
    const [profile, setProfile] = useState({
        name: '',
        title: '',
        bio: '',
        socialLinks: { github: '', linkedin: '', leetcode: '', email: '' }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data) setProfile(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });
            if (res.ok) alert('Profile updated!');
        } catch (error) {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfile(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    if (loading) return <div className="text-slate-500">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Profile Settings</h2>
            <p className="text-sm text-slate-500 mb-8">Update your public profile information</p>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Display Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Headline / Title</label>
                            <input
                                type="text"
                                name="title"
                                value={profile.title}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Bio</label>
                        <textarea
                            name="bio"
                            rows="4"
                            value={profile.bio}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">GitHub URL</label>
                            <input
                                type="text"
                                name="socialLinks.github"
                                value={profile.socialLinks?.github || ''}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">LinkedIn URL</label>
                            <input
                                type="text"
                                name="socialLinks.linkedin"
                                value={profile.socialLinks?.linkedin || ''}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                name="socialLinks.email"
                                value={profile.socialLinks?.email || ''}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileManager;
