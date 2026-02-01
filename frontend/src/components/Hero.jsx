import { motion } from 'framer-motion';
import profileImg from '../assets/profile_placeholder.png'; // Make sure to generate this

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center md:text-left text-white"
                >
                    <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">Frontend Developer</h2>
                    <h1 className="mt-2 text-4xl leading-8 font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        Hello, I'm <span className="text-blue-500">Faiz</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto md:mx-0">
                        I build exceptional digital experiences. I'm a passionate developer focused on creating clean, user-friendly, and performant web applications using the MERN stack.
                    </p>

                    <div className="mt-8 flex justify-center md:justify-start gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
                        >
                            View Projects
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 font-bold py-3 px-8 rounded-full transition-all"
                        >
                            Contact Me
                        </motion.button>
                    </div>
                </motion.div>

                {/* Image Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex justify-center md:justify-end"
                >
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <img
                            src={profileImg}
                            alt="Faiz"
                            className="relative w-full h-full object-cover rounded-full border-4 border-slate-700 shadow-2xl"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
            >
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-white rounded-full"></div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
