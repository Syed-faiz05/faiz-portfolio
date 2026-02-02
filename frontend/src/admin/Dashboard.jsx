import { useEffect, useState } from 'react';
import { Package, Cpu, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projectsCount: 0,
        skillsCount: 0,
        lastUpdated: new Date()
    });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Projects
                const projectsRes = await fetch('/api/projects');
                const projectsData = await projectsRes.json();

                // Fetch Skills (Mock or Real)
                const skillsRes = await fetch('/api/skills');
                const skillsData = await skillsRes.json();

                setStats({
                    projectsCount: projectsData.length || 0,
                    skillsCount: skillsData.length || 0,
                    lastUpdated: new Date() // In a real app, this would come from the backend's "updatedAt"
                });
                setProjects(Array.isArray(projectsData) ? projectsData.slice(0, 3) : []);
                setLoading(false);
            } catch (error) {
                console.error('Data fetch failed', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-64 items-center justify-center text-slate-400 text-sm">
            Loading Overview...
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Overview Section */}
            <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Projects"
                        value={stats.projectsCount}
                        icon={<Package size={20} className="text-slate-400" />}
                    />
                    <StatCard
                        title="Total Skills"
                        value={stats.skillsCount}
                        icon={<Cpu size={20} className="text-slate-400" />}
                    />
                    <StatCard
                        title="Last Updated"
                        value="Just now"
                        icon={<Clock size={20} className="text-slate-400" />}
                        isDate
                    />
                </div>
            </section>

            {/* Quick Actions / Recent Items */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recent Projects</h2>
                    <Link to="/admin/projects" className="text-sm text-blue-600 hover:underline">View All</Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Project Name</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {projects.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {p.featured ? 'Featured' : 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to="/admin/projects" className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <ExternalLink size={16} className="inline" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                                        No projects found. Start by adding one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ title, value, icon, isDate }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800 mt-2">{value}</p>
        </div>
        <div>
            {icon}
        </div>
    </div>
);

export default Dashboard;
