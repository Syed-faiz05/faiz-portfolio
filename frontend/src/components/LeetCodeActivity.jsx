import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, ShieldAlert, Cpu } from 'lucide-react';
import TerminalText from './TerminalText';
import API_URL from '../config';

const LeetCodeActivity = ({ username }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    

    useEffect(() => {
        const fetchLeetCodeData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/leetcode/${username}?t=${Date.now()}`);
                const data = res.ok ? await res.json() : null;

                if (data && data.status === "success") {
                    setStats({
                        totalSolved: data.totalSolved,
                        totalQuestions: data.totalQuestions,
                        easySolved: data.easySolved,
                        totalEasy: data.totalEasy,
                        mediumSolved: data.mediumSolved,
                        totalMedium: data.totalMedium,
                        hardSolved: data.hardSolved,
                        totalHard: data.totalHard,
                        acceptanceRate: data.acceptanceRate,
                        ranking: data.ranking,
                        contributionPoints: data.contributionPoints,
                        streak: data.streak,
                        contestRating: data.contestRating
                    });
                }
            } catch (error) {
                console.error("Error fetching LeetCode data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeetCodeData();
    }, [username]);

    if (loading) {
        return (
            <div className="w-full h-[500px] bg-black border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] flex flex-col items-center justify-center font-mono">
                <Terminal size={48} className="text-amber-500 animate-pulse mb-4" />
                <p className="text-amber-500 text-sm tracking-widest uppercase">INITIALIZING LEETCODE_UPLINK...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="w-full h-[500px] bg-black border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] flex flex-col items-center justify-center font-mono p-6">
                <ShieldAlert size={48} className="text-red-500 animate-pulse mb-4" />
                <p className="text-red-500 text-sm tracking-widest uppercase text-center">ERR_CONNECTION_REFUSED: LEETCODE MAINFRAME UNREACHABLE.</p>
            </div>
        );
    }

    // Helper to generate the discrete capacity blocks `████░░░`
    const generateCapacityBar = (solved, total, maxBlocks = 20) => {
        if (!total) return '░'.repeat(maxBlocks);
        const percentage = solved / total;
        const filledBlocks = Math.round(percentage * maxBlocks);
        const emptyBlocks = maxBlocks - filledBlocks;
        return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    };

    const DifficultyMeter = ({ label, solved, total, delay }) => (
        <div className="mb-4 group/meter">
            <div className="flex justify-between text-xs mb-1 font-mono uppercase tracking-widest">
                <span className="text-amber-500">{">"} {label}</span>
                <span className="text-amber-600">[{solved}/{total}]</span>
            </div>
            <div className="text-amber-500 text-sm tracking-widest whitespace-nowrap overflow-hidden">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay }}
                >
                    [{generateCapacityBar(solved, total)}]
                </motion.span>
            </div>
        </div>
    );

    return (
        <div  className="w-full bg-black border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)] relative group font-mono h-full flex flex-col">
            
            {/* Terminal Top Bar */}
            <div className="h-8 bg-amber-950/20 border-b border-amber-500/40 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600/50 border border-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-600/50 border border-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-600 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                </div>
                <div className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">root@{username}:~/leetcode</div>
            </div>

            <div className="p-6 md:p-8 relative z-10 flex-1 flex flex-col">
                {/* Header Phase */}
                <div className="mb-8 border-b border-amber-500/20 pb-4">
                    <div className="flex items-center gap-3">
                        <Terminal size={24} className="text-amber-500 animate-pulse" />
                        <h3 className="text-xl font-bold text-amber-400 tracking-tight uppercase">
                            <TerminalText text="LEETCODE_CORE_SYSTEM" delay={0.2} />
                        </h3>
                    </div>
                    <div className="mt-2 text-amber-700 text-xs uppercase tracking-widest shadow-none">
                        SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}-{Date.now().toString().slice(-4)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                    {/* Left Column: Difficulty Meters */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-20px' }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col justify-center border border-amber-500/20 p-6 bg-black relative"
                    >
                        <div className="absolute top-0 left-0 px-2 py-0.5 bg-amber-900/40 text-amber-500 text-[10px] border-b border-r border-amber-500/20 uppercase">
                            ~/difficulty_dist.log
                        </div>
                        
                        <div className="mt-4">
                            <DifficultyMeter label="EASY_THREAD" solved={stats.easySolved} total={stats.totalEasy} delay={0.4} />
                            <DifficultyMeter label="MED_PROCESS" solved={stats.mediumSolved} total={stats.totalMedium} delay={0.6} />
                            <DifficultyMeter label="HARD_DAEMON" solved={stats.hardSolved} total={stats.totalHard} delay={0.8} />
                        </div>
                    </motion.div>

                    {/* Right Column: Terminal Stats */}
                    <div className="grid grid-rows-3 gap-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="border border-amber-500/30 p-4 bg-black/50 hover:border-amber-400 hover:bg-amber-950/20 transition-all duration-300 group flex flex-col justify-center"
                        >
                            <span className="text-amber-600 text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Database size={12} className="text-amber-500" /> SYS_RANKING (GLOBAL)
                            </span>
                            <div className="text-3xl font-bold text-amber-400 tracking-tight">
                                <TerminalText text={stats.ranking} delay={0.6} />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="border border-orange-500/30 p-4 bg-black/50 hover:border-orange-400 hover:bg-orange-950/20 transition-all duration-300 group flex flex-col justify-center"
                        >
                            <span className="text-orange-600 text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Cpu size={12} className="text-orange-500" /> ACCEPTANCE_RATE
                            </span>
                            <div className="text-3xl font-bold text-orange-400 tracking-tight">
                                <TerminalText text={stats.acceptanceRate} delay={0.8} />%
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                            className="border border-yellow-500/30 p-4 bg-black/50 hover:border-yellow-400 hover:bg-yellow-950/20 transition-all duration-300 group flex flex-col justify-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-yellow-500/5 animate-pulse"></div>
                            <span className="text-yellow-600 text-xs uppercase tracking-widest mb-1 relative z-10 flex items-center gap-2">
                                <Terminal size={12} className="text-yellow-500" /> CONTEST_RATING
                            </span>
                            <div className="text-2xl font-bold text-yellow-400 tracking-tight relative z-10">
                                {stats.contestRating ? <TerminalText text={stats.contestRating} delay={1.0} /> : <span className="text-yellow-600/50">UNRATED</span>}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* System Process Footer (Streak) */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="mt-8 pt-4 border-t-2 border-dashed border-amber-500/30 flex flex-col items-center justify-center w-full"
                >
                    <div className="text-xs text-amber-600 uppercase mb-2">~ executing script: streak_monitor.sh</div>
                    <div className="px-6 py-2 bg-amber-950/30 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <span className="text-amber-400 font-bold tracking-widest uppercase text-sm sm:text-base">
                            {">"} SYSTEM_STATUS: <span className="text-white animate-pulse">ACTIVE</span> | DSA_STREAK == <TerminalText text={stats.streak || 0} delay={1.2} /> DAYS
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LeetCodeActivity;
