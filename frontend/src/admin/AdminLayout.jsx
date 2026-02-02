import { useState } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    Cpu,
    LogOut,
    Settings,
    ChevronLeft,
    User
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    const currentPath = location.pathname.split('/')[2] || 'dashboard';

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
        { id: 'projects', label: 'Projects', icon: <FolderKanban size={18} />, path: '/admin/projects' },
        { id: 'skills', label: 'Skills', icon: <Cpu size={18} />, path: '/admin/skills' },
        { id: 'profile', label: 'Settings', icon: <Settings size={18} />, path: '/admin/profile' },
    ];

    const getPageTitle = () => {
        const item = navItems.find(i => i.id === currentPath);
        if (item) return item.label;
        if (currentPath === 'profile') return 'Settings';
        return 'Overview';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-inter text-slate-800">
            {/* Sidebar - Notion Style */}
            <aside className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                            F
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Faiz Portfolio</h3>
                            <p className="text-xs text-slate-500">CMS Admin</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all text-sm ${currentPath === item.id
                                        ? 'bg-white text-slate-900 shadow-sm border border-gray-100 font-medium'
                                        : 'text-slate-500 hover:bg-gray-100 hover:text-slate-900'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-slate-400 hover:text-slate-700 w-full px-3 py-2 rounded-md transition-colors text-sm"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Back to Portfolio
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-2"></div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full transition-colors">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                <User size={16} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
