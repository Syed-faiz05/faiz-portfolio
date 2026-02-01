import { motion } from 'framer-motion';

const About = () => {
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
                    <h2 className="text-3xl font-bold text-blue-500">About Me</h2>
                    <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                        I'm a passionate developer who loves building things for the web.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-full h-80 bg-slate-800 rounded-lg shadow-xl flex items-center justify-center border border-slate-700">
                            <span className="text-slate-500">About Image Placeholder</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-6 text-gray-300"
                    >
                        <p>
                            Hello! I'm Faiz, a software developer based in [Your Location]. I enjoy creating things that live on the internet. My interest in web development started back in [Year] when I decided to try editing custom Tumblr themes — turns out hacking together HTML & CSS is pretty fun!
                        </p>
                        <p>
                            Fast-forward to today, and I've had the privilege of working at an advertising agency, a start-up, a huge corporation, and a student-led design studio. My main focus these days is building accessible, inclusive products and digital experiences at Upstatement for a variety of clients.
                        </p>
                        <p>
                            Here are a few technologies I've been working with recently:
                        </p>
                        <ul className="grid grid-cols-2 gap-2 list-disc list-inside text-blue-400">
                            <li>JavaScript (ES6+)</li>
                            <li>React</li>
                            <li>Node.js</li>
                            <li>TypeScript</li>
                            <li>Express</li>
                            <li>MongoDB</li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
