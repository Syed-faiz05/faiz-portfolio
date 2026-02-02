import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Download } from 'lucide-react';

const ContactPage = () => {
    const socialLinks = {
        github: 'https://github.com/Syed-faiz05',
        linkedin: 'https://www.linkedin.com/in/syed-faiz-547a2a2a4/',
        email: 'syedfaiz052005@gmail.com'
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact</h1>
                    <p className="text-gray-400 text-lg mb-12">
                        I'm currently open to Full Stack and Junior Data Science roles (2026+). Let's build something meaningful!
                    </p>

                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 md:p-12">
                        {/* Email */}
                        <div className="mb-8">
                            <a
                                href={`mailto:${socialLinks.email}`}
                                className="inline-flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
                            >
                                <Mail size={24} />
                                {socialLinks.email}
                            </a>
                        </div>

                        {/* Social Icons */}
                        <div className="flex justify-center gap-4 mb-8">
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-700/50 hover:bg-slate-700 p-4 rounded-full transition-colors"
                            >
                                <Linkedin size={24} className="text-cyan-400" />
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href={socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-700/50 hover:bg-slate-700 p-4 rounded-full transition-colors"
                            >
                                <Github size={24} className="text-cyan-400" />
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href={`mailto:${socialLinks.email}`}
                                className="bg-slate-700/50 hover:bg-slate-700 p-4 rounded-full transition-colors"
                            >
                                <Mail size={24} className="text-cyan-400" />
                            </motion.a>
                        </div>

                        {/* Download Resume */}
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/resume.pdf"
                            download="Syed_Faiz_Resume.pdf"
                            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            <Download size={20} />
                            Download Resume
                        </motion.a>
                    </div>

                    <p className="text-gray-500 text-sm mt-8">Bengaluru, India</p>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
