import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Award, Loader2, Rocket, Trophy, Target, Star, Medal } from 'lucide-react';
import NetworkParticles from '../components/NetworkParticles';
import API_URL from '../config';

const AchievementNode = ({ item, index }) => {
    const isEven = index % 2 === 0;

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

    const getIcon = (type) => {
        // Since we are filtering for mostly achievements, let's use some cool icons
        return <Trophy className="w-5 h-5 text-yellow-400" />;
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
                className="z-20 relative flex items-center justify-center w-12 h-12 rounded-full bg-[#161b22] border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.6)]"
            >
                {getIcon(item.type)}
            </motion.div>

            {/* Content Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="w-full md:w-5/12 pl-8 md:pl-0"
            >
                <div className={`p-6 rounded-2xl bg-[#0d1117]/80 backdrop-blur-md border border-slate-700/50 shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 relative overflow-hidden group ${!isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    
                    {/* Glowing corner accent */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-400/20 transition-all duration-500"></div>

                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-yellow-500 uppercase bg-yellow-900/20 rounded-full border border-yellow-500/30">
                        {item.period}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                        {item.title}
                    </h3>

                    {item.subtitle && (
                        <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-slate-500" /> {item.subtitle}
                        </h4>
                    )}

                    {item.image && (
                        <div className="mb-4 rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
                            <img src={item.image} alt={item.title} className="w-full h-auto object-cover max-h-48 hover:scale-105 transition-transform duration-500" />
                        </div>
                    )}

                    <p className="text-slate-300 text-sm leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    
    // Smooth spring animation for the center line
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch(`${API_URL}/api/about`);
                if (res.ok) {
                    const data = await res.json();
                    
                    // Filter timeline data down to mostly achievements or highly relevant items.
                    // If everything in DB is simply an achievement we want them all. 
                    // To be safe we'll show items that are 'achievement' OR just show all if none have type configured.
                    // Assuming we're re-using the timeline collection mostly for about/experience/achievements:
                    const onlyAchievements = data.filter(d => d.type === 'achievement' || d.type === 'goal' || d.title.toLowerCase().includes('won') || d.title.toLowerCase().includes('award'));
                    
                    // Fallback to all if user hasn't typed them specifically
                    if (onlyAchievements.length > 0) {
                        setAchievements(onlyAchievements);
                    } else {
                        setAchievements(data); 
                    }
                }
            } catch (error) {
                console.error("Failed to load achievements", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans pt-20">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <NetworkParticles />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 pointer-events-none"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/30">
                            <Trophy className="w-10 h-10 text-yellow-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-amber-500 mb-6 drop-shadow-sm">
                        Honors & Achievements
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
                        A showcase of awards, recognitions, hackathons, and key milestones throughout my coding journey.
                    </p>
                </motion.div>

                {/* Timeline Container */}
                <div className="relative max-w-5xl mx-auto mb-32">
                    
                    {/* Vertical Line (Background) */}
                    <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 transform md:-translate-x-1/2 z-0 h-full"></div>
                    
                    {/* Animated Progress Line */}
                    <motion.div
                        className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 via-amber-400 to-transparent transform md:-translate-x-1/2 z-1 origin-top shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                        style={{ scaleY }}
                    />

                    {/* Timeline Items */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
                        </div>
                    ) : achievements.length > 0 ? (
                        <div className="space-y-12 md:space-y-24 md:pl-0 pl-4 py-8">
                            {achievements.map((item, index) => (
                                <AchievementNode key={item._id || index} item={item} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-dashed border-slate-700 mx-4 md:mx-0">
                            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                            <p className="text-slate-500 text-lg">No achievements listed yet. Keep pushing forward!</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AchievementsPage;
