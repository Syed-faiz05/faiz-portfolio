import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300 py-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Faiz. All rights reserved.
                    </p>
                </div>

                <div className="flex space-x-6">
                    <a href="#" className="hover:text-blue-500 transition-colors">
                        <Github size={20} />
                    </a>
                    <a href="#" className="hover:text-blue-500 transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href="#" className="hover:text-blue-500 transition-colors">
                        <Mail size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
