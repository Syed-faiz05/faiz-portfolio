import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LeetCodeHeatmap = ({ username }) => {
    const [submissionData, setSubmissionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeetCodeData = async () => {
            try {
                // Fetch through our backend proxy to avoid CORS issues
                const response = await fetch(`http://localhost:5000/api/leetcode/${username}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

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
                        streak: data.data.matchedUser.userCalendar.streak
                    });
                } else {
                    throw new Error('No data available');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching LeetCode data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchLeetCodeData();
    }, [username]);

    const getIntensityClass = (count) => {
        if (count === 0) return 'bg-slate-700/30';
        if (count < 3) return 'bg-green-900/70';
        if (count < 6) return 'bg-green-700';
        if (count < 10) return 'bg-green-500';
        return 'bg-green-400';
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
            const count = submissionData.calendar[timestamp] || 0;

            const monthName = d.toLocaleString('default', { month: 'short' });
            if (monthName !== currentMonth) {
                currentMonth = monthName;
                months.push({ name: monthName, index: days.length });
            }

            days.push({
                date: new Date(d),
                count,
                day: d.getDay()
            });
        }

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return { weeks, months };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="ml-3 text-gray-400">Loading LeetCode activity...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-orange-400 mb-4">⚠️ Backend server needed for live LeetCode data</p>
                <p className="text-gray-500 text-sm mb-6">Please start the backend server: <code className="bg-slate-800 px-2 py-1 rounded">cd backend && node server.js</code></p>
                <div className="mt-4">
                    <a
                        href={`https://leetcode.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-orange-500/80 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
                    >
                        View LeetCode Profile →
                    </a>
                </div>
            </div>
        );
    }

    const heatmapData = generateHeatmapGrid();

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">
                    {submissionData?.totalActiveDays || 0} submissions in the past year
                </h3>
                <a
                    href={`https://leetcode.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500/80 hover:bg-orange-600 text-white text-sm px-4 py-1.5 rounded-full transition-colors"
                >
                    View Profile →
                </a>
            </div>

            {heatmapData && (
                <div className="overflow-x-auto pb-4">
                    {/* Month Labels */}
                    <div className="flex gap-1 mb-2 pl-12">
                        {heatmapData.months.map((month, idx) => (
                            <div
                                key={idx}
                                style={{
                                    marginLeft: idx === 0 ? '0' : `${(month.index - (heatmapData.months[idx - 1]?.index || 0)) * 3}px`
                                }}
                                className="text-xs text-gray-500"
                            >
                                {month.name}
                            </div>
                        ))}
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex gap-1">
                        {/* Day Labels */}
                        <div className="flex flex-col gap-1 mr-2 justify-around text-xs text-gray-500">
                            <div className="h-3">Mon</div>
                            <div className="h-3"></div>
                            <div className="h-3">Wed</div>
                            <div className="h-3"></div>
                            <div className="h-3">Fri</div>
                            <div className="h-3"></div>
                            <div className="h-3"></div>
                        </div>

                        {/* Grid */}
                        <div className="flex gap-1">
                            {heatmapData.weeks.map((week, weekIdx) => (
                                <div key={weekIdx} className="flex flex-col gap-1">
                                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                                        const day = week.find(d => d.day === dayIndex);
                                        return (
                                            <motion.div
                                                key={dayIndex}
                                                whileHover={{ scale: 1.3 }}
                                                className={`w-3 h-3 rounded-sm ${day ? getIntensityClass(day.count) : 'bg-slate-700/10'} cursor-pointer transition-all`}
                                                title={day ? `${day.count} submissions on ${day.date.toLocaleDateString()}` : ''}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-slate-700/30"></div>
                            <div className="w-3 h-3 rounded-sm bg-green-900/70"></div>
                            <div className="w-3 h-3 rounded-sm bg-green-700"></div>
                            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                            <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeetCodeHeatmap;
