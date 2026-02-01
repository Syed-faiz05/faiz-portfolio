import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

const Footer = () => {
    const socialLinks = {
        github: 'https://github.com/Syed-faiz05',
        linkedin: 'https://www.linkedin.com/in/syed-faiz-547a2a2a4/',
        leetcode: 'https://leetcode.com/u/Syed_Faiz05/',
        email: 'syedfaiz05@example.com'
    };

    return (
        <footer className="bg-slate-900 text-gray-300 py-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Syed Faiz. All rights reserved.
                    </p>
                </div>

                <div className="flex space-x-6">
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                        <Github size={20} />
                    </a>
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href={socialLinks.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                        <Code2 size={20} />
                    </a>
                    <a href={`mailto:${socialLinks.email}`} className="hover:text-cyan-400 transition-colors">
                        <Mail size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
