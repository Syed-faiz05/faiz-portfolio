import { useEffect, useState, useMemo, useRef } from 'react';
import './GithubIsometric.css';
import { Github, Rotate3d, LayoutGrid, Box } from 'lucide-react';

const GithubIsometric = ({ username }) => {
    const [data, setData] = useState(null);
    const [viewMode, setViewMode] = useState('3d');
    const [stats, setStats] = useState({
        total: 0,
        maxStreak: 0,
        currentStreak: 0,
        busiestDay: { date: '', count: 0 }
    });

    // Refs
    const scrollContainerRef = useRef(null);
    const worldRef = useRef(null);
    const isDragging = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });
    const viewModeRef = useRef('3d');

    // Rotation State (for 3D)
    const rotation = useRef({ x: 55, z: 45 });
    const momentum = useRef({ x: 0, z: 0 });
    const animationFrame = useRef(null);

    useEffect(() => {
        viewModeRef.current = viewMode;
    }, [viewMode]);

    useEffect(() => {
        fetchData();
        startAnimationLoop();
        return () => cancelAnimationFrame(animationFrame.current);
    }, [username]);

    // Auto-scroll to end (recent stats) when data loads
    useEffect(() => {
        if (data && scrollContainerRef.current) {
            setTimeout(() => {
                scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
            }, 100);
        }
    }, [data, viewMode]);

    const fetchData = async () => {
        try {
            const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last&ts=${Date.now()}`);
            if (!res.ok) throw new Error('API Response not ok');

            const json = await res.json();

            if (!json || !json.contributions || !Array.isArray(json.contributions)) {
                throw new Error('Invalid data format');
            }

            processData(json.contributions);
        } catch (error) {
            console.warn("GitHub API failed or rate-limited, using empty fallback.", error);
            generateFallbackData();
        }
    };

    const generateFallbackData = () => {
        const fallback = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            fallback.push({
                date: d.toISOString().split('T')[0],
                count: 0,
                level: 0
            });
        }
        setStats({
            total: 0,
            maxStreak: 0,
            currentStreak: 0,
            busiestDay: { date: today.toISOString().split('T')[0], count: 0 }
        });
        setData(fallback);
    };

    const processData = (contributions) => {
        try {
            const total = contributions.reduce((sum, day) => sum + (day.count || 0), 0);
            const busiest = contributions.reduce((max, day) => (day.count || 0) > (max.count || 0) ? day : max, { count: 0, date: new Date().toISOString() });

            let maxStreak = 0;
            let tempStreak = 0;

            // Filter invalid dates and sort
            const sorted = contributions
                .filter(d => d.date && !isNaN(new Date(d.date).getTime()))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            sorted.forEach((day) => {
                if (day.count > 0) tempStreak++;
                else {
                    if (tempStreak > maxStreak) maxStreak = tempStreak;
                    tempStreak = 0;
                }
            });
            if (tempStreak > maxStreak) maxStreak = tempStreak;

            const today = new Date().toISOString().split('T')[0];
            let activeStreak = 0;
            // Robust streak checking
            for (let i = sorted.length - 1; i >= 0; i--) {
                const day = sorted[i];
                if (day.date === today && day.count === 0) continue;
                if (day.count > 0) activeStreak++;
                else break;
            }

            setStats({ total, maxStreak, currentStreak: activeStreak, busiestDay: busiest });
            setData(sorted);
        } catch (err) {
            console.error("Error processing data", err);
            generateFallbackData();
        }
    };

    const startAnimationLoop = () => {
        const update = () => {
            if (!worldRef.current) return;

            if (viewModeRef.current === '3d') {
                if (!isDragging.current) {
                    rotation.current.z += momentum.current.z;
                    rotation.current.x += momentum.current.x;
                    momentum.current.z *= 0.95;
                    momentum.current.x *= 0.95;
                }
                worldRef.current.style.transform = `rotateX(${rotation.current.x}deg) rotateZ(${rotation.current.z}deg)`;
            }
            animationFrame.current = requestAnimationFrame(update);
        };
        update();
    };

    // ... Interaction Handlers ...
    const handleMouseDown = (e) => {
        if (viewMode === '2d') return;
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || viewMode === '2d') return;
        const deltaX = e.clientX - lastMouse.current.x;
        const deltaY = e.clientY - lastMouse.current.y;

        rotation.current.z -= deltaX * 0.4;
        rotation.current.x += deltaY * 0.4;
        momentum.current = { z: -deltaX * 0.04, x: deltaY * 0.04 };

        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => isDragging.current = false;

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [viewMode]);

    // Helpers
    const getBarColor = (count) => {
        if (count === 0) return { base: '#1e293b', side: '#0f172a', top: '#1e293b' };
        if (count <= 3) return { base: '#0e4429', side: '#062013', top: '#0e4429' };
        if (count <= 6) return { base: '#26a641', side: '#166126', top: '#26a641' };
        if (count <= 10) return { base: '#39d353', side: '#227d31', top: '#39d353' };
        return { base: '#4ade80', side: '#2c854c', top: '#4ade80' };
    };

    const getBarHeight = (count) => {
        if (count === 0) return '4px';
        return `${Math.min(count * 6 + 6, 70)}px`;
    };

    const weeks = useMemo(() => {
        if (!data) return [];
        const weeksArray = [];
        let currentWeek = [];
        data.forEach((day, i) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || i === data.length - 1) {
                weeksArray.push(currentWeek);
                currentWeek = [];
            }
        });
        return weeksArray;
    }, [data]);

    // Safety Loading State
    if (!data && !stats.total) return <div className="text-center p-10 text-gray-500 animate-pulse">Loading GitHub Graph...</div>;

    // Build Date String safely
    let formattedBusiestDate = '-';
    try {
        if (stats.busiestDay && stats.busiestDay.date) {
            formattedBusiestDate = new Date(stats.busiestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    } catch (e) { /* ignore date error */ }

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 max-w-6xl mx-auto select-none overflow-hidden flex flex-col">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-slate-700/50 gap-4">
                <div className="flex items-center gap-3">
                    <Github className="text-white" size={24} />
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">Contributions</h3>
                        <p className="text-xs text-gray-400">Syed-faiz05</p>
                    </div>
                </div>

                <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button
                        onClick={() => { setViewMode('2d'); rotation.current = { x: 0, z: 0 }; }}
                        className={`p-2 rounded-md transition-all ${viewMode === '2d' ? 'bg-slate-700 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        title="2D View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => { setViewMode('3d'); rotation.current = { x: 55, z: 45 }; }}
                        className={`p-2 rounded-md transition-all ${viewMode === '3d' ? 'bg-slate-700 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        title="3D View"
                    >
                        <Box size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`relative flex flex-col md:flex-row gap-6 transition-all duration-500 ${viewMode === '2d' ? 'h-auto' : 'h-[500px]'}`}>

                {/* Stats */}
                <div className="flex flex-col gap-6 min-w-[150px] z-10 pointer-events-none md:pt-10">
                    <div className="stat-item">
                        <h4>Longest Streak</h4>
                        <div className="value">{stats.maxStreak} <span className="text-sm text-gray-400">days</span></div>
                        <div className="meta">Keep it up!</div>
                    </div>
                    <div className="stat-item">
                        <h4>Current Streak</h4>
                        <div className="value stat-highlight">{stats.currentStreak} <span className="text-sm text-gray-400">days</span></div>
                    </div>
                </div>

                {/* Graph */}
                <div
                    ref={scrollContainerRef}
                    className={`flex-1 relative w-full overflow-hidden ${viewMode === '2d' ? 'overflow-x-auto custom-scrollbar pb-4' : 'cursor-grab active:cursor-grabbing items-center justify-center flex'}`}
                    onMouseDown={handleMouseDown}
                    style={{ perspective: viewMode === '3d' ? '1000px' : 'none' }}
                >
                    <div
                        ref={worldRef}
                        className={viewMode === '3d' ? "absolute transition-transform duration-75" : "flex gap-1"}
                        style={viewMode === '3d' ? { transformStyle: 'preserve-3d' } : {}}
                    >
                        <div className={viewMode === '3d' ? "flex gap-2" : "flex gap-1"}
                            style={viewMode === '3d' ? { transform: 'translate(-50%, -50%)', transformStyle: 'preserve-3d' } : {}}
                        >
                            {weeks.map((week, wIndex) => {
                                const firstDay = new Date(week[0].date);
                                const isNewMonth = firstDay.getDate() <= 7;
                                const monthName = !isNaN(firstDay) ? firstDay.toLocaleString('default', { month: 'short' }) : '';

                                return (
                                    <div key={wIndex} className={`flex flex-col ${viewMode === '3d' ? 'gap-2' : 'gap-1'}`}
                                        style={{
                                            marginLeft: isNewMonth && wIndex > 0 ? (viewMode === '3d' ? '30px' : '6px') : '0',
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        {isNewMonth && (
                                            <div className={`absolute text-cyan-400 font-bold text-xs whitespace-nowrap ${viewMode === '3d' ? '-top-16 left-0' : '-top-6 left-0'}`}
                                                style={viewMode === '3d' ? { transform: 'translateZ(60px) rotateX(-90deg)' } : {}}
                                            >
                                                {monthName}
                                            </div>
                                        )}

                                        {week.map((day, dIndex) => {
                                            const colors = getBarColor(day.count || 0);
                                            const height = getBarHeight(day.count || 0);
                                            let dateLabel = '-';
                                            try {
                                                dateLabel = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                            } catch (e) { }

                                            return (
                                                <div
                                                    key={day.date || dIndex}
                                                    className={`group relative ${viewMode === '3d' ? 'w-3 h-3 iso-block-wrapper' : 'w-3 h-3 rounded-[2px]'}`}
                                                    style={viewMode === '3d' ? { transformStyle: 'preserve-3d' } : { background: colors.base }}
                                                >
                                                    <div className="tooltip-container absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                                                        <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap border border-slate-700">
                                                            <strong>{day.count}</strong> contributions
                                                            <div className="text-gray-400 text-[10px]">{dateLabel}</div>
                                                        </div>
                                                    </div>

                                                    {viewMode === '3d' && (
                                                        <div className="iso-pillar absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-z-10"
                                                            style={{ transformStyle: 'preserve-3d' }}
                                                        >
                                                            <div className="absolute inset-0 border border-white/5"
                                                                style={{ background: colors.top, transform: `translateZ(${height})` }}
                                                            />
                                                            <div className="absolute top-0 right-0 h-full origin-right"
                                                                style={{ width: height, background: colors.side, transform: 'rotateY(90deg)', border: '1px solid rgba(255,255,255,0.05)' }}
                                                            />
                                                            <div className="absolute bottom-0 left-0 w-full origin-bottom"
                                                                style={{ height: height, background: colors.side, transform: 'rotateX(-90deg)', filter: 'brightness(0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Stats */}
                <div className="flex flex-col gap-6 min-w-[150px] z-10 pointer-events-none md:pt-10 text-right md:text-left">
                    <div className="stat-item">
                        <h4>1 Year Total</h4>
                        <div className="value stat-highlight">{stats.total.toLocaleString()}</div>
                        <div className="meta">Last Year</div>
                    </div>
                    <div className="stat-item">
                        <h4>Busiest Day</h4>
                        <div className="value">{formattedBusiestDate !== '-' ? stats.busiestDay.count : 0}</div>
                        <div className="meta">{formattedBusiestDate}</div>
                    </div>
                </div>

            </div>

            {viewMode === '3d' && (
                <div className="flex justify-center mt-4 opacity-50 z-20 relative">
                    <MousePointer2 size={16} className="text-white mr-2" />
                    <span className="text-xs text-white">Click & Drag to rotate • Hover for info</span>
                </div>
            )}
        </div>
    );
};

export default GithubIsometric;
