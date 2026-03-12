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
