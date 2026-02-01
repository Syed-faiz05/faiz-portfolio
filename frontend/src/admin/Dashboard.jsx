import { useEffect, useState } from 'react';
import { Eye, Clock, Calendar, BarChart3 } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch('/api/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch analytics");
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Analytics...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Visits"
                    value={stats?.totalVisits || 0}
                    icon={<Eye className="text-cyan-400" size={24} />}
                    color="border-cyan-500/20 bg-cyan-500/5"
                />
                <StatCard
                    title="Active Projects"
                    value={stats?.projectCount || '5+'}
                    icon={<FolderIcon className="text-purple-400" size={24} />}
                    color="border-purple-500/20 bg-purple-500/5"
                    sub="Live on Portfolio"
                />
                <StatCard
                    title="Last Visit"
                    value={stats?.latestLogs?.[0] ? new Date(stats.latestLogs[0].timestamp).toLocaleTimeString() : 'N/A'}
                    icon={<Clock className="text-green-400" size={24} />}
                    color="border-green-500/20 bg-green-500/5"
                    sub="Just now"
                />
            </div>

            {/* Recent Activity Table */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ActivityIcon /> Recent Traffic
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4">Time</th>
                                <th className="p-4">IP Address</th>
                                <th className="p-4">Path</th>
                                <th className="p-4">User Agent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 text-sm text-gray-300">
                            {stats?.latestLogs?.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="p-4 whitespace-nowrap text-gray-400">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="p-4 font-mono text-cyan-400/80">{log.ip}</td>
                                    <td className="p-4">
                                        <span className="bg-slate-700 px-2 py-1 rounded text-xs">{log.path}</span>
                                    </td>
                                    <td className="p-4 truncate max-w-[200px]" title={log.userAgent}>
                                        {log.userAgent}
                                    </td>
                                </tr>
                            ))}
                            {(!stats?.latestLogs || stats.latestLogs.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">No recent activity logged</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, sub }) => (
    <div className={`p-6 rounded-xl border ${color} backdrop-blur-sm relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
);

// Fallback icons if not imported
const FolderIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
);

const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);

export default Dashboard;
