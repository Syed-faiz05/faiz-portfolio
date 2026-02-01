import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Cpu, LogOut, Activity } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    // Derive active tab from current path, default to 'dashboard'
    const currentPath = location.pathname.split('/')[2] || 'dashboard';
    const activeTab = currentPath;

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Portfolio Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => navigate('/admin/dashboard')}
                    />
                    <NavItem
                        icon={<FolderKanban size={20} />}
                        label="Projects"
                        active={activeTab === 'projects'}
                        onClick={() => navigate('/admin/projects')}
                    />
                    <NavItem
                        icon={<Cpu size={20} />}
                        label="Skills"
                        active={activeTab === 'skills'}
                        onClick={() => navigate('/admin/skills')}
                    />
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-gray-400 hover:text-red-400 w-full p-3 rounded-lg transition-colors group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${active
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
            }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

export default AdminLayout;
