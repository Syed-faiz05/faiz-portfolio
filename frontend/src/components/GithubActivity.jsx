import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, HardDrive, Cpu, Network, Database } from 'lucide-react';
import TerminalText from './TerminalText';

const GithubActivity = ({ username }) => {
    const [stats, setStats] = useState(null);
    const [heatmap, setHeatmap] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [recentCommits, setRecentCommits] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Ref for stagger animation trigger
    

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                // 1. Fetch User Data
                const userRes = await fetch(`https://api.github.com/users/${username}?t=${Date.now()}`);
                const userData = userRes.ok ? await userRes.json() : null;

                // 2. Fetch Contributions (Using Jogruber API)
                const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
                const contribData = contribRes.ok ? await contribRes.json() : null;

                // 3. Fetch Repos for accurate native Top Languages
                const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&t=${Date.now()}`);
                const reposData = reposRes.ok ? await reposRes.json() : [];

                // Process Contributions
                let totalCommits = 0;
                let processedHeatmap = [];
                if (contribData && contribData.contributions) {
                    totalCommits = contribData.total[Object.keys(contribData.total)[0]] || 0;
                    
                    let currentWeek = [];
                    contribData.contributions.forEach((day, index) => {
                        currentWeek.push(day);
                        if (currentWeek.length === 7 || index === contribData.contributions.length - 1) {
                            processedHeatmap.push(currentWeek);
                            currentWeek = [];
                        }
                    });
                }

                // Process Languages natively
                const langMap = {};
                let totalSize = 0;
                
                reposData.forEach(repo => {
                    if (repo.language && !repo.fork) {
                        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                        totalSize += 1;
                    }
                });

                const topLangs = Object.entries(langMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, count]) => ({
                        name,
                        percent: ((count / totalSize) * 100).toFixed(1),
                    }));

                // 4. Fetch Events for Recent Commits Timeline
                const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=50&t=${Date.now()}`);
                const eventsData = eventsRes.ok ? await eventsRes.json() : [];

                const extractedCommits = [];
                for (const event of eventsData) {
                    if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
                        for (const commit of event.payload.commits) {
                            extractedCommits.push({
                                sha: commit.sha.substring(0, 7),
                                message: commit.message.split('\n')[0], // Get first line only
                                repo: event.repo.name,
                                date: event.created_at,
                            });
                            if (extractedCommits.length >= 6) break;
                        }
                    }
                    if (extractedCommits.length >= 6) break;
                }

                setStats({
                    commits: totalCommits,
                    repos: userData ? userData.public_repos : reposData.length,
                    followers: userData ? userData.followers : 0,
                    stars: reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0)
                });
                
                setHeatmap(processedHeatmap);
                setLanguages(topLangs);
                setRecentCommits(extractedCommits);
                
            } catch (error) {
                console.error("Error fetching Github data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGithubData();
    }, [username]);

    // Matrix block colors mapping
    const getHeatmapColor = (count) => {
        if (count === 0) return 'bg-[#0f0f0f] border-green-900/30';
        if (count <= 3) return 'bg-green-900 border-green-600 shadow-[0_0_8px_rgba(34,197,94,0.3)] animate-pulse-slow';
        if (count <= 6) return 'bg-green-700 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]';
        if (count <= 10) return 'bg-green-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.7)] hover:bg-white animate-[pulse_1s_infinite]';
        return 'bg-green-300 border-green-100 shadow-[0_0_20px_rgba(134,239,172,1)] hover:bg-white';
    };

    if (loading) {
        return (
            <div className="w-full h-[500px] bg-black border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] flex flex-col items-center justify-center font-mono">
                <Terminal size={48} className="text-green-500 animate-pulse mb-4" />
                <p className="text-green-500 text-sm tracking-widest uppercase">INITIALIZING GITHUB_UPLINK...</p>
            </div>
        );
    }

    const StatCard = ({ icon: Icon, value, label, delay }) => (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay }}
            className="border border-green-500/30 p-4 bg-black/50 hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all duration-300 group font-mono"
        >
            <div className="flex items-center gap-3 mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <Icon size={16} className="text-green-500" />
                <span className="text-green-600 text-xs uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-xl font-bold text-green-400 tracking-tight">
                {stats ? <TerminalText text={value} delay={delay} /> : '[NULL]'}
            </div>
        </motion.div>
    );

    return (
        <div  className="w-full bg-black border border-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.1)] relative group font-mono">
            {/* Terminal Top Bar */}
            <div className="h-8 bg-green-950/20 border-b border-green-500/40 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600/50 border border-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-600/50 border border-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-600 border border-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="text-[10px] text-green-600 font-bold uppercase tracking-widest">root@{username}:~/github</div>
            </div>

            <div className="p-6 md:p-8 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <Terminal size={24} className="text-green-500 animate-pulse" />
                        <h3 className="text-xl font-bold text-green-400 tracking-tight uppercase">
                            <TerminalText text="GITHUB_DATA_STREAM_ACTIVE" />
                        </h3>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={HardDrive} value={stats?.commits || 0} label="SYS_COMMITS" delay={0.1} />
                    <StatCard icon={Database} value={stats?.repos || 0} label="REPOSITORIES" delay={0.2} />
                    <StatCard icon={Network} value={stats?.followers || 0} label="NODES_LINKED" delay={0.3} />
                    <StatCard icon={Cpu} value={stats?.stars || 0} label="STARS_GATHERED" delay={0.4} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* Heatmap Area */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-20px' }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="xl:col-span-2 border border-green-500/20 p-6 bg-black relative"
                    >
                        <div className="absolute top-0 left-0 px-2 py-0.5 bg-green-900/40 text-green-500 text-[10px] border-b border-r border-green-500/20">
                            ~/heat_signature.log
                        </div>
                        
                        <div className="mt-4 overflow-x-auto pb-4 terminal-scroll">
                            <div className="flex gap-[2px] min-w-max">
                                {heatmap.map((week, wIndex) => (
                                    <motion.div 
                                        key={wIndex} 
                                        className="flex flex-col gap-[2px]"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-20px' }}
                                        transition={{ duration: 0.1, delay: 0.5 + (wIndex * 0.01) }}
                                    >
                                        {week.map((day) => {
                                            const count = day.count || 0;
                                            const colorClass = getHeatmapColor(count);
                                            let dateLabel = '-';
                                            try { dateLabel = new Date(day.date).toISOString().split('T')[0]; } catch (e) { console.debug(e); }

                                            return (
                                                <div
                                                    key={day.date}
                                                    className={`w-3.5 h-3.5 border ${colorClass} transition-colors duration-100 relative group/block cursor-crosshair`}
                                                >
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/block:opacity-100 z-50 pointer-events-none">
                                                        <div className="bg-black text-green-400 text-xs px-2 py-1 border border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] whitespace-nowrap flex flex-col items-center uppercase">
                                                            <span className="font-bold">[{count} COMMITS]</span>
                                                            <span className="text-green-700 text-[10px]">{dateLabel}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Top Languages Area */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-20px' }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="border border-green-500/20 p-6 bg-black flex flex-col relative"
                    >
                        <div className="absolute top-0 left-0 px-2 py-0.5 bg-green-900/40 text-green-500 text-[10px] border-b border-r border-green-500/20">
                            ~/lang_metrics.sh
                        </div>

                        <div className="space-y-4 mt-6 flex-1 flex flex-col justify-center">
                            {languages.length > 0 ? languages.map((lang, idx) => {
                                const boxCount = Math.ceil(parseFloat(lang.percent) / 10);
                                const emptyBoxes = 10 - boxCount;
                                const barStr = '█'.repeat(boxCount) + '░'.repeat(emptyBoxes);

                                return (
                                    <div key={lang.name} className="relative group/lang flex flex-col gap-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-green-400 uppercase">
                                                {">"} {lang.name}
                                            </span>
                                            <span className="text-green-600">{lang.percent}%</span>
                                        </div>
                                        <div className="text-green-500/70 text-sm tracking-widest whitespace-nowrap overflow-hidden">
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-20px' }}
                                                transition={{ duration: 0.5, delay: 0.8 + (idx * 0.2) }}
                                            >
                                                [{barStr}]
                                            </motion.span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-green-700 text-sm animate-pulse">Awaiting parameter data...</div>
                            )}
                        </div>
                    </motion.div>

                </div>

                {/* Recent Commits Timeline Area */}
                {recentCommits.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-20px' }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mt-8 border border-green-500/20 p-6 bg-black relative"
                    >
                        <div className="absolute top-0 left-0 px-2 py-0.5 bg-green-900/40 text-green-500 text-[10px] border-b border-r border-green-500/20">
                            ~/sys_log_recent_commits.txt
                        </div>
                        
                        <div className="space-y-4 mt-4">
                                {recentCommits.map((commit, idx) => {
                                let formattedDate = '-';
                                try {
                                    formattedDate = new Date(commit.date).toISOString();
                                } catch (e) { console.debug(e); }

                                return (
                                    <motion.div
                                        key={commit.sha}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }}
                                        transition={{ duration: 0.2, delay: 0.9 + (idx * 0.1) }}
                                        className="border-l-2 border-green-800 hover:border-green-400 pl-4 py-1 transition-colors group/commit flex flex-col justify-center"
                                    >
                                        <div className="flex items-center gap-3 text-[10px] text-green-700 font-bold mb-1">
                                            <span className="text-green-500 bg-green-950/50 px-1 border border-green-800">SHA:{commit.sha}</span>
                                            <span>TS:{formattedDate}</span>
                                        </div>
                                        <p className="text-green-400 text-sm group-hover/commit:text-white transition-colors">
                                            <span className="text-green-600 mr-2">{">"}</span>
                                            {commit.message}
                                        </p>
                                        <div className="text-xs text-green-600 mt-1 uppercase">
                                            DIR: {commit.repo}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

            </div>
            
            <style>{`
                .terminal-scroll::-webkit-scrollbar {
                    height: 8px;
                }
                .terminal-scroll::-webkit-scrollbar-track {
                    background: #000;
                    border-top: 1px solid rgba(34, 197, 94, 0.2);
                }
                .terminal-scroll::-webkit-scrollbar-thumb {
                    background: rgba(34, 197, 94, 0.5);
                }
                .terminal-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(34, 197, 94, 0.8);
                }
            `}</style>
        </div>
    );
};

export default GithubActivity;
