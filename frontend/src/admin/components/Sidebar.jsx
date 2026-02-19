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
