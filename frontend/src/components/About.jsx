import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const About = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    const bio = profile?.bio || "I'm a passionate developer who loves building things for the web.";

    return (
        <section id="about" className="py-20 bg-slate-900/50 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-cyan-400">About Me</h2>
                    <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                        {profile?.title || "Full Stack Developer"}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-full h-80 bg-slate-800 rounded-lg shadow-xl flex items-center justify-center border border-slate-700 overflow-hidden">
                            {/* In a real app, perhaps another image or the same profile image */}
                            <div className="text-slate-500 flex flex-col items-center">
                                {/* Illustration or Image */}
                                <div className="w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl mb-4"></div>
                                <span>passionate about code</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-6 text-gray-300 leading-relaxed"
                    >
                        <p>
                            {bio}
                        </p>
                        <p>
                            I enjoy creating clean, scalable web applications and exploring new technologies.
                            My journey is driven by a curiosity to understand how things work and a desire to build solutions that make a difference.
                        </p>

                        {/* We could fetch skills here too, but they are on Skills page */}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
