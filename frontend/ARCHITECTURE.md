# Frontend Architecture & Full Codebase Dump

This document contains the complete codebase for the frontend as of the latest update.

## src/admin/AdminLayout.jsx
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { Loader2 } from 'lucide-react';

const AdminLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">
            {/* Mobile Sidebar could be added here later */}
            <Sidebar />

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

```

## src/admin/components/Sidebar.jsx
```jsx
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Wrench, Settings, LogOut, MessageSquare, Award, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
        { name: 'About Me', path: '/admin/about', icon: Clock },
        { name: 'Skills', path: '/admin/skills', icon: Wrench },
        { name: 'Achievements', path: '/admin/achievements', icon: Award },
        { name: 'Blog', path: '/admin/blog', icon: BookOpen },
        { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 min-h-screen fixed inset-y-0 left-0 border-r border-slate-800 shadow-xl z-20">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <span className="text-xl font-bold tracking-tight text-white">Portfolio<span className="text-cyan-400">CMS</span></span>
            </div>

            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
                <p className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={cn(
                                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                                    active
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                )}
                            >
                                <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0 transition-colors", active ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-400 rounded-lg hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 text-slate-500 hover:text-red-400" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

```

## src/admin/components/Topbar.jsx
```jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Overview';
        if (path.includes('projects')) return 'Projects';
        if (path.includes('skills')) return 'Skills';
        if (path.includes('achievements')) return 'Achievements';
        if (path.includes('blog')) return 'Blog';
        if (path.includes('messages')) return 'Messages';
        if (path.includes('settings')) return 'Settings';
        return 'Admin';
    };

    return (
        <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="h-6 w-px bg-slate-700 mx-1"></div>
                <h1 className="text-xl font-semibold text-slate-100">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-6">

                {/* Search Placeholder */}
                <div className="hidden md:flex relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-slate-950 border border-slate-800 text-sm rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:border-cyan-500/50 text-slate-300 w-48 placeholder-slate-600 transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-slate-900"></span>
                </button>

                <div className="h-6 w-px bg-slate-700"></div>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-200">{user?.username || 'Admin'}</p>
                        <p className="text-xs text-slate-500">Super Admin</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;

```

## src/admin/components/ui/Button.jsx
```jsx
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    type = 'button',
    ...props
}) => {
    const variants = {
        primary: 'bg-cyan-600 hover:bg-cyan-500 text-white focus:ring-cyan-500 shadow-lg shadow-cyan-500/20',
        secondary: 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-slate-500',
        danger: 'bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500',
        ghost: 'text-slate-400 hover:bg-slate-800 hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;

```

## src/admin/components/ui/Input.jsx
```jsx
import { cn } from '../../../lib/utils';

const Input = ({ label, error, className, id, type, children, ...props }) => {
    const inputClasses = cn(
        'block w-full rounded-lg border-slate-700 bg-slate-900/50 text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm px-4 py-2.5 border transition-colors placeholder-slate-600',
        error && 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500',
        className
    );

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-1.5">
                    {label}
                </label>
            )}

            {type === 'select' ? (
                <select
                    id={id}
                    className={inputClasses}
                    {...props}
                >
                    {children}
                </select>
            ) : (
                <input
                    id={id}
                    type={type}
                    className={inputClasses}
                    {...props}
                />
            )}

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;

```

## src/admin/pages/AboutManager.jsx
```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Trash2, Edit2, GripVertical, CheckCircle, XCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config';

const AboutManager = () => {
    const { user, logout } = useAuth();
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
        order: 0,
        image: null,
        imagePreview: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch(`${API_URL}/api/about/all`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.status === 401) {
                logout();
                return;
            }
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = currentId ? 'PUT' : 'POST';
            const url = currentId ? `${API_URL}/api/about/${currentId}` : `${API_URL}/api/about`;

            const payload = {
                ...formData,
                image: formData.image || ''
            };

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
            const res = await fetch(`${API_URL}/api/about/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (res.status === 401) {
                logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!res.ok) throw new Error('Failed to delete');

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
            order: item.order || 0,
            image: null,
            imagePreview: item.image || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            period: '', title: '', subtitle: '', description: '',
            type: 'experience', isVisible: true, order: items.length + 1,
            image: null, imagePreview: ''
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

                        {/* Image Upload */}
                        <div className="border-t border-slate-700/50 pt-6">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Timeline Image (Optional)</label>
                            <div className="flex items-start gap-4">
                                <div className="relative flex-1 h-32 border-2 border-dashed border-slate-700 rounded-xl hover:border-cyan-500/50 transition-colors bg-slate-900/30 flex flex-col items-center justify-center text-center group">
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <Upload className="h-8 w-8 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                                    <p className="text-xs text-slate-400 group-hover:text-slate-300">
                                        <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                                    </p>
                                </div>
                                {formData.imagePreview && (
                                    <div className="h-32 w-32 relative rounded-xl overflow-hidden border border-slate-700 shadow-lg shrink-0">
                                        <img src={formData.imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: '' }))}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity z-20"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                )}
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

```

## src/admin/pages/Achievements.jsx
```jsx
import { Award } from 'lucide-react';

const Achievements = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-100">Achievements</h2>
                <p className="text-slate-400 mt-1">Showcase your certifications and awards</p>
            </div>

            <div className="flex flex-col items-center justify-center p-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">Feature Coming Soon</h3>
                <p className="text-slate-500 mt-1 max-w-sm text-center">
                    This module is currently under development. Check back later for updates.
                </p>
            </div>
        </div>
    );
};

export default Achievements;

```

## src/admin/pages/Blog.jsx
```jsx
import { BookOpen } from 'lucide-react';

const Blog = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-100">Blog Posts</h2>
                <p className="text-slate-400 mt-1">Manage your articles and tutorials</p>
            </div>

            <div className="flex flex-col items-center justify-center p-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">Feature Coming Soon</h3>
                <p className="text-slate-500 mt-1 max-w-sm text-center">
                    This module is currently under development. Check back later for updates.
                </p>
            </div>
        </div>
    );
};

export default Blog;

```

## src/admin/pages/Dashboard.jsx
```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layers, Code, MessageSquare, ArrowRight, Activity, Users, MapPin, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../../config';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

// Reusable animated Stat Card
const StatCard = ({ title, value, icon: Icon, color, to, gradient }) => (
    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="block group">
        <Link to={to} className="block h-full">
            <div className={`relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-${color.split('-')[1]}-500/10 hover:border-${color.split('-')[1]}-500/30 h-full flex flex-col`}>
                {/* Background Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>

                <div className="p-6 flex-grow relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400 truncate mb-1">{title}</p>
                            <h3 className="text-4xl font-black text-slate-100 tracking-tight">{value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl bg-slate-900/50 ring-1 ring-inset ring-${color.split('-')[1]}-500/20 group-hover:bg-slate-900/80 transition-colors`}>
                            <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 px-6 py-3 border-t border-slate-700/50 relative z-10">
                    <div className={`text-xs font-semibold ${color} flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300`}>
                        Manage {title} <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                </div>
            </div>
        </Link>
    </motion.div>
);

const QuickActionBtn = ({ label, icon: Icon, to, color }) => (
    <Link to={to}>
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors text-sm font-medium ${color}`}
        >
            <Icon className="h-4 w-4" /> {label}
        </motion.button>
    </Link>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                if (res.status === 401) {
                    logout();
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    console.error('Failed to fetch stats');
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchStats();
        }
    }, [user?.token]);

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-cyan-500/20 animate-pulse"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 relative z-10"></div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 pb-8"
        >
            {/* Header Area */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/20 p-6 rounded-2xl border border-slate-700/30">
                <div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">Command Center</h2>
                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Welcome back, <span className="text-cyan-400 font-medium">{user?.username}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to="/" target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl text-sm font-semibold transition-all border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <Eye className="h-4 w-4" /> Live Site
                    </Link>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionBtn label="New Project" icon={Plus} to="/admin/projects" color="text-indigo-400 hover:text-indigo-300" />
                <QuickActionBtn label="Add Skill" icon={Plus} to="/admin/skills" color="text-emerald-400 hover:text-emerald-300" />
                <QuickActionBtn label="Add Milestone" icon={Plus} to="/admin/about" color="text-amber-400 hover:text-amber-300" />
                <QuickActionBtn label="View Messages" icon={MessageSquare} to="/admin/messages" color="text-purple-400 hover:text-purple-300" />
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Visitors" value={stats?.counts?.visitors || 0} icon={Users} color="text-cyan-400" gradient="from-cyan-500 to-blue-500" to="/admin/dashboard" />
                <StatCard title="Projects" value={stats?.counts?.projects || 0} icon={Layers} color="text-indigo-400" gradient="from-indigo-500 to-purple-500" to="/admin/projects" />
                <StatCard title="Tech Skills" value={stats?.counts?.skills || 0} icon={Code} color="text-emerald-400" gradient="from-emerald-500 to-teal-500" to="/admin/skills" />
                <StatCard title="Timeline Events" value={stats?.counts?.milestones || 0} icon={Activity} color="text-amber-400" gradient="from-amber-500 to-orange-500" to="/admin/about" />
            </div>

            {/* Lists Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Projects - 1 Column */}
                <motion.div variants={itemVariants} className="lg:col-span-1 bg-slate-800/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700/50 flex flex-col h-[420px]">
                    <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg"><Layers className="h-4 w-4 text-indigo-400" /></div>
                            <h3 className="text-base font-semibold text-slate-100">Latest Builds</h3>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                        <motion.ul variants={listContainerVariants} initial="hidden" animate="visible" className="space-y-1">
                            {stats?.recentProjects?.map((project) => (
                                <motion.li variants={listItemVariants} key={project._id} className="p-3 hover:bg-slate-700/30 rounded-xl transition-colors flex items-center gap-4 group">
                                    <div className="h-10 w-10 rounded-lg bg-slate-900 flex-shrink-0 overflow-hidden border border-slate-700/50">
                                        {project.image ? (
                                            <img src={project.image} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-600"><Layers className="h-4 w-4" /></div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-200 truncate">{project.title}</p>
                                        <span className={`inline-flex items-center px-1.5 py-[1px] rounded text-[10px] font-medium mt-1 uppercase tracking-wider ${project.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}>
                                            {project.status || 'Published'}
                                        </span>
                                    </div>
                                </motion.li>
                            ))}
                            {(!stats?.recentProjects || stats.recentProjects.length === 0) && (
                                <li className="px-6 py-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                                    <Layers className="h-8 w-8 opacity-20" /> No projects found
                                </li>
                            )}
                        </motion.ul>
                    </div>
                </motion.div>

                {/* Recent Messages - 1 Column */}
                <motion.div variants={itemVariants} className="lg:col-span-1 bg-slate-800/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700/50 flex flex-col h-[420px]">
                    <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-purple-500/10 rounded-lg"><MessageSquare className="h-4 w-4 text-purple-400" /></div>
                            <h3 className="text-base font-semibold text-slate-100">Inbox</h3>
                        </div>
                        {stats?.counts?.messages > 0 && <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full border border-purple-500/20">{stats.counts.messages}</span>}
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                        <motion.ul variants={listContainerVariants} initial="hidden" animate="visible" className="space-y-1">
                            {stats?.recentMessages?.map((msg) => (
                                <motion.li variants={listItemVariants} key={msg._id} className="p-4 hover:bg-slate-700/30 rounded-xl transition-colors relative">
                                    {!msg.read && <span className="absolute left-2.5 top-5 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></span>}
                                    <div className="flex justify-between items-start mb-1 pl-3">
                                        <span className={`text-sm tracking-tight ${!msg.read ? 'text-white font-semibold' : 'text-slate-300 font-medium'}`}>{msg.name}</span>
                                        <span className="text-[10px] text-slate-500 font-mono tracking-tighter">{new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate pl-3">{msg.subject}</p>
                                </motion.li>
                            ))}
                            {(!stats?.recentMessages || stats.recentMessages.length === 0) && (
                                <li className="px-6 py-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                                    <MessageSquare className="h-8 w-8 opacity-20" /> No messages
                                </li>
                            )}
                        </motion.ul>
                    </div>
                </motion.div>

                {/* Recent Visitors - 1 Column */}
                <motion.div variants={itemVariants} className="lg:col-span-1 bg-slate-800/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700/50 flex flex-col h-[420px]">
                    <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-cyan-500/10 rounded-lg"><Activity className="h-4 w-4 text-cyan-400" /></div>
                            <h3 className="text-base font-semibold text-slate-100">Live Traffic</h3>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                        <motion.ul variants={listContainerVariants} initial="hidden" animate="visible" className="space-y-1">
                            {stats?.recentVisitors?.map((visitor) => (
                                <motion.li variants={listItemVariants} key={visitor._id} className="p-3 hover:bg-slate-700/30 rounded-xl transition-colors">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <MapPin className="w-3 h-3 text-cyan-500" />
                                            <span className="text-sm font-mono">{visitor.ip || 'Unknown IP'}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider border border-slate-700">{visitor.path || '/'}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate mt-1">
                                        {new Date(visitor.timestamp).toLocaleString()} • {visitor.userAgent?.split(' ')[0] || 'Unknown Browser'}
                                    </p>
                                </motion.li>
                            ))}
                            {(!stats?.recentVisitors || stats.recentVisitors.length === 0) && (
                                <li className="px-6 py-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                                    <Activity className="h-8 w-8 opacity-20" /> No recent traffic
                                </li>
                            )}
                        </motion.ul>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Dashboard;

```

## src/admin/pages/Login.jsx
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const result = await login(credentials.username, credentials.password);

        if (result.success) {
            toast.success('Welcome back, Admin!');
            navigate('/admin/dashboard');
        } else {
            toast.error(result.error || 'Invalid credentials');
        }

        setSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        System Access
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">Please identify yourself to proceed</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                                className="block w-full pl-10 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                placeholder="..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                className="block w-full pl-10 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full relative group overflow-hidden bg-cyan-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-70"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-2">
                            {submitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                'Login'
                            )}
                        </span>
                    </button>

                </form>
            </motion.div>
        </div>
    );
};

export default Login;

```

## src/admin/pages/Messages.jsx
```jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Star, Trash2, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config';

const Messages = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to load messages');
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const toggleRead = async (id, currentStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/messages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ read: !currentStatus })
            });
            if (!res.ok) throw new Error('Failed to update status');

            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, read: !msg.read } : msg
            ));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const toggleStar = async (id, currentStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/messages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ starred: !currentStatus })
            });
            if (!res.ok) throw new Error('Failed to update star');

            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, starred: !msg.starred } : msg
            ));
        } catch (error) {
            toast.error('Failed to update star');
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            const res = await fetch(`${API_URL}/api/messages/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to delete');

            setMessages(messages.filter(msg => msg._id !== id));
            toast.success('Message deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'unread') return !msg.read;
        if (filter === 'starred') return msg.starred;
        return true;
    });

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Messages</h2>
                    <p className="text-slate-400 mt-1">Check your inbox for new opportunities</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    {['all', 'unread', 'starred'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${filter === f ? 'bg-slate-700 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-700/50 flex items-center gap-3">
                    <Search className="h-5 w-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 w-full"
                    />
                </div>

                {/* Message List */}
                <div className="divide-y divide-slate-700/50">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`group flex items-start gap-4 p-5 hover:bg-slate-800/80 transition-colors cursor-pointer ${!msg.read ? 'bg-cyan-900/10' : ''}`}
                        >
                            {/* Actions */}
                            <div className="flex flex-col gap-2 mt-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleStar(msg._id, msg.starred); }}
                                    className={`text-slate-500 hover:text-yellow-400 transition-colors ${msg.starred ? 'text-yellow-400' : ''}`}
                                >
                                    <Star className="h-5 w-5 fill-current" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleRead(msg._id, msg.read); }}
                                    className={`text-slate-500 hover:text-cyan-400 transition-colors`}
                                    title={msg.read ? "Mark as unread" : "Mark as read"}
                                >
                                    <div className={`h-4 w-4 rounded-full border-2 border-slate-400 ${!msg.read ? 'bg-cyan-400 border-cyan-400' : ''}`}></div>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`text-base truncate ${!msg.read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                                            {msg.name}
                                        </h4>
                                        <span className="text-xs text-slate-500">&lt;{msg.email}&gt;</span>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-cyan-400/80 font-medium mb-1 truncate">{msg.subject}</p>
                                <p className="text-sm text-slate-400 line-clamp-2">{msg.message}</p>
                            </div>

                            {/* Delete Action (Hover) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-full transition-all"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {filteredMessages.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No messages found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;

```

## src/admin/pages/ProjectManager.jsx
```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Trash2, Edit2, ExternalLink, Github, X, Image as ImageIcon, Video, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config';

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
        githubLink: '',
        liveLink: '',
        image: null, // File object
        imagePreview: '', // URL for preview
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        // Format tags and technologies as arrays
        const payload = {
            ...formData,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
            images: formData.image ? [formData.image] : [], // Wrap single image in array for backend compatibility
            thumbnail: formData.image // Also set as thumbnail
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
        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies ? project.technologies.join(', ') : '',
            tags: project.tags ? project.tags.join(', ') : '',
            githubLink: project.githubLink || '',
            liveLink: project.liveLink || '',
            image: null,
            imagePreview: project.image || project.thumbnail || '',
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
            githubLink: '', liveLink: '', image: null, imagePreview: '',
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
                            <Input label="Tags (comma separated)" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Web, Mobile, AI" />
                            <Input label="Technologies (comma separated)" name="technologies" value={formData.technologies} onChange={handleInputChange} placeholder="React, Node.js, MongoDB" />
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
                            <label className="block text-sm font-medium text-slate-400 mb-2">Project Image (Cloudinary)</label>
                            <div className="flex items-start gap-4">
                                <div className="relative flex-1 h-32 border-2 border-dashed border-slate-700 rounded-xl hover:border-cyan-500/50 transition-colors bg-slate-900/30 flex flex-col items-center justify-center text-center group">
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <Upload className="h-8 w-8 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                                    <p className="text-xs text-slate-400 group-hover:text-slate-300">
                                        <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-[10px] text-slate-600 mt-1">First image will be used as thumbnail</p>
                                </div>
                                {formData.imagePreview && (
                                    <div className="h-32 w-32 relative rounded-xl overflow-hidden border border-slate-700 shadow-lg shrink-0">
                                        <img src={formData.imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: '' }))}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity z-20"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
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

```

## src/admin/pages/Settings.jsx
```jsx
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

```

## src/admin/pages/SkillManager.jsx
```jsx
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

```

## src/App.jsx
```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';

// Admin

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ProjectManager from './admin/pages/ProjectManager';
import AboutManager from './admin/pages/AboutManager';
import SkillManager from './admin/pages/SkillManager';
import Achievements from './admin/pages/Achievements';
import Blog from './admin/pages/Blog';
import Messages from './admin/pages/Messages';
import Settings from './admin/pages/Settings';
import Login from './admin/pages/Login';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="bottom-right" />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectManager />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="skills" element={<SkillManager />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="blog" element={<Blog />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public Routes - Main Layout */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Public Layout Wrapper
const MainLayout = () => (
  <div className="relative min-h-screen text-white bg-slate-900">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
    <Footer />
  </div>
);

export default App;

```

## src/components/About.jsx
```jsx
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Html, Stars, Sparkles, Float, PerspectiveCamera, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Award, Zap, Code, Database, Rocket, Cpu } from 'lucide-react';

// --- Configuration ---
const PRIMARY_COLOR = '#00f3ff';   // Neon Cyan
const SECONDARY_COLOR = '#0066ff'; // Electric Blue
const ACCENT_COLOR = '#ff0055';    // Warning/Action
const BG_COLOR = '#000000';
const STEPS = 8;

// --- Data with "Certificates" ---
const ROADMAP_DATA = [
    {
        t: 0.08,
        phase: "CERTIFICATION_01",
        title: "Frontend Foundations",
        desc: "Mastered the core building blocks of the web. Responsive design principles and semantic HTML5 architecture.",
        tags: ["HTML5", "CSS3", "Responsive UI"],
        icon: <Code size={24} />,
        color: PRIMARY_COLOR,
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.25,
        phase: "CERTIFICATION_02",
        title: "Advanced JavaScript",
        desc: "Deep dive into ES6+, asynchronous programming, closures, and modern DOM manipulation techniques.",
        tags: ["ES6+", "Async/Await", "DOM"],
        icon: <Zap size={24} />,
        color: "#facc15",
        img: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.42,
        phase: "CERTIFICATION_03",
        title: "React Architecture",
        desc: "Component-based design, state management with Hooks/Context, and Single Page Application routing.",
        tags: ["React 18", "Hooks", "Redux"],
        icon: <Cpu size={24} />,
        color: SECONDARY_COLOR,
        img: "https://images.unsplash.com/photo-1633356122102-3fe601e19153?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.58,
        phase: "CERTIFICATION_04",
        title: "Python Data Structures",
        desc: "Algorithmic problem solving, time complexity analysis, and data structure implementation in Python.",
        tags: ["Python", "DSA", "Algorithms"],
        icon: <Database size={24} />,
        color: "#10b981", // Emerald
        img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.75,
        phase: "CERTIFICATION_05",
        title: "Full Stack Systems",
        desc: "End-to-end application development. RESTful API design, database integration, and secure authentication.",
        tags: ["Node.js", "MongoDB", "Auth"],
        icon: <Rocket size={24} />,
        color: "#a855f7", // Purple
        img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.95,
        phase: "VISION_2026",
        title: "Future Architect",
        desc: "Designing scalable cloud-native systems and exploring next-gen AI integration patterns.",
        tags: ["System Design", "Cloud", "AI"],
        icon: <Award size={24} />,
        color: "#ffffff",
        img: "https://images.unsplash.com/photo-1535378437803-dbfe5d034688?q=80&w=300&auto=format&fit=crop"
    }
];

// --- Sub-Components ---

function WarpParticles() {
    const mesh = useRef();
    useFrame(() => {
        mesh.current.rotation.z += 0.001; // Slow swirl
    });
    return (
        <group ref={mesh}>
            {/* Drift Particles */}
            <Sparkles count={300} scale={[20, 20, 100]} size={2} speed={0.4} opacity={0.5} noise={0.2} color="#ffffff" />
            {/* Distant Nebula Fog */}
            <Cloud opacity={0.05} speed={0.1} width={50} depth={5} segments={10} position={[0, -10, -50]} color="#001133" />
        </group>
    );
}

function GridRoad({ curve }) {
    const ref = useRef();
    const texture = useMemo(() => {
        const t = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/grid.png');
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(50, 4);
        return t;
    }, []);

    useFrame(() => {
        if (ref.current) ref.current.map.offset.x -= 0.05; // High speed effect
    });

    const geometry = useMemo(() => new THREE.TubeGeometry(curve, 150, 4, 16, false), [curve]);

    return (
        <mesh geometry={geometry} receiveShadow castShadow>
            <meshStandardMaterial
                ref={ref}
                map={texture}
                color="#000000"
                emissive={PRIMARY_COLOR}
                emissiveIntensity={0.5}
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.6}
            />
        </mesh>
    );
}

function HolographicCards({ curve }) {
    const scroll = useScroll();
    const [active, setActive] = useState(null);

    useFrame(() => {
        const offset = scroll.offset;
        let nearest = null;
        let minDist = 0.06;

        ROADMAP_DATA.forEach((item, index) => {
            if (Math.abs(offset - item.t) < minDist) nearest = index;
        });

        if (nearest !== active) setActive(nearest);
    });

    return (
        <group>
            {ROADMAP_DATA.map((item, index) => {
                const point = curve.getPoint(item.t);
                const isActive = index === active;

                return (
                    <group key={index} position={point}>
                        {/* 3D Marker - Floating Crystal */}
                        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
                            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                                <boxGeometry args={[1, 1, 1]} />
                                <meshPhysicalMaterial
                                    color={isActive ? item.color : '#333'}
                                    emissive={isActive ? item.color : '#000'}
                                    emissiveIntensity={isActive ? 2 : 0}
                                    transmission={1}
                                    thickness={0.5}
                                    roughness={0}
                                />
                            </mesh>
                        </Float>

                        {/* Connection Line */}
                        {isActive && (
                            <mesh position={[4, 1, 0]} rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.02, 0.02, 6, 8]} />
                                <meshBasicMaterial color={item.color} transparent opacity={0.5} />
                            </mesh>
                        )}

                        {/* Glassmorphism UI Card */}
                        <Html
                            position={[7, 1, 0]} // Offset to the right
                            center
                            transform
                            occlude
                            distanceFactor={10}
                            style={{
                                opacity: isActive ? 1 : 0,
                                transform: `scale(${isActive ? 1 : 0.9})`,
                                transition: 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
                                pointerEvents: 'none'
                            }}
                        >
                            <div className="w-[450px] font-sans antialiased text-left">
                                {/* The Card Container */}
                                <div className={`
                                    relative overflow-hidden rounded-3xl p-[1px]
                                    bg-gradient-to-br from-white/20 via-white/5 to-transparent
                                    backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]
                                `}>
                                    {/* Inner Content Content */}
                                    <div className="bg-black/40 rounded-3xl p-6 h-full relative z-10">

                                        {/* Header: Badge & Icon */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-white/10 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2 backdrop-blur-md">
                                                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color }} />
                                                <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">{item.phase}</span>
                                            </div>
                                            <div className="text-white/80 p-2 bg-white/5 rounded-full">
                                                {item.icon}
                                            </div>
                                        </div>

                                        {/* Title & Desc */}
                                        <h2 className="text-3xl font-medium text-white mb-3 tracking-tight">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">
                                            {item.desc}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-medium text-white/70 bg-white/5 px-2 py-1 rounded border border-white/5">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Certificate Preview/Footer */}
                                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                                                {/* Placeholder for certificate image */}
                                                <img src={item.img} alt="cert" className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-white/50 uppercase tracking-widest mb-0.5">Verified Credential</div>
                                                <div className="text-sm text-white font-medium">View Certificate ↗</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Glow Effects */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                                </div>
                            </div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
}

function CameraRig({ curve }) {
    const scroll = useScroll();
    const { camera } = useThree();
    const vec = useMemo(() => new THREE.Vector3(), []);
    const lookAt = useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        const t = scroll.offset;
        const point = curve.getPoint(t);
        const nextPoint = curve.getPoint(Math.min(1, t + 0.05));

        // Position: "Chase Cam" - slightly above and behind current point? 
        // Or "Cockpit" - exactly on point? 
        // Let's go slightly above to see the road
        vec.copy(point).y += 2;

        // Add subtle sway
        const swayX = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
        const swayY = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
        const targetPos = vec.clone();
        targetPos.x += swayX;
        targetPos.y += swayY;

        // Smooth follow
        camera.position.lerp(targetPos, 0.08); // 0.08 damping

        // Look At target
        lookAt.copy(nextPoint).y += 1; // Look forward and slightly up
        camera.lookAt(lookAt);
    });

    return null;
}

function Scene() {
    const curve = useMemo(() => {
        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -50),
            new THREE.Vector3(20, 5, -100),
            new THREE.Vector3(40, 0, -150),
            new THREE.Vector3(0, -10, -220),
            new THREE.Vector3(-30, 0, -300),
            new THREE.Vector3(0, 10, -400)
        ];
        return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    }, []);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={60} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 20, 0]} intensity={2} color="#ffffff" distance={100} />

            <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <WarpParticles />

            <GridRoad curve={curve} />
            <HolographicCards curve={curve} />
            <CameraRig curve={curve} />
        </>
    );
}

export default function About() {
    return (
        <div className="w-full h-screen bg-[#000000]">
            <Canvas dpr={[1, 1.5]} gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
                <color attach="background" args={[BG_COLOR]} />
                <ScrollControls pages={STEPS} damping={0.2}>
                    <Scene />
                </ScrollControls>

                <EffectComposer disableNormalPass>
                    {/* Cinematic Bloom */}
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.5} />
                    <ChromeAberration />
                    <Noise opacity={0.05} />
                    <Vignette offset={0.3} darkness={0.7} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay - Static HUD */}
            <div className="absolute top-8 left-8 text-white/30 font-mono text-xs tracking-widest">
                <div>SYSTEM.STATUS: ONLINE</div>
                <div>RENDER_ENGINE: WEBGL.2</div>
            </div>
        </div>
    );
}

// Helper for EffectComposer
function ChromeAberration() {
    return <ChromaticAberration offset={[0.002, 0.002]} />
}

```

## src/components/Contact.jsx
```jsx
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-slate-800/30 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold text-blue-500 mb-6">Get In Touch</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>

                    <a
                        href="mailto:your.email@example.com"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1"
                    >
                        <Mail size={20} />
                        Say Hello
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;

```

## src/components/Footer.jsx
```jsx
import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

const Footer = () => {
    const socialLinks = {
        github: 'https://github.com/Syed-faiz05',
        linkedin: 'https://www.linkedin.com/in/syed-faiz-547a2a2a4/',
        leetcode: 'https://leetcode.com/u/Syed_Faiz05/',
        email: 'syedfaiz052005@gmail.com'
    };

    return (
        <footer className="bg-slate-900 text-gray-300 py-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Syed Faiz. All rights reserved.
                    </p>
                </div>

                <div className="flex space-x-6">
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                        <Github size={20} />
                    </a>
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href={socialLinks.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                        <Code2 size={20} />
                    </a>
                    <a href={`mailto:${socialLinks.email}`} className="hover:text-cyan-400 transition-colors">
                        <Mail size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

```

## src/components/GithubIsometric.jsx
```jsx
import { useEffect, useState, useMemo, useRef } from 'react';
import './GithubIsometric.css';
import { Github, Rotate3d, LayoutGrid, Box, MousePointer2 } from 'lucide-react';

const GithubIsometric = ({ username }) => {
    const [data, setData] = useState(null);
    const [viewMode, setViewMode] = useState('3d');
    const [stats, setStats] = useState({
        total: 0,
        maxStreak: 0,
        currentStreak: 0,
        busiestDay: { date: '', count: 0 }
    });

    // Refs
    const scrollContainerRef = useRef(null);
    const worldRef = useRef(null);
    const isDragging = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });
    const viewModeRef = useRef('3d');

    // Rotation State (for 3D)
    const rotation = useRef({ x: 55, z: 45 });
    const momentum = useRef({ x: 0, z: 0 });
    const animationFrame = useRef(null);

    useEffect(() => {
        viewModeRef.current = viewMode;
    }, [viewMode]);

    useEffect(() => {
        fetchData();
        startAnimationLoop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    // Auto-scroll to end (recent stats) when data loads
    useEffect(() => {
        if (data && scrollContainerRef.current) {
            setTimeout(() => {
                scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
            }, 100);
        }
    }, [data, viewMode]);

    const fetchData = async () => {
        try {
            const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last&ts=${Date.now()}`);
            if (!res.ok) throw new Error('API Response not ok');

            const json = await res.json();

            if (!json || !json.contributions || !Array.isArray(json.contributions)) {
                throw new Error('Invalid data format');
            }

            processData(json.contributions);
        } catch (error) {
            console.warn("GitHub API failed or rate-limited, using empty fallback.", error);
            generateFallbackData();
        }
    };

    const generateFallbackData = () => {
        const fallback = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            fallback.push({
                date: d.toISOString().split('T')[0],
                count: 0,
                level: 0
            });
        }
        setStats({
            total: 0,
            maxStreak: 0,
            currentStreak: 0,
            busiestDay: { date: today.toISOString().split('T')[0], count: 0 }
        });
        setData(fallback);
    };

    const processData = (contributions) => {
        try {
            const total = contributions.reduce((sum, day) => sum + (day.count || 0), 0);
            const busiest = contributions.reduce((max, day) => (day.count || 0) > (max.count || 0) ? day : max, { count: 0, date: new Date().toISOString() });

            let maxStreak = 0;
            let tempStreak = 0;

            // Filter invalid dates and sort
            const sorted = contributions
                .filter(d => d.date && !isNaN(new Date(d.date).getTime()))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            sorted.forEach((day) => {
                if (day.count > 0) tempStreak++;
                else {
                    if (tempStreak > maxStreak) maxStreak = tempStreak;
                    tempStreak = 0;
                }
            });
            if (tempStreak > maxStreak) maxStreak = tempStreak;

            const today = new Date().toISOString().split('T')[0];
            let activeStreak = 0;
            // Robust streak checking
            for (let i = sorted.length - 1; i >= 0; i--) {
                const day = sorted[i];
                if (day.date === today && day.count === 0) continue;
                if (day.count > 0) activeStreak++;
                else break;
            }

            setStats({ total, maxStreak, currentStreak: activeStreak, busiestDay: busiest });
            setData(sorted);
        } catch (err) {
            console.error("Error processing data", err);
            generateFallbackData();
        }
    };

    const startAnimationLoop = () => {
        const update = () => {
            if (!worldRef.current) return;

            if (viewModeRef.current === '3d') {
                if (!isDragging.current) {
                    rotation.current.z += momentum.current.z;
                    rotation.current.x += momentum.current.x;
                    momentum.current.z *= 0.95;
                    momentum.current.x *= 0.95;
                }
                worldRef.current.style.transform = `rotateX(${rotation.current.x}deg) rotateZ(${rotation.current.z}deg)`;
            }
            animationFrame.current = requestAnimationFrame(update);
        };
        update();
    };

    // ... Interaction Handlers ...
    const handleMouseDown = (e) => {
        if (viewMode === '2d') return;
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || viewMode === '2d') return;
        const deltaX = e.clientX - lastMouse.current.x;
        const deltaY = e.clientY - lastMouse.current.y;

        rotation.current.z -= deltaX * 0.4;
        rotation.current.x += deltaY * 0.4;
        momentum.current = { z: -deltaX * 0.04, x: deltaY * 0.04 };

        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => isDragging.current = false;

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode]);

    // Helpers
    const getBarColor = (count) => {
        if (count === 0) return { base: '#1e293b', side: '#0f172a', top: '#1e293b' };
        if (count <= 3) return { base: '#0e4429', side: '#062013', top: '#0e4429' };
        if (count <= 6) return { base: '#26a641', side: '#166126', top: '#26a641' };
        if (count <= 10) return { base: '#39d353', side: '#227d31', top: '#39d353' };
        return { base: '#4ade80', side: '#2c854c', top: '#4ade80' };
    };

    const getBarHeight = (count) => {
        if (count === 0) return '4px';
        return `${Math.min(count * 6 + 6, 70)}px`;
    };

    const weeks = useMemo(() => {
        if (!data) return [];
        const weeksArray = [];
        let currentWeek = [];
        data.forEach((day, i) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || i === data.length - 1) {
                weeksArray.push(currentWeek);
                currentWeek = [];
            }
        });
        return weeksArray;
    }, [data]);

    // Safety Loading State
    if (!data && !stats.total) return <div className="text-center p-10 text-gray-500 animate-pulse">Loading GitHub Graph...</div>;

    // Build Date String safely
    let formattedBusiestDate = '-';
    try {
        if (stats.busiestDay && stats.busiestDay.date) {
            formattedBusiestDate = new Date(stats.busiestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    } catch { /* ignore date error */ }

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 max-w-6xl mx-auto select-none overflow-hidden flex flex-col">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-slate-700/50 gap-4">
                <div className="flex items-center gap-3">
                    <Github className="text-white" size={24} />
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">Contributions</h3>
                        <p className="text-xs text-gray-400">Syed-faiz05</p>
                    </div>
                </div>

                <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button
                        onClick={() => { setViewMode('2d'); rotation.current = { x: 0, z: 0 }; }}
                        className={`p-2 rounded-md transition-all ${viewMode === '2d' ? 'bg-slate-700 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        title="2D View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => { setViewMode('3d'); rotation.current = { x: 55, z: 45 }; }}
                        className={`p-2 rounded-md transition-all ${viewMode === '3d' ? 'bg-slate-700 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        title="3D View"
                    >
                        <Box size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`relative flex flex-col md:flex-row gap-6 transition-all duration-500 ${viewMode === '2d' ? 'h-auto' : 'h-[500px]'}`}>

                {/* Stats */}
                <div className="flex flex-col gap-6 min-w-[150px] z-10 pointer-events-none md:pt-10">
                    <div className="stat-item">
                        <h4>Longest Streak</h4>
                        <div className="value">{stats.maxStreak} <span className="text-sm text-gray-400">days</span></div>
                        <div className="meta">Keep it up!</div>
                    </div>
                    <div className="stat-item">
                        <h4>Current Streak</h4>
                        <div className="value stat-highlight">{stats.currentStreak} <span className="text-sm text-gray-400">days</span></div>
                    </div>
                </div>

                {/* Graph */}
                <div
                    ref={scrollContainerRef}
                    className={`flex-1 relative w-full overflow-hidden ${viewMode === '2d' ? 'overflow-x-auto custom-scrollbar pb-4' : 'cursor-grab active:cursor-grabbing items-center justify-center flex'}`}
                    onMouseDown={handleMouseDown}
                    style={{ perspective: viewMode === '3d' ? '1000px' : 'none' }}
                >
                    <div
                        ref={worldRef}
                        className={viewMode === '3d' ? "absolute transition-transform duration-75" : "flex gap-1"}
                        style={viewMode === '3d' ? { transformStyle: 'preserve-3d' } : {}}
                    >
                        <div className={viewMode === '3d' ? "flex gap-2" : "flex gap-1"}
                            style={viewMode === '3d' ? { transform: 'translate(-50%, -50%)', transformStyle: 'preserve-3d' } : {}}
                        >
                            {weeks.map((week, wIndex) => {
                                const firstDay = new Date(week[0].date);
                                const isNewMonth = firstDay.getDate() <= 7;
                                const monthName = !isNaN(firstDay) ? firstDay.toLocaleString('default', { month: 'short' }) : '';

                                return (
                                    <div key={wIndex} className={`flex flex-col ${viewMode === '3d' ? 'gap-2' : 'gap-1'}`}
                                        style={{
                                            marginLeft: isNewMonth && wIndex > 0 ? (viewMode === '3d' ? '30px' : '6px') : '0',
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        {isNewMonth && (
                                            <div className={`absolute text-cyan-400 font-bold text-xs whitespace-nowrap ${viewMode === '3d' ? '-top-16 left-0' : '-top-6 left-0'}`}
                                                style={viewMode === '3d' ? { transform: 'translateZ(60px) rotateX(-90deg)' } : {}}
                                            >
                                                {monthName}
                                            </div>
                                        )}

                                        {week.map((day, dIndex) => {
                                            const colors = getBarColor(day.count || 0);
                                            const height = getBarHeight(day.count || 0);
                                            let dateLabel = '-';
                                            try {
                                                dateLabel = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                            } catch { /* ignore date error */ }

                                            return (
                                                <div
                                                    key={day.date || dIndex}
                                                    className={`group relative ${viewMode === '3d' ? 'w-3 h-3 iso-block-wrapper' : 'w-3 h-3 rounded-[2px]'}`}
                                                    style={viewMode === '3d' ? { transformStyle: 'preserve-3d' } : { background: colors.base }}
                                                >
                                                    <div className="tooltip-container absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                                                        <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap border border-slate-700">
                                                            <strong>{day.count}</strong> contributions
                                                            <div className="text-gray-400 text-[10px]">{dateLabel}</div>
                                                        </div>
                                                    </div>

                                                    {viewMode === '3d' && (
                                                        <div className="iso-pillar absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-z-10"
                                                            style={{ transformStyle: 'preserve-3d' }}
                                                        >
                                                            <div className="absolute inset-0 border border-white/5"
                                                                style={{ background: colors.top, transform: `translateZ(${height})` }}
                                                            />
                                                            <div className="absolute top-0 right-0 h-full origin-right"
                                                                style={{ width: height, background: colors.side, transform: 'rotateY(90deg)', border: '1px solid rgba(255,255,255,0.05)' }}
                                                            />
                                                            <div className="absolute bottom-0 left-0 w-full origin-bottom"
                                                                style={{ height: height, background: colors.side, transform: 'rotateX(-90deg)', filter: 'brightness(0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Stats */}
                <div className="flex flex-col gap-6 min-w-[150px] z-10 pointer-events-none md:pt-10 text-right md:text-left">
                    <div className="stat-item">
                        <h4>1 Year Total</h4>
                        <div className="value stat-highlight">{stats.total.toLocaleString()}</div>
                        <div className="meta">Last Year</div>
                    </div>
                    <div className="stat-item">
                        <h4>Busiest Day</h4>
                        <div className="value">{formattedBusiestDate !== '-' ? stats.busiestDay.count : 0}</div>
                        <div className="meta">{formattedBusiestDate}</div>
                    </div>
                </div>

            </div>

            {viewMode === '3d' && (
                <div className="flex justify-center mt-4 opacity-50 z-20 relative">
                    <MousePointer2 size={16} className="text-white mr-2" />
                    <span className="text-xs text-white">Click & Drag to rotate • Hover for info</span>
                </div>
            )}
        </div>
    );
};

export default GithubIsometric;

```

## src/components/LeetCodeActivity.jsx
```jsx
import { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './LeetCodeActivity.css';
import API_URL from '../config';

const LeetCodeActivity = ({ username }) => {
    const [activityData, setActivityData] = useState([]);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeetCodeData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/leetcode/${username}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch LeetCode data');
                }

                const data = await response.json();

                if (data.errors) {
                    throw new Error(data.errors[0].message);
                }

                if (data.data?.matchedUser?.userCalendar) {
                    const calendar = JSON.parse(data.data.matchedUser.userCalendar.submissionCalendar);

                    // Transform data for react-calendar-heatmap
                    const transformedData = Object.entries(calendar).map(([timestamp, count]) => ({
                        date: new Date(parseInt(timestamp) * 1000),
                        count: count
                    }));

                    setActivityData(transformedData);
                    setTotalSubmissions(Object.values(calendar).reduce((a, b) => a + b, 0));
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching LeetCode data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchLeetCodeData();
    }, [username]);

    const getClassForValue = (value) => {
        if (!value) {
            return 'color-empty';
        }
        if (value.count < 3) {
            return 'color-github-1';
        }
        if (value.count < 6) {
            return 'color-github-2';
        }
        if (value.count < 10) {
            return 'color-github-3';
        }
        return 'color-github-4';
    };

    if (loading) {
        return (
            <div className="leetcode-container">
                <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
                    <span className="ml-2 text-sm text-gray-400">Loading LeetCode activity...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leetcode-container">
                <div className="text-center py-6">
                    <p className="text-orange-400 text-sm mb-2">⚠️ Backend server needed</p>
                    <p className="text-xs text-gray-500 mb-4">Start: <code className="bg-slate-800 px-2 py-1 rounded">cd backend && node server.js</code></p>
                    <a
                        href={`https://leetcode.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-profile-btn inline-block"
                    >
                        View LeetCode Profile →
                    </a>
                </div>
            </div>
        );
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    return (
        <div className="leetcode-container">
            <div className="leetcode-header">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                    LeetCode Activity
                </h2>
                <div className="header-actions">
                    <span>{totalSubmissions} submissions in the past year</span>
                    <a
                        href={`https://leetcode.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-profile-btn"
                    >
                        View Profile →
                    </a>
                </div>
            </div>

            <div className="heatmap-wrapper">
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={endDate}
                    values={activityData}
                    classForValue={getClassForValue}
                    tooltipDataAttrs={(value) => {
                        if (!value || !value.date) {
                            return {};
                        }
                        return {
                            'data-tip': `${value.count || 0} submissions on ${value.date.toLocaleDateString()}`
                        };
                    }}
                    showWeekdayLabels={true}
                    gutterSize={3}
                />
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                fontSize: '0.75rem',
                color: '#888'
            }}>
                <span>Less</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#1f2937' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#0e4429' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#26a641' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#39d353' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#4ade80' }}></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default LeetCodeActivity;

```

## src/components/LeetCodeHeatmap.jsx
```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink } from 'lucide-react';
import API_URL from '../config';

// ----------------------------------------------------
// Circular Progress Ring Component
// ----------------------------------------------------
const ProgressRing = ({ radius, stroke, progress, colorClass, shadowClass, label, value, delay }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay }}
            viewport={{ once: true }}
            className={`relative flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-md shadow-lg hover:${shadowClass} hover:-translate-y-1 transition-all duration-300 group`}
        >
            <div className="relative flex items-center justify-center">
                {/* Background Ring */}
                <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                    <circle
                        stroke="rgba(255,255,255,0.05)"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Ring with Animation */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
                        viewport={{ once: true }}
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference + ' ' + circumference}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className={`${colorClass} drop-shadow-lg`}
                    />
                </svg>
                {/* Center Value */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-white font-mono tracking-tight">{value}</span>
                </div>
            </div>
            <h4 className={`mt-4 text-xs font-bold uppercase tracking-widest ${colorClass}`}>{label}</h4>
        </motion.div>
    );
};

const LeetCodeRings = ({ username }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeetCodeData = async () => {
        try {
            // Direct call to Leetcode GraphQL proxy
            const query = `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        submitStats: submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }
            `;

            // We use a POST request directly to a free proxy or your backend 
            // Since your backend might not have this exact GraphQL configured, we simulate the standard format using your proxy Route
            // We use our backend Express Proxy to avoid CORS issues completely
            const response = await fetch(`${API_URL}/api/leetcode/${username}?t=${Date.now()}`);

            if (!response.ok) throw new Error('API down');

            const data = await response.json();

            if (data.status === 'success') {
                setStats({
                    totalSolved: data.totalSolved,
                    totalQuestions: data.totalQuestions,
                    easySolved: data.easySolved,
                    totalEasy: data.totalEasy,
                    mediumSolved: data.mediumSolved,
                    totalMedium: data.totalMedium,
                    hardSolved: data.hardSolved,
                    totalHard: data.totalHard,
                    ranking: data.ranking
                });
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error fetching LeetCode data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeetCodeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    if (loading) {
        return (
            <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse flex flex-col items-center justify-center">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
                </div>
                <span className="mt-4 text-emerald-500/50 text-xs tracking-widest uppercase">Analyzing Algorithms...</span>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="w-full h-80 bg-slate-900/40 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center p-6 text-center shadow-xl">
                <p className="text-slate-400 font-medium mb-2">LeetCode Radar Offline</p>
            </div>
        );
    }

    // Calculate Progress Percentages (avoid dividing by zero)
    const easyPct = stats.totalEasy ? (stats.easySolved / stats.totalEasy) * 100 : 0;
    const medPct = stats.totalMedium ? (stats.mediumSolved / stats.totalMedium) * 100 : 0;
    const hardPct = stats.totalHard ? (stats.hardSolved / stats.totalHard) * 100 : 0;

    return (
        <div className="w-full p-8 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden group">

            {/* Ambient Background Glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 group-hover:bg-emerald-500/20"></div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-inner group-hover:bg-emerald-500/10 transition-colors">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="w-8 h-8 opacity-90 brightness-150" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">LeetCode Analytics</h3>
                        <p className="text-sm text-emerald-400 font-mono mt-1 flex items-center gap-2">
                            Global Rank: <span className="text-white bg-slate-800 px-2 py-0.5 rounded shadow-inner border border-slate-700">{stats.ranking.toLocaleString()}</span>
                        </p>
                    </div>
                </div>

                <div className="mt-6 md:mt-0 px-6 py-3 bg-slate-800/80 border border-slate-700 rounded-2xl flex flex-col items-end shadow-inner">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Total Solved</span>
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm font-mono tracking-tighter">
                        {stats.totalSolved}
                    </span>
                </div>
            </div>

            {/* 3D Glass Rings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <ProgressRing
                    radius={70} stroke={10}
                    progress={Math.max(easyPct, 5)} // Give at least 5% so it's visible 
                    value={stats.easySolved}
                    label="Easy"
                    colorClass="text-emerald-400"
                    shadowClass="shadow-[0_10px_30px_rgba(52,211,153,0.15)]"
                    delay={0.1}
                />

                <ProgressRing
                    radius={70} stroke={10}
                    progress={Math.max(medPct, 5)}
                    value={stats.mediumSolved}
                    label="Medium"
                    colorClass="text-amber-400"
                    shadowClass="shadow-[0_10px_30px_rgba(251,191,36,0.15)]"
                    delay={0.2}
                />

                <ProgressRing
                    radius={70} stroke={10}
                    progress={Math.max(hardPct, 5)}
                    value={stats.hardSolved}
                    label="Hard"
                    colorClass="text-red-400"
                    shadowClass="shadow-[0_10px_30px_rgba(248,113,113,0.15)]"
                    delay={0.3}
                />
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-center border-t border-slate-800/50 pt-6 relative z-10">
                <a
                    href={`https://leetcode.com/${username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-300 hover:text-white rounded-full transition-all border border-slate-700 shadow-sm"
                >
                    <Trophy size={16} className="text-emerald-500" />
                    Visit Official LeetCode Profile
                    <ExternalLink size={14} className="ml-1 opacity-50" />
                </a>
            </div>
        </div>
    );
};

export default LeetCodeRings;

```

## src/components/Navbar.jsx
```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Home', to: '/' },
        { name: 'About', to: '/about' },
        { name: 'Skills', to: '/skills' },
        { name: 'Projects', to: '/projects' },
        { name: 'Contact', to: '/contact' },
        { name: 'Admin', to: '/admin' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-white">
                            Syed<span className="text-cyan-400">Faiz</span>
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive(item.to)
                                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                                        : 'text-gray-300 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden bg-slate-900"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.filter(item => item.name !== 'Admin').map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.to)
                                    ? 'text-cyan-400 bg-slate-800'
                                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;

```

## src/components/NetworkParticles.jsx
```jsx
import { useEffect, useRef } from 'react';

const NetworkParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle factory
        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            },

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
                ctx.fill();
            }
        });

        // Create particles
        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((particleA, indexA) => {
                particles.slice(indexA + 1).forEach(particleB => {
                    const dx = particleA.x - particleB.x;
                    const dy = particleA.y - particleB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 * (1 - distance / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particleA.x, particleA.y);
                        ctx.lineTo(particleB.x, particleB.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
};

export default NetworkParticles;

```

## src/components/ParticleBackground.jsx
```jsx
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: "#0f172a", // Slate-900 (Dark background)
                },
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: "#ffffff",
                },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 1, // Smooth, slow movement
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 80,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
        }),
        [],
    );

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={null}
                options={options}
                className="absolute inset-0 -z-10 h-full w-full"
            />
        );
    }

    return <></>;
};

export default ParticleBackground;

```

## src/components/Projects.jsx
```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Loader2, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const Projects = ({ limit = null }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${API_URL}/api/projects`);
                const data = await res.json();
                // Filter for published projects only
                const publishedProjects = Array.isArray(data)
                    ? data.filter(p => !p.status || p.status === 'Published' || p.status === 'Completed' || p.status === 'Ongoing')
                    : [];
                setProjects(publishedProjects);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getOptimizedUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/'); // Optimize width to 800px
        }
        return url;
    };

    const displayProjects = limit ? projects.slice(0, limit) : projects;

    if (loading) {
        return (
            <section id="projects" className="py-20 bg-slate-900/50 text-white flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </section>
        );
    }

    return (
        <section id="projects" className="py-20 bg-slate-900/50 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-cyan-400">
                        {limit ? "Featured Projects" : "My Projects"}
                    </h2>
                    <p className="mt-4 text-gray-300">
                        {limit
                            ? "A glimpse of what I've been working on."
                            : "Check out some of the things I've built."
                        }
                    </p>
                </motion.div>

                {displayProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayProjects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-[#0f1016] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 hover:-translate-y-2 hover:shadow-cyan-500/20 transition-all duration-300 group flex flex-col"
                            >
                                {/* Image Section */}
                                <div className="h-64 bg-slate-900 overflow-hidden relative">
                                    {(project.thumbnail || (project.images && project.images.length > 0) || project.image) ? (
                                        <img
                                            src={getOptimizedUrl(project.image || project.thumbnail || (project.images && project.images[0]))}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-700 bg-[#0a0b10]">
                                            <Layers className="h-12 w-12 mb-3 opacity-20" />
                                            <span className="text-sm font-medium opacity-50">No Preview</span>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 animate-fade-in">
                                        <div className={`
                                            flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border backdrop-blur-md shadow-lg
                                            ${(project.status === 'Completed' || !project.status)
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20'
                                                : project.status === 'Ongoing'
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/20'
                                            }
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${(project.status === 'Completed' || !project.status) ? 'bg-emerald-400' : 'bg-current'} animate-pulse`}></span>
                                            {(project.status || 'Completed').toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex-1 flex flex-col bg-[#0f1016]">
                                    <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 leading-tight">
                                        {project.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.technologies && project.technologies.slice(0, 4).map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="text-xs font-medium bg-[#1a1b23] text-blue-400 px-4 py-1.5 rounded-full border border-slate-800/50"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {project.technologies && project.technologies.length > 4 && (
                                            <span className="text-xs font-medium bg-[#1a1b23] text-slate-500 px-3 py-1.5 rounded-full border border-slate-800/50">
                                                +{project.technologies.length - 4}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 mt-auto">
                                        <a
                                            href={project.liveLink || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`
                                                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300
                                                ${project.liveLink
                                                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-500/25 hover:-translate-y-0.5'
                                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                                }
                                            `}
                                        >
                                            <ExternalLink size={18} />
                                            Live Demo
                                        </a>

                                        <a
                                            href={project.githubLink || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`
                                                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-[#1a1b23] border border-slate-700/50 text-white transition-all duration-300
                                                ${project.githubLink
                                                    ? 'hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-0.5'
                                                    : 'opacity-50 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            <Github size={18} />
                                            GitHub
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                        <Layers className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                        <h3 className="text-lg font-medium text-slate-400">No projects to display</h3>
                        <p className="text-slate-500 mt-2">Check back soon for updates!</p>
                    </div>
                )}

                {/* View All Button */}
                {limit && projects.length > limit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex justify-center mt-12"
                    >
                        <Link to="/projects">
                            <button className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-semibold transition-all hover:scale-105">
                                View All Projects <ArrowRight size={20} />
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Projects;

```

## src/components/Skills.jsx
```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API_URL from '../config';

const Skills = () => {
    const [skills, setSkills] = useState([]);

    const fetchSkills = async () => {
        try {
            const res = await fetch(`${API_URL}/api/skills`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSkills(data);
            } else {
                setSkills([]);
            }
        } catch (error) {
            console.error("Failed to fetch skills", error);
            setSkills([]);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    return (
        <section id="skills" className="py-20 bg-slate-800/30 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-cyan-400">Skills</h2>
                    <p className="mt-4 text-gray-300">Here are some of the technologies I work with.</p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-md text-center hover:border-cyan-500 transition-colors"
                        >
                            <h3 className="font-semibold text-lg">{skill.name}</h3>
                            {/* Render level as a bar or text */}
                            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="bg-cyan-400 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${skill.level || 50}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{skill.level || 0}% Proficiency</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;

```

## src/components/StarField.jsx
```jsx
import { useEffect, useState } from 'react';

const StarField = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        // Generate random star positions
        const generateStars = () => {
            const newStars = [];
            for (let i = 0; i < 50; i++) {
                newStars.push({
                    id: i,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    size: Math.random() * 2 + 1
                });
            }
            setStars(newStars);
        };

        generateStars();
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white animate-twinkle"
                    style={{
                        left: star.left,
                        top: star.top,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: star.animationDelay,
                        opacity: 0.6
                    }}
                />
            ))}
        </div>
    );
};

export default StarField;

```

## src/config.js
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://faiz-portfolio-jpb2.onrender.com';

export default API_URL;

```

## src/context/AuthContext.jsx
```jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import API_URL from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateProfile = async (userData) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(userData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

```

## src/lib/utils.js
```javascript
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

```

## src/main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

## src/pages/About.jsx
```jsx
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, GraduationCap, Rocket, Target, Award, ArrowUp, Loader2 } from 'lucide-react';
import NetworkParticles from '../components/NetworkParticles';
import API_URL from '../config';

// --- Animated Background Component (Reusing efficient NetworkParticles or creating a similar light one) ---
// Note: We'll stick to NetworkParticles for consistency but maybe tone down density if needed.

const TimelineNode = ({ item, index }) => {
    const isEven = index % 2 === 0;

    // Framer motion variants
    const cardVariants = {
        hidden: { opacity: 0, x: isEven ? -50 : 50, rotate: isEven ? -2 : 2 },
        visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
        }
    };

    const nodeVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.1 }
        }
    };

    // Determine Icon
    const getIcon = (type) => {
        switch (type) {
            case 'education': return <GraduationCap className="w-5 h-5" />;
            case 'experience': return <Briefcase className="w-5 h-5" />;
            case 'achievement': return <Award className="w-5 h-5" />;
            case 'goal': return <Target className="w-5 h-5" />;
            default: return <Rocket className="w-5 h-5" />;
        }
    };

    return (
        <div className={`flex justify-between items-center w-full mb-12 ${isEven ? 'md:flex-row-reverse' : ''}`}>

            {/* Empty Space for alignment */}
            <div className="hidden md:block w-5/12"></div>

            {/* Timeline Node (Center) */}
            <motion.div
                variants={nodeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                className="z-20 relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            >
                <div className="text-cyan-400">
                    {getIcon(item.type)}
                </div>
            </motion.div>

            {/* Content Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="w-full md:w-5/12 pl-8 md:pl-0"
            >
                <div className={`p-6 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden group ${!isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>

                    {/* Glowing corner accent */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-400/30 transition-all duration-500"></div>

                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-900/20 rounded-full border border-cyan-500/20">
                        {item.period}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                    </h3>

                    {item.subtitle && (
                        <h4 className="text-sm font-medium text-slate-400 mb-3">
                            {item.subtitle}
                        </h4>
                    )}

                    {item.image && (
                        <div className="mb-4 rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
                            <img src={item.image} alt={item.title} className="w-full h-auto object-cover max-h-48 hover:scale-105 transition-transform duration-500" />
                        </div>
                    )}

                    <p className="text-slate-300 text-sm leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const About = () => {
    const [timelineData, setTimelineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        fetchTimeline();
    }, []);

    const fetchTimeline = async () => {
        try {
            const res = await fetch(`${API_URL}/api/about`);
            if (res.ok) {
                const data = await res.json();
                setTimelineData(data);
            }
        } catch (error) {
            console.error("Failed to load timeline", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">

            {/* Background */}
            <div className="fixed inset-0 z-0">
                <NetworkParticles />
                {/* Extra deep space gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 pointer-events-none"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                {/* Intro Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-sm">
                        My Journey
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
                        A detailed look into my growth, learning, and milestones as a developer.
                    </p>
                </motion.div>

                {/* 🍱 START OF BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 max-w-5xl mx-auto">
                    {/* Card 1: Core Bio (Takes 2 Columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                        <h3 className="text-xs font-bold tracking-widest text-cyan-500 uppercase mb-4">Who I Am</h3>
                        <h2 className="text-3xl font-bold text-slate-100 mb-4 tracking-tight">Data to Decisions. Code to Production.</h2>
                        <p className="text-slate-300 leading-relaxed max-w-lg relative z-10 text-lg">
                            I am a B.Tech CSE student specializing in <span className="text-cyan-400 font-semibold">Data Science</span>.
                            I don't just write scripts; I build end-to-end architectures that can collect, clean, analyze, and beautifully present data.
                            I thrive at the intersection of complex algorithms and seamless user interfaces.
                        </p>
                    </motion.div>

                    {/* Card 2: Location (1 Column) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-xl hover:border-cyan-500/30 transition-all group"
                    >
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-700/50 group-hover:scale-110 transition-transform">
                            <span className="text-3xl animate-bounce">📍</span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-200">Bengaluru, India</h4>
                        <p className="text-slate-400 text-sm mt-2">Available for Remote & Local Opportunities</p>
                    </motion.div>

                    {/* Card 3: Philosophy / Quote (Full Width Wide Card) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="md:col-span-3 bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900 rounded-3xl p-10 border border-slate-700/50 shadow-xl overflow-hidden relative group"
                    >
                        {/* Decorative Background grid lines */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl md:text-2xl font-semibold text-slate-300 leading-snug tracking-tight mb-4 border-l-4 border-cyan-500 pl-6 italic">
                                    "In God we trust; all others must bring data."
                                </h3>
                                <p className="text-cyan-500 font-bold uppercase tracking-widest text-sm pl-6 flex items-center gap-2">
                                    <span className="w-6 h-[2px] bg-cyan-500"></span> W. Edwards Deming
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400 shadow-lg group-hover:-translate-y-2 transition-transform delay-75 duration-300">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-lg group-hover:-translate-y-2 transition-transform delay-150 duration-300">
                                    <Rocket className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* 🍱 END OF BENTO GRID */}

                {/* Timeline Container */}
                <div className="relative max-w-5xl mx-auto">

                    {/* Vertical Line (Background) */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 transform md:-translate-x-1/2 z-0 h-full"></div>

                    {/* Animated Progress Line */}
                    <motion.div
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-600 transform md:-translate-x-1/2 z-1 origin-top shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                        style={{ scaleY: scrollYProgress }}
                    />

                    {/* Timeline Items */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                        </div>
                    ) : timelineData.length > 0 ? (
                        <div className="space-y-12 md:space-y-24 md:pl-0">
                            {/* pl-0 on mobile because we want full width flexibility */}
                            {timelineData.map((item, index) => (
                                <TimelineNode key={item._id || index} item={item} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-dashed border-slate-700">
                            <p className="text-slate-500 text-lg">Timeline data coming soon...</p>
                        </div>
                    )}
                </div>

                {/* Future / Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-32 pb-10"
                >
                    <p className="text-slate-500 mb-4 uppercase tracking-widest text-xs font-bold">What's Next?</p>
                    <h2 className="text-3xl font-bold text-white mb-6">Building the Future</h2>
                    <div className="inline-flex items-center gap-2 text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1 hover:text-cyan-300 transition-colors cursor-pointer">
                        See my latest projects <Rocket className="w-4 h-4" />
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default About;

```

## src/pages/AboutPage.jsx
```jsx
import About from '../components/About';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 pt-16">
            <About />
        </div>
    );
};

export default AboutPage;

```

## src/pages/AdminPage.jsx
```jsx

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

```

## src/pages/ContactPage.jsx
```jsx
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Download } from 'lucide-react';

const ContactPage = () => {
    const socialLinks = {
        github: 'https://github.com/Syed-faiz05',
        linkedin: 'https://www.linkedin.com/in/syed-faiz-547a2a2a4/',
        email: 'syedfaiz052005@gmail.com'
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact</h1>
                    <p className="text-gray-400 text-lg mb-12">
                        I'm currently open to Full Stack and Junior Data Science roles (2026+). Let's build something meaningful!
                    </p>

                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 md:p-12">
                        {/* Email */}
                        <div className="mb-8">
                            <a
                                href={`mailto:${socialLinks.email}`}
                                className="inline-flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
                            >
                                <Mail size={24} />
                                {socialLinks.email}
                            </a>
                        </div>

                        {/* Social Icons */}
                        <div className="flex justify-center gap-4 mb-8">
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-700/50 hover:bg-slate-700 p-4 rounded-full transition-colors"
                            >
                                <Linkedin size={24} className="text-cyan-400" />
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href={socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-700/50 hover:bg-slate-700 p-4 rounded-full transition-colors"
                            >
                                <Github size={24} className="text-cyan-400" />
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href={`mailto:${socialLinks.email}`}
                                className="bg-slate-700/50 hover:bg-slate-700 p-4 rounded-full transition-colors"
                            >
                                <Mail size={24} className="text-cyan-400" />
                            </motion.a>
                        </div>

                        {/* Download Resume */}
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/resume.pdf"
                            download="Syed_Faiz_Resume.pdf"
                            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            <Download size={20} />
                            Download Resume
                        </motion.a>
                    </div>

                    <p className="text-gray-500 text-sm mt-8">Bengaluru, India</p>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;

```

## src/pages/Home.jsx
```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code2, Terminal, Cpu, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

// Components
import LeetCodeHeatmap from '../components/LeetCodeHeatmap';
import NetworkParticles from '../components/NetworkParticles';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import GithubIsometric from '../components/GithubIsometric';

// Image Import
const profileImg = new URL('../assets/profile.jpg', import.meta.url).href;

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/profile`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const scrollToActivity = () => {
        document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fallback profile data
    const defaultProfile = {
        name: 'Syed Faiz',
        title: 'Full Stack Web Developer',
        bio: 'Full Stack Developer & Junior Data Scientist with a passion for building scalable web applications and data-driven solutions. Specialized in React, Node.js, and Python, I transform complex problems into intuitive, user-centric digital experiences.',
        socialLinks: {
            github: 'https://github.com/Syed-faiz05',
            linkedin: 'https://www.linkedin.com/in/syed-faiz-547a2a2a4/',
            leetcode: 'https://leetcode.com/u/Syed_Faiz05/',
            email: 'syedfaiz052005@gmail.com'
        }
    };

    const display = (profile && profile.name !== 'My Name') ? profile : defaultProfile;
    if (display.title === 'Full Stack Developer & Junior Data Scientist') {
        display.title = 'Full Stack Web Developer';
    }

    // Stats Data
    const stats = [
        { icon: <Terminal size={24} />, value: "3+", label: "Years Experience" },
        { icon: <Cpu size={24} />, value: "20+", label: "Projects Built" },
        { icon: <Globe size={24} />, value: "10+", label: "Clients Served" },
        { icon: <Award size={24} />, value: "500+", label: "LeetCode Solved" },
    ];

    return (
        <div className="min-h-screen bg-slate-900 relative">
            {/* Network Particles Background */}
            <NetworkParticles />

            {/* Hero Section */}
            <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-6xl w-full">
                    <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-cyan-400">Loading Profile...</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                {/* Text Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-left text-white order-2 md:order-1"
                                >
                                    <p className="text-gray-400 text-sm md:text-base mb-2">Hi there, I'm</p>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                                        {(display.name || 'Syed Faiz').split(' ')[0]} <span className="text-cyan-400">{(display.name || 'Syed Faiz').split(' ').slice(1).join(' ')}</span>
                                    </h1>
                                    <p className="text-lg md:text-xl text-cyan-400 font-semibold mb-4">
                                        {display.title}
                                    </p>
                                    <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                                        {display.bio}
                                    </p>

                                    <div className="flex gap-4 mb-6">
                                        <Link to="/projects">
                                            <motion.button
                                                whileHover={{ scale: 1.05, borderColor: '#22d3ee' }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-cyan-500/10 backdrop-blur-sm border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
                                            >
                                                View Projects
                                            </motion.button>
                                        </Link>
                                        <motion.a
                                            href={display.resumeUrl || "/resume.pdf"}
                                            download="Syed_Faiz_Resume.pdf"
                                            whileHover={{ scale: 1.05, borderColor: '#a78bfa' }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-purple-600/10 backdrop-blur-sm border-2 border-purple-500/50 hover:border-purple-400 text-purple-400 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
                                        >
                                            Resume
                                        </motion.a>
                                    </div>

                                    {/* Social Icons */}
                                    <div className="flex gap-4">
                                        {display.socialLinks?.github && (
                                            <motion.a
                                                whileHover={{ scale: 1.2, color: '#22d3ee' }}
                                                href={display.socialLinks.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-cyan-400 transition-colors"
                                            >
                                                <Github size={28} />
                                            </motion.a>
                                        )}
                                        {display.socialLinks?.linkedin && (
                                            <motion.a
                                                whileHover={{ scale: 1.2, color: '#0077b5' }}
                                                href={display.socialLinks.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                            >
                                                <Linkedin size={28} />
                                            </motion.a>
                                        )}
                                        {display.socialLinks?.leetcode && (
                                            <motion.a
                                                whileHover={{ scale: 1.2, color: '#ffa116' }}
                                                href={display.socialLinks.leetcode}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-orange-400 transition-colors"
                                            >
                                                <Code2 size={28} />
                                            </motion.a>
                                        )}
                                        {display.socialLinks?.email && (
                                            <motion.a
                                                whileHover={{ scale: 1.2, color: '#22d3ee' }}
                                                href={`mailto:${display.socialLinks.email}`}
                                                className="text-gray-400 hover:text-cyan-400 transition-colors"
                                            >
                                                <Mail size={28} />
                                            </motion.a>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Image Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="flex justify-center order-1 md:order-2"
                                >
                                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                                        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                        {profileImg && (
                                            <img
                                                src={profileImg}
                                                alt={display.name}
                                                className="relative w-full h-full object-cover rounded-full border-4 border-cyan-500/30 shadow-2xl"
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modern Mouse Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="mt-12 cursor-pointer pb-8"
                    onClick={scrollToActivity}
                >
                    <div className="flex flex-col items-center group">
                        <span className="text-sm mb-3 text-gray-400 group-hover:text-cyan-400 transition-colors">Scroll to explore</span>
                        <div className="mouse-scroll">
                            <div className="mouse-scroll-wheel"></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Section */}
            <section id="stats-section" className="py-12 bg-slate-900 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center p-4 bg-slate-800/20 rounded-xl border border-slate-700/30 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="text-cyan-400 mb-2 p-3 bg-cyan-500/10 rounded-full">
                                    {stat.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Skills Section (Imported) */}
            <Skills />

            {/* Featured Projects (Imported with limit) */}
            <Projects limit={3} />

            {/* Activity Section (LeetCode & GitHub) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-cyan-400">Coding Activity</h2>
                    <p className="mt-4 text-gray-300">My recent contributions and problem solving stats.</p>
                </motion.div>

                <div className="space-y-12">
                    {/* GitHub Graph */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <GithubIsometric username="Syed-faiz05" />
                    </motion.div>

                    {/* LeetCode Heatmap */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <LeetCodeHeatmap username="Syed_Faiz05" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Home;

```

## src/pages/ProjectsPage.jsx
```jsx
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Rocket, Search, X, Filter, Calendar, Layers } from 'lucide-react';
import API_URL from '../config';

const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors z-10"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative h-64 md:h-96 w-full bg-slate-800">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-600">
                                <Rocket size={48} />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-32" />
                        <div className="absolute bottom-6 left-6 md:left-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{project.title}</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.status && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        project.status === 'Ongoing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {project.status}
                                    </span>
                                )}
                                {project.featured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                        Featured
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 space-y-8">
                        {/* Links */}
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={project.liveLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${project.liveLink
                                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                <ExternalLink size={18} /> Visit Live Site
                            </a>
                            <a
                                href={project.githubLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${project.githubLink
                                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                                    }`}
                            >
                                <Github size={18} /> View Source Code
                            </a>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                        <Layers className="text-cyan-400" size={20} /> About the Project
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-lg">
                                        {project.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.map((tech, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-slate-800 text-cyan-300 text-sm rounded-lg border border-slate-700/50">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {project.createdAt && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                            <Calendar className="text-slate-400" size={18} /> Date
                                        </h3>
                                        <p className="text-slate-400">
                                            {new Date(project.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTech, setSelectedTech] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

    // Filter Chips - Dynamic based on available tech
    const [availableTechs, setAvailableTechs] = useState(['All']);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            if (response.ok) {
                const data = await response.json();
                setProjects(data);

                // Extract unique technologies for filter
                const techs = new Set(['All']);
                data.forEach(p => p.technologies?.forEach(t => techs.add(t)));
                // Initial set of popular/common tags to avoid clutter
                const commonTechs = ['All', 'React', 'Node.js', 'Python', 'Next.js', 'MongoDB', 'TypeScript'];
                // Filter available techs to only include ones that actually exist in the projects
                const filteredTechs = commonTechs.filter(t => t === 'All' || [...techs].some(pt => pt.toLowerCase() === t.toLowerCase()));

                setAvailableTechs(filteredTechs);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const getOptimizedUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
        }
        return url;
    };

    // Filter and Search Logic
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = (project.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (project.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
            const matchesTech = selectedTech === 'All' ||
                (project.technologies || []).some(t => t.toLowerCase() === selectedTech.toLowerCase());
            return matchesSearch && matchesTech;
        });
    }, [projects, searchQuery, selectedTech]);

    const featuredProjects = filteredProjects.filter(p => p.featured);
    const normalProjects = filteredProjects.filter(p => !p.featured);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-4"
                    >
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Projects</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto"
                    >
                        Explore my latest work, side projects, and open source contributions.
                    </motion.p>
                </div>

                {/* Controls: Search & Filter */}
                <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-800/30 p-4 rounded-2xl backdrop-blur-md border border-slate-700/50">

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        {availableTechs.map(tech => (
                            <button
                                key={tech}
                                onClick={() => setSelectedTech(tech)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTech === tech
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'
                                    }`}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-purple-400">✦</span> Featured Projects
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {featuredProjects.map((project) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group relative bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300"
                                >
                                    <div className="h-64 sm:h-80 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors z-10" />
                                        {project.image ? (
                                            <img
                                                src={getOptimizedUrl(project.image)}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                <Rocket size={48} className="text-slate-600 opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-3 py-1 rounded-full bg-purple-500/90 text-white text-xs font-bold backdrop-blur-md shadow-lg">
                                                Featured
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">{project.title}</h3>
                                                <div className="flex gap-2 mb-4">
                                                    {project.technologies?.slice(0, 3).map((t, i) => (
                                                        <span key={i} className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/30">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedProject(project)}
                                                className="p-3 bg-slate-700/50 rounded-xl hover:bg-purple-600 hover:text-white transition-all text-slate-300"
                                            >
                                                <ExternalLink size={20} />
                                            </button>
                                        </div>
                                        <p className="text-slate-400 line-clamp-2 mb-6">
                                            {project.description}
                                        </p>
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-purple-500/50 transition-all font-semibold"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Projects Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">All Projects</h2>
                    {normalProjects.length === 0 && featuredProjects.length === 0 ? (
                        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
                            <p className="text-slate-500 text-lg">No projects match your search.</p>
                            <button onClick={() => { setSearchQuery(''); setSelectedTech('All') }} className="mt-4 text-cyan-400 hover:underline">Clear filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {normalProjects.map((project, index) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedProject(project)}
                                    className="bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all cursor-pointer group"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        {project.image ? (
                                            <img
                                                src={getOptimizedUrl(project.image)}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                                                <Rocket size={32} />
                                            </div>
                                        )}
                                        {project.status && (
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-emerald-500/90 text-white' : 'bg-blue-500/90 text-white'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies?.slice(0, 3).map((t, i) => (
                                                <span key={i} className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                                                    {t}
                                                </span>
                                            ))}
                                            {project.technologies?.length > 3 && (
                                                <span className="text-xs text-slate-500 px-2 py-1">+ {project.technologies.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
};

export default ProjectsPage;

```

## src/pages/SkillsPage.jsx
```jsx
import Skills from '../components/Skills';

const SkillsPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 pt-16">
            <Skills />
        </div>
    );
};

export default SkillsPage;

```

## package.json
```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@cloudinary/react": "^1.14.4",
    "@cloudinary/url-gen": "^1.22.0",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.5.0",
    "@react-three/postprocessing": "^3.0.4",
    "@splinetool/react-spline": "^4.1.0",
    "@splinetool/runtime": "^1.12.57",
    "@tailwindcss/postcss": "^4.1.18",
    "@tsparticles/react": "^3.0.0",
    "@tsparticles/slim": "^3.9.1",
    "autoprefixer": "^10.4.24",
    "clsx": "^2.1.1",
    "course": "^0.0.1",
    "framer-motion": "^12.29.2",
    "lucide-react": "^0.563.0",
    "mongodb": "^7.1.0",
    "postcss": "^8.5.6",
    "react": "^19.2.0",
    "react-calendar-heatmap": "^1.10.0",
    "react-dom": "^19.2.0",
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^7.13.0",
    "react-scroll": "^1.9.3",
    "rollup": "^4.59.0",
    "tailwind-merge": "^3.4.0",
    "tailwindcss": "^4.1.18",
    "three": "^0.182.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/vite": "^4.1.18",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "lightningcss": "^1.31.1",
    "vite": "^7.2.4"
  }
}

```

## vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    cssMinify: 'esbuild'
  }
})

```

## .env
```text
VITE_API_URL=https://faiz-portfolio-juk6.onrender.com

```

