import { motion } from 'framer-motion';

const skillsData = [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'React', level: 'Advanced' },
    { name: 'Node.js', level: 'Intermediate' },
    { name: 'Express', level: 'Intermediate' },
    { name: 'MongoDB', level: 'Intermediate' },
    { name: 'Tailwind CSS', level: 'Advanced' },
    { name: 'HTML5', level: 'Expert' },
    { name: 'CSS3', level: 'Expert' },
    { name: 'Git', level: 'Intermediate' },
    { name: 'Python', level: 'Beginner' },
];

const Skills = () => {
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
                    <h2 className="text-3xl font-bold text-blue-500">Skills</h2>
                    <p className="mt-4 text-gray-300">Here are some of the technologies I work with.</p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {skillsData.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-md text-center hover:border-blue-500 transition-colors"
                        >
                            <h3 className="font-semibold text-lg">{skill.name}</h3>
                            <p className="text-sm text-gray-400 mt-2">{skill.level}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
