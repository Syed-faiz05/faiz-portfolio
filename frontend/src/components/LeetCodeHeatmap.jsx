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
