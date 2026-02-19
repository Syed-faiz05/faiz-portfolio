import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, GraduationCap, Rocket, Target, Award, ArrowUp, Loader2 } from 'lucide-react';
import NetworkParticles from '../components/NetworkParticles';
import API_URL from '../config';

// --- Animated Background Component (Reusing efficient NetworkParticles or creating a similar light one) ---
// Note: We'll stick to NetworkParticles for consistency but maybe tone down density if needed.

const TimelineNode = ({ item, index }) => {
    const isEven = index % 2 === 0;

    // Framer motion variants
    const cardVariants = {
        hidden: { opacity: 0, x: isEven ? -50 : 50, rotate: isEven ? -2 : 2 },
        visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
        }
    };

    const nodeVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.1 }
        }
    };

    // Determine Icon
    const getIcon = (type) => {
        switch (type) {
            case 'education': return <GraduationCap className="w-5 h-5" />;
            case 'experience': return <Briefcase className="w-5 h-5" />;
            case 'achievement': return <Award className="w-5 h-5" />;
            case 'goal': return <Target className="w-5 h-5" />;
            default: return <Rocket className="w-5 h-5" />;
        }
    };

    return (
        <div className={`flex justify-between items-center w-full mb-12 ${isEven ? 'md:flex-row-reverse' : ''}`}>

            {/* Empty Space for alignment */}
            <div className="hidden md:block w-5/12"></div>

            {/* Timeline Node (Center) */}
            <motion.div
                variants={nodeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                className="z-20 relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            >
                <div className="text-cyan-400">
                    {getIcon(item.type)}
                </div>
            </motion.div>

            {/* Content Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="w-full md:w-5/12 pl-8 md:pl-0"
            >
                <div className={`p-6 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden group ${!isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>

                    {/* Glowing corner accent */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-400/30 transition-all duration-500"></div>

                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-900/20 rounded-full border border-cyan-500/20">
                        {item.period}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                    </h3>

                    {item.subtitle && (
                        <h4 className="text-sm font-medium text-slate-400 mb-3">
                            {item.subtitle}
                        </h4>
                    )}

                    <p className="text-slate-300 text-sm leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const About = () => {
    const [timelineData, setTimelineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        fetchTimeline();
    }, []);

    const fetchTimeline = async () => {
        try {
            const res = await fetch(`${API_URL}/api/about`);
            if (res.ok) {
                const data = await res.json();
                setTimelineData(data);
            }
        } catch (error) {
            console.error("Failed to load timeline", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">

            {/* Background */}
            <div className="fixed inset-0 z-0">
                <NetworkParticles />
                {/* Extra deep space gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 pointer-events-none"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                {/* Intro Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 md:mb-32"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-sm">
                        My Journey
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
                        A timeline of my growth, learning, and milestones as a developer.
                        Every step forward is a new lesson learned.
                    </p>
                </motion.div>

                {/* Timeline Container */}
                <div className="relative max-w-5xl mx-auto">

                    {/* Vertical Line (Background) */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 transform md:-translate-x-1/2 z-0 h-full"></div>

                    {/* Animated Progress Line */}
                    <motion.div
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-600 transform md:-translate-x-1/2 z-1 origin-top shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                        style={{ scaleY: scrollYProgress }}
                    />

                    {/* Timeline Items */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                        </div>
                    ) : timelineData.length > 0 ? (
                        <div className="space-y-12 md:space-y-24 md:pl-0">
                            {/* pl-0 on mobile because we want full width flexibility */}
                            {timelineData.map((item, index) => (
                                <TimelineNode key={item._id || index} item={item} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-dashed border-slate-700">
                            <p className="text-slate-500 text-lg">Timeline data coming soon...</p>
                        </div>
                    )}
                </div>

                {/* Future / Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-32 pb-10"
                >
                    <p className="text-slate-500 mb-4 uppercase tracking-widest text-xs font-bold">What's Next?</p>
                    <h2 className="text-3xl font-bold text-white mb-6">Building the Future</h2>
                    <div className="inline-flex items-center gap-2 text-cyan-400 font-semibold border-b border-cyan-500/30 pb-1 hover:text-cyan-300 transition-colors cursor-pointer">
                        See my latest projects <Rocket className="w-4 h-4" />
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default About;
