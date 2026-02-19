import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast'; // Corrected import
import { User, Lock, Save } from 'lucide-react';

const Settings = () => {
    // const { user, updateProfile } = useAuth(); // Assuming updateProfile exists in context
    const { user, updateProfile } = useAuth();

    const [username, setUsername] = useState(user?.username || 'admin');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }

        setLoading(true);
        const payload = { username };
        if (password) payload.password = password;

        const { success, error } = await updateProfile(payload);
        setLoading(false);

        if (success) {
            toast.success('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
        } else {
            toast.error(error || 'Failed to update profile');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
                <p className="text-slate-400 mt-1">Manage your account preferences</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
                <div className="md:grid md:grid-cols-3 md:gap-6 p-6 lg:p-8">
                    <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-700/50 pb-6 md:pb-0 md:pr-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                <User className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-medium leading-6 text-slate-100">Profile</h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                            Update your admin public display name and other personal details.
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0 md:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                icon={User}
                            />

                            <div className="pt-6 border-t border-slate-700/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <h4 className="text-base font-medium text-slate-100">Security</h4>
                                </div>
                                <div className="space-y-4">
                                    <Input
                                        label="New Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep current"
                                    />
                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" isLoading={loading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
