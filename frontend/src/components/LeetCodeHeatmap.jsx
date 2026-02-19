

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Calendar, Zap, RefreshCw, ExternalLink } from 'lucide-react';

const LeetCodeHeatmap = ({ username }) => {
    const [submissionData, setSubmissionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchLeetCodeData = async () => {
        try {
            // Using timestamp to prevent caching
            const response = await fetch(`http://localhost:5000/api/leetcode/${username}?t=${Date.now()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch LeetCode data');
            }

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            if (data.data?.matchedUser?.userCalendar) {
                const calendar = JSON.parse(data.data.matchedUser.userCalendar.submissionCalendar);
                setSubmissionData({
                    calendar,
                    totalActiveDays: data.data.matchedUser.userCalendar.totalActiveDays,
                    streak: data.data.matchedUser.userCalendar.streak,
                    activeYears: data.data.matchedUser.userCalendar.activeYears
                });
                setLastUpdated(new Date());
            } else {
                throw new Error('No data available');
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching LeetCode data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeetCodeData();
        // Poll every 5 minutes for live updates
        const interval = setInterval(fetchLeetCodeData, 300000);
        return () => clearInterval(interval);
    }, [username]);

    const getIntensityClass = (count) => {
        if (count === 0) return 'bg-slate-800/50';
        if (count < 3) return 'bg-emerald-900/60 shadow-[0_0_5px_rgba(16,185,129,0.2)]';
        if (count < 6) return 'bg-emerald-600/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
        if (count < 10) return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]';
        return 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse'; // Super active days glow cyan
    };

    const generateHeatmapGrid = () => {
        if (!submissionData) return null;

        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const days = [];
        const months = [];
        let currentMonth = '';

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const timestamp = Math.floor(d.getTime() / 1000).toString();
            // Check for submissions on this day, or active timestamp keys in the calendar object
            // Use 86400 (seconds in a day) window to catch timezone overlaps if needed, 
            // but usually direct key match is enough if LeetCode normalizes to midnight UTC.
            // Let's iterate keys for robustness if direct match fails, or stick to direct match 
            // since LeetCode usually sends unix timestamp of midnight.

            // Actually, simply checking if any timestamp in calendar falls within this day's range is safer.
            // But for efficiency, we assume standard daily keys.

            // Correction: LeetCode keys are timestamps. We need to sum up all submissions for that specific day.
            // Since we iterate by day, let's normalize the check.

            let count = 0;
            // Simple check: LeetCode returns specific timestamps. 
            // We just check if the exact timestamp key exists (simplest)
            // or match ranges. Standard LeetCode API usually gives start of day timestamps.

            // Let's just try direct lookup first, and if 0, maybe check range.
            // Actually, for heatmap, we can just map the keys to dates.

            // Better approach: Iterate the calendar keys once and map to date strings (YYYY-MM-DD)
            // Then lookup by date string in this loop.
        }

        // Re-implementing faster generation:
        const calendarMap = {};
        Object.keys(submissionData.calendar).forEach(ts => {
            const date = new Date(parseInt(ts) * 1000);
            const dateKey = date.toISOString().split('T')[0];
            calendarMap[dateKey] = (calendarMap[dateKey] || 0) + submissionData.calendar[ts];
        });

        // Regenerate loop
        const loopDate = new Date(oneYearAgo);
        while (loopDate <= today) {
            const dateKey = loopDate.toISOString().split('T')[0];
            const count = calendarMap[dateKey] || 0;

            const monthName = loopDate.toLocaleString('default', { month: 'short' });
            if (monthName !== currentMonth) {
                currentMonth = monthName;
                months.push({ name: monthName, index: days.length });
            }

            days.push({
                date: new Date(loopDate),
                dateStr: dateKey,
                count,
                day: loopDate.getDay() // 0 = Sunday
            });

            loopDate.setDate(loopDate.getDate() + 1);
        }

        const weeks = [];
        // Slice roughly into weeks. To align strictly with Monday/Sunday start, 
        // we might need padding at the start.
        // Let's just do simple chunking for visual heatmap style like GitHub.
        // GitHub starts cols with Sunday (or Mon).

        // Start a new week whenever day is Sunday (0)? 
        // Or just chunk by 7. 
        // Standard Heatmap: Columns are weeks. Rows are days (Mon-Sun or Sun-Sat).

        // We'll construct columns (weeks).
        // First day of our range might not be a Sunday. 

        // Add padding days at the start to align first week
        const startDay = days[0].day; // 0-6
        const padding = Array(startDay).fill(null); // Simple padding

        const allDays = [...padding, ...days];

        for (let i = 0; i < allDays.length; i += 7) {
            weeks.push(allDays.slice(i, i + 7));
        }

        return { weeks, months };
    };

    if (loading) {
        return (
            <div className="w-full h-48 bg-slate-900/50 rounded-xl border border-slate-800 animate-pulse flex flex-col items-center justify-center">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
                </div>
                <span className="mt-3 text-cyan-500/50 text-xs tracking-widest uppercase">Syncing Neural Link...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-48 bg-red-950/10 rounded-xl border border-red-500/20 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-red-400 font-medium mb-2">Connection Severed</p>
                <p className="text-red-400/50 text-xs mb-4">{error}</p>
                <button
                    onClick={fetchLeetCodeData}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded uppercase tracking-wider transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const heatmapData = generateHeatmapGrid();
    const totalSubmissions = submissionData ? Object.values(submissionData.calendar).reduce((a, b) => a + b, 0) : 0;

    return (
        <div className="w-full p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/50 shadow-xl overflow-hidden relative group">

            {/* Ambient Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-1000"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-1000"></div>

            {/* Header Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="w-6 h-6 opacity-80" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            System Activity
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </h3>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                            @{username} <span className="text-slate-600">|</span> Last synced: {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 mt-4 md:mt-0">
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Solved</div>
                        <div className="text-xl font-bold text-cyan-400 font-mono shadow-cyan-500/50 drop-shadow-sm">{totalSubmissions}</div>
                    </div>
                    <div className="text-right pl-4 border-l border-slate-700/50">
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Streak</div>
                        <div className="text-xl font-bold text-emerald-400 font-mono">{submissionData?.streak || 0} Days</div>
                    </div>
                    <div className="text-right pl-4 border-l border-slate-700/50">
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Active Days</div>
                        <div className="text-xl font-bold text-indigo-400 font-mono">{submissionData?.totalActiveDays || 0}</div>
                    </div>
                </div>
            </div>

            {/* Heatmap Visualization */}
            {heatmapData && (
                <div className="relative z-10 w-full overflow-x-auto custom-scrollbar pb-2">
                    <div className="min-w-[700px]">
                        {/* Month Labels */}
                        <div className="flex mb-2 text-[10px] font-mono text-slate-500 pl-8">
                            {/* Simplified equidistant rendering for visual balance, or mapped precisely */}
                            {heatmapData.months.map((m, i) => (
                                <div key={i} className="flex-1 opacity-70">{m.name}</div>
                            ))}
                        </div>

                        <div className="flex gap-1">
                            {/* Day Labels Row */}
                            <div className="flex flex-col gap-[3px] pr-2 text-[9px] font-mono text-slate-600 justify-between h-[100px] pt-1">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>

                            {/* Grid Columns (Weeks) */}
                            {heatmapData.weeks.map((week, weekIdx) => (
                                <div key={weekIdx} className="flex flex-col gap-[3px]">
                                    {week.map((day, dayIdx) => (
                                        <motion.div
                                            key={dayIdx}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: weekIdx * 0.01 + dayIdx * 0.005 }}
                                            whileHover={{
                                                scale: 1.5,
                                                zIndex: 10,
                                                boxShadow: "0 0 10px rgba(6,182,212,0.5)"
                                            }}
                                            className={`
                                                w-[12px] h-[12px] rounded-sm 
                                                ${day ? getIntensityClass(day.count) : 'bg-transparent'} 
                                                transition-colors duration-300
                                                relative group/cell
                                            `}
                                        >
                                            {/* Tooltip */}
                                            {day && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/cell:opacity-100 pointer-events-none z-50 shadow-lg border border-slate-700">
                                                    <span className="font-bold text-cyan-400">{day.count}</span> submissions on {day.dateStr}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4 flex justify-between items-center border-t border-slate-800/50 pt-3">
                <a
                    href={`https://leetcode.com/${username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                >
                    View Full Profile <ExternalLink size={12} />
                </a>

                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                    <span>Low</span>
                    <div className="w-2 h-2 rounded bg-emerald-900/60"></div>
                    <div className="w-2 h-2 rounded bg-emerald-600/80"></div>
                    <div className="w-2 h-2 rounded bg-emerald-500"></div>
                    <div className="w-2 h-2 rounded bg-cyan-400 animate-pulse"></div>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};

export default LeetCodeHeatmap;


