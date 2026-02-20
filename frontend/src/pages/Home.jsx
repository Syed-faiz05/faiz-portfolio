import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code2, Terminal, Cpu, Globe, Award, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

// Components
import LeetCodeHeatmap from '../components/LeetCodeHeatmap';
import NetworkParticles from '../components/NetworkParticles';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import GithubIsometric from '../components/GithubIsometric';

// Image Import
const profileImg = new URL('../assets/profile.jpg', import.meta.url).href;

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

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
        fetchProfile();
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

    // Stats Data
    const stats = [
        { icon: <Terminal size={24} />, value: "3+", label: "Years Experience" },
        { icon: <Cpu size={24} />, value: "20+", label: "Projects Built" },
        { icon: <Globe size={24} />, value: "10+", label: "Clients Served" },
        { icon: <Award size={24} />, value: "500+", label: "LeetCode Solved" },
    ];

    // Testimonials Data (Static for now)
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Project Manager",
            text: "Faiz delivered the project way ahead of schedule. His understanding of React architecture is top-notch."
        },
        {
            name: "David Chen",
            role: "Tech Lead",
            text: "Impressive problem-solving skills. He tackled our backend scaling issues with an elegant Node.js solution."
        },
        {
            name: "Emily Davis",
            role: "UI/UX Designer",
            text: "A developer who actually cares about design details! working with Faiz was a breeze."
        }
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

            {/* Activity Section (LeetCode & GitHub) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-cyan-400">Coding Activity</h2>
                    <p className="mt-4 text-gray-300">My recent contributions and problem solving stats.</p>
                </motion.div>

                <div className="space-y-12">
                    {/* GitHub Graph */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <GithubIsometric username="Syed-faiz05" />
                    </motion.div>

                    {/* LeetCode Heatmap */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <LeetCodeHeatmap username="Syed_Faiz05" />
                    </motion.div>
                </div>
            </div>

            {/* Testimonials Section */}
            <section className="py-20 bg-slate-800/10 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-cyan-400">What People Say</h2>
                        <p className="mt-4 text-gray-300">Feedback from colleagues and clients.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 relative hover:bg-slate-800/50 transition-colors"
                            >
                                <Quote className="absolute top-4 right-4 text-slate-700 opacity-50" size={40} />
                                <p className="text-gray-300 mb-6 italic leading-relaxed">"{t.text}"</p>
                                <div>
                                    <h4 className="text-white font-bold">{t.name}</h4>
                                    <p className="text-cyan-400 text-sm">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
