import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
    const [skills, setSkills] = useState([]);

    // Default fallback (can be empty or current hardcoded list)
    const fallbackData = [
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 90 },
        { name: 'Node.js', level: 75 },
    ];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/skills');
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setSkills(data);
            } else {
                setSkills(fallbackData);
            }
        } catch (error) {
            console.error("Failed to fetch skills", error);
            setSkills(fallbackData);
        }
    };

    return (
        <section id="skills" className="py-20 bg-slate-800/30 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-cyan-400">Skills</h2>
                    <p className="mt-4 text-gray-300">Here are some of the technologies I work with.</p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-md text-center hover:border-cyan-500 transition-colors"
                        >
                            <h3 className="font-semibold text-lg">{skill.name}</h3>
                            {/* Render level as a bar or text */}
                            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="bg-cyan-400 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${skill.level || 50}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{skill.level || 0}% Proficiency</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
