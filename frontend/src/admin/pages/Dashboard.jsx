
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layers, Code, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../../config';

const StatCard = ({ title, value, icon: Icon, color, to }) => (
    <Link to={to} className="block group">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden shadow-lg rounded-xl transition-all hover:bg-slate-800 hover:border-slate-600 h-full">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-400 truncate">{title}</p>
                        <p className="mt-2 text-3xl font-bold text-slate-100">{value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${color} bg-opacity-10 ring-1 ring-inset ring-opacity-20`}>
                        <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
                    </div>
                </div>
            </div>
            <div className="bg-slate-900/50 px-6 py-2 border-t border-slate-700/50">
                <div className="text-xs font-medium text-cyan-500 group-hover:text-cyan-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Manage {title} <ArrowRight className="h-3 w-3" />
                </div>
            </div>
        </div>
    </Link>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

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
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Overview</h2>
                    <p className="text-slate-400 mt-1">Welcome back, {user?.username}</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/" target="_blank" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        View Live Site
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Projects"
                    value={stats?.counts?.projects || 0}
                    icon={Layers}
                    color="text-indigo-400"
                    to="/admin/projects"
                />
                <StatCard
                    title="Skills"
                    value={stats?.counts?.skills || 0}
                    icon={Code}
                    color="text-emerald-400"
                    to="/admin/skills"
                />
                <StatCard
                    title="Messages"
                    value={stats?.counts?.messages || 0}
                    icon={MessageSquare}
                    color="text-purple-400"
                    to="/admin/messages"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Messages */}
                <div className="bg-slate-800/50 backdrop-blur-md shadow-lg rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5 text-cyan-400" />
                            <h3 className="text-lg leading-6 font-semibold text-slate-100">Recent Messages</h3>
                        </div>
                        <Link to="/admin/messages" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">View All</Link>
                    </div>
                    <ul className="divide-y divide-slate-700/50">
                        {stats?.recentMessages?.map((msg) => (
                            <li key={msg._id} className="px-6 py-4 hover:bg-slate-800/50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-medium ${!msg.read ? 'text-white' : 'text-slate-300'}`}>{msg.name}</span>
                                    <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-slate-400 truncate">{msg.subject}</p>
                            </li>
                        ))}
                        {(!stats?.recentMessages || stats.recentMessages.length === 0) && (
                            <li className="px-6 py-8 text-center text-slate-500 text-sm">No new messages</li>
                        )}
                    </ul>
                </div>

                {/* Recent Projects */}
                <div className="bg-slate-800/50 backdrop-blur-md shadow-lg rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Layers className="h-5 w-5 text-indigo-400" />
                            <h3 className="text-lg leading-6 font-semibold text-slate-100">Recent Projects</h3>
                        </div>
                        <Link to="/admin/projects" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">View All</Link>
                    </div>
                    <ul className="divide-y divide-slate-700/50">
                        {stats?.recentProjects?.map((project) => (
                            <li key={project._id} className="px-6 py-4 hover:bg-slate-800/50 transition-colors flex items-center gap-4">
                                <div className="h-10 w-10 rounded bg-slate-900 flex-shrink-0 overflow-hidden border border-slate-700">
                                    {project.image ? (
                                        <img src={project.image} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-600"><Layers className="h-4 w-4" /></div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{project.title}</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${project.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                        {project.status || 'Published'}
                                    </span>
                                </div>
                            </li>
                        ))}
                        {(!stats?.recentProjects || stats.recentProjects.length === 0) && (
                            <li className="px-6 py-8 text-center text-slate-500 text-sm">No projects yet</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
