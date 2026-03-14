import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code2, Terminal, Cpu, Globe, Award, Send, User, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

// Components
import NetworkParticles from '../components/NetworkParticles';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import GithubActivity from '../components/GithubActivity';
import LeetCodeActivity from '../components/LeetCodeActivity';

// Image Import
const profileImg = new URL('../assets/profile.jpg', import.meta.url).href;

// Activity Dashboard Settings
const ACTIVITY_CONFIG = {
    githubUsername: "Syed-faiz05",
    leetcodeUsername: "Syed_Faiz05"
};

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [leetcodeStats, setLeetcodeStats] = useState({ solved: "50+" });
    const [projectCount, setProjectCount] = useState(0);

    // Contact Form State
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'New Message from Portfolio Home', message: '' });
    const [submitStatus, setSubmitStatus] = useState({ loading: false, success: false, error: '' });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ loading: true, success: false, error: '' });

        try {
            const res = await fetch(`${API_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitStatus({ loading: false, success: true, error: '' });
                setFormData({ name: '', email: '', subject: 'New Message from Portfolio Home', message: '' });
                setTimeout(() => setSubmitStatus(prev => ({ ...prev, success: false })), 5000);
            } else {
                const data = await res.json();
                setSubmitStatus({ loading: false, success: false, error: data.message || 'Failed to send message.' });
            }
        } catch (error) {
            setSubmitStatus({ loading: false, success: false, error: 'Network error. Please try again later.' });
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/profile`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchLeetcodeStats = async () => {
            try {
                // Using the backend proxy to bypass CORS
                const res = await fetch(`${API_URL}/api/leetcode/${ACTIVITY_CONFIG.leetcodeUsername}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "success" && data.totalSolved) {
                        setLeetcodeStats({ solved: `${data.totalSolved}+` });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch LeetCode stats', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const res = await fetch(`${API_URL}/api/projects`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter for published projects only to match the Projects component
                    const publishedProjects = Array.isArray(data)
                        ? data.filter(p => !p.status || p.status === 'Published' || p.status === 'Completed' || p.status === 'Ongoing')
                        : [];
                    setProjectCount(publishedProjects.length);
                }
            } catch (error) {
                console.error("Failed to fetch projects count", error);
            }
        };

        fetchProfile();
        fetchLeetcodeStats();
        fetchProjects();
    }, []);

    const scrollToActivity = () => {
        document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fallback profile data
    const defaultProfile = {
        name: 'Syed Faiz',
        title: 'Full Stack Web Developer',
        bio: 'Full Stack Developer & Junior Data Scientist with a passion for building scalable web applications and data-driven solutions. Specialized in React, Node.js, and Python, I transform complex problems into intuitive, user-centric digital experiences.',
        socialLinks: {
            github: 'https://github.com/Syed-faiz05',
            linkedin: 'https://www.linkedin.com/in/syed-faiz-547a2a2a4/',
            leetcode: 'https://leetcode.com/u/Syed_Faiz05/',
            email: 'syedfaiz052005@gmail.com'
        }
    };

    const display = (profile && profile.name !== 'My Name') ? profile : defaultProfile;
    if (display.title === 'Full Stack Developer & Junior Data Scientist') {
        display.title = 'Full Stack Web Developer';
    }

    // Editable Stats Data - Update these values as your career progresses
    const statsConfig = {
        startYear: 2025, // Year you started coding
        // Set clientsServed to 0 or undefined to hide the card
        clientsServed: 0, 
    };

    // Calculate years experience dynamically based on startYear
    const calculateYearsExperience = () => {
        const currentYear = new Date().getFullYear();
        let years = currentYear - statsConfig.startYear;
        return years < 1 ? "1+" : `${years}+`;
    };

    // Stats Data Array for Rendering
    const stats = [
        { icon: <Terminal size={24} />, value: calculateYearsExperience(), label: "Years Experience" },
        { icon: <Cpu size={24} />, value: projectCount > 0 ? `${projectCount}+` : "15+", label: "Projects Built" },
        ...(statsConfig.clientsServed > 0 ? [{ icon: <Globe size={24} />, value: `${statsConfig.clientsServed}+`, label: "Clients Served" }] : []),
        { icon: <Award size={24} />, value: leetcodeStats.solved, label: "LeetCode Solved" },
    ];


    return (
        <div className="min-h-screen bg-slate-900 relative">
            {/* Network Particles Background */}
            <NetworkParticles />

            {/* Hero Section */}
            <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-6xl w-full">
                    <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-cyan-400">Loading Profile...</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                {/* Text Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-left text-white order-2 md:order-1"
                                >
                                    <p className="text-gray-400 text-sm md:text-base mb-2">Hi there, I'm</p>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                                        {(display.name || 'Syed Faiz').split(' ')[0]} <span className="text-cyan-400">{(display.name || 'Syed Faiz').split(' ').slice(1).join(' ')}</span>
                                    </h1>
                                    <p className="text-lg md:text-xl text-cyan-400 font-semibold mb-4">
                                        {display.title}
                                    </p>
                                    <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                                        {display.bio}
                                    </p>

                                    <div className="flex gap-4 mb-6">
                                        <Link to="/projects">
                                            <motion.button
                                                whileHover={{ scale: 1.05, borderColor: '#22d3ee' }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-cyan-500/10 backdrop-blur-sm border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
                                            >
                                                View Projects
                                            </motion.button>
                                        </Link>
                                        <motion.a
                                            href={display.resumeUrl || "/resume.pdf"}
                                            download="Syed_Faiz_Resume.pdf"
                                            whileHover={{ scale: 1.05, borderColor: '#a78bfa' }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-purple-600/10 backdrop-blur-sm border-2 border-purple-500/50 hover:border-purple-400 text-purple-400 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
                                        >
                                            Resume
                                        </motion.a>
                                    </div>

                                    {/* Social Icons */}
                                    <div className="flex gap-4">
                                        {display.socialLinks?.github && (
                                            <motion.a
                                                whileHover={{ scale: 1.2, color: '#22d3ee' }}
                                                href={display.socialLinks.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-cyan-400 transition-colors"
                                            >
                                                <Github size={28} />
                                            </motion.a>
                                        )}
                                        {display.socialLinks?.linkedin && (
                                            <motion.a
                                                whileHover={{ scale: 1.2, color: '#0077b5' }}
                                                href={display.socialLinks.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                            >
                                                <Linkedin size={28} />
                                            </motion.a>
                                        )}
                                        {display.socialLinks?.leetcode && (
                                            <motion.a
                                                whileHover={{ scale: 1.2, color: '#ffa116' }}
                                                href={display.socialLinks.leetcode}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-orange-400 transition-colors"
                                            >
                                                <Code2 size={28} />
                                            </motion.a>
                                        )}
                                        {display.socialLinks?.email && (
                                            <motion.a
                                                whileHover={{ scale: 1.2, color: '#22d3ee' }}
                                                href={`mailto:${display.socialLinks.email}`}
                                                className="text-gray-400 hover:text-cyan-400 transition-colors"
                                            >
                                                <Mail size={28} />
                                            </motion.a>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Image Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="flex justify-center order-1 md:order-2"
                                >
                                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                                        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                        {profileImg && (
                                            <img
                                                src={profileImg}
                                                alt={display.name}
                                                className="relative w-full h-full object-cover rounded-full border-4 border-cyan-500/30 shadow-2xl"
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modern Mouse Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="mt-12 cursor-pointer pb-8"
                    onClick={scrollToActivity}
                >
                    <div className="flex flex-col items-center group">
                        <span className="text-sm mb-3 text-gray-400 group-hover:text-cyan-400 transition-colors">Scroll to explore</span>
                        <div className="mouse-scroll">
                            <div className="mouse-scroll-wheel"></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Section */}
            <section id="stats-section" className="py-12 bg-slate-900 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-bold text-cyan-400">My Coding Journey in Numbers</h2>
                    </motion.div>
                    
                    <div className={`grid gap-8 ${stats.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center p-4 bg-slate-800/20 rounded-xl border border-slate-700/30 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="text-cyan-400 mb-2 p-3 bg-cyan-500/10 rounded-full">
                                    {stat.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Skills Section (Imported) */}
            <Skills />

            {/* Featured Projects (Imported with limit) */}
            <Projects limit={3} />

            {/* Developer Activity Dashboard Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">Developer Activity</h2>
                    <p className="text-slate-400">Live metrics and code contributions spanning across platforms.</p>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-8">
                    <div className="xl:w-3/5">
                        <GithubActivity username={ACTIVITY_CONFIG.githubUsername} />
                    </div>
                    <div className="xl:w-2/5">
                        <LeetCodeActivity username={ACTIVITY_CONFIG.leetcodeUsername} />
                    </div>
                </div>
            </div>

            {/* Quick Contact Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden group"
                >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

                    <div className="text-center mb-10 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Send Me a Message</h2>
                        <p className="text-slate-400">Have a project in mind, a question, or just want to say hi? I'd love to hear from you.</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Your Name"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                />
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="Your Email"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="relative group/input">
                            <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                                <MessageSquare size={18} />
                            </div>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="Your Message"
                                rows="4"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                            ></textarea>
                        </div>

                        {submitStatus.error && (
                            <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-500/20">
                                {submitStatus.error}
                            </div>
                        )}
                        {submitStatus.success && (
                            <div className="text-emerald-400 text-sm text-center bg-emerald-400/10 py-2 rounded-lg border border-emerald-500/20">
                                Message sent successfully! I'll get back to you soon.
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={submitStatus.loading}
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitStatus.loading ? (
                                <>Sending... <Loader2 className="animate-spin" size={20} /></>
                            ) : (
                                <>Send Message <Send size={20} /></>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
