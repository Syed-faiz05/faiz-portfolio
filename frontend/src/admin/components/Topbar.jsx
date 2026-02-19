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
