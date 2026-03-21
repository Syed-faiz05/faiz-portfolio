import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Github, ExternalLink, Rocket, Search, X, Layers,
    Monitor, ChevronLeft, ChevronRight, Globe, Image as ImageIcon,
    AlertTriangle, RefreshCw
} from 'lucide-react';
import API_URL from '../config';

// ─────────────────────────────────────────────
// LIVE WEBSITE PREVIEW (iframe with fallback)
// ─────────────────────────────────────────────
const LivePreview = ({ url }) => {
    const [state, setState] = useState('loading'); // loading | loaded | error
    const iframeRef = useRef(null);

    const handleLoad = () => setState('loaded');
    const handleError = () => setState('error');

    useEffect(() => {
        setState('loading');
    }, [url]);

    if (!url) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600">
                <Globe size={48} className="mb-3 opacity-30" />
                <p className="text-sm opacity-50">No live URL provided</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
            {/* Browser chrome bar */}
            <div className="shrink-0 flex items-center gap-2 px-4 h-11 bg-slate-800 border-b border-slate-700 select-none">
                <div className="flex gap-1.5 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex-3 max-w-xl mx-auto bg-slate-900 rounded px-3 py-1 text-xs text-slate-400 truncate border border-slate-700 text-center w-full">
                    {url}
                </div>
                <a href={url} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 text-slate-400 hover:text-cyan-400 transition-colors ml-auto" title="Open in full tab">
                    <ExternalLink size={14} />
                </a>
            </div>

            {/* Loading overlay */}
            {state === 'loading' && (
                <div className="absolute inset-0 top-11 flex items-center justify-center bg-slate-950 z-20">
                    <div className="text-center">
                        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">Loading live preview…</p>
                    </div>
                </div>
            )}

            {/* Error / blocked fallback */}
            {state === 'error' && (
                <div className="absolute inset-0 top-11 flex flex-col items-center justify-center bg-slate-950 z-20 px-8 text-center">
                    <AlertTriangle size={40} className="text-amber-400 mb-3" />
                    <p className="text-white font-semibold mb-1">Preview Blocked</p>
                    <p className="text-slate-400 text-sm mb-4">
                        This site prevents embedding in iframes. Visit it directly.
                    </p>
                    <a href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold transition-colors">
                        <ExternalLink size={16} /> Open Live Site
                    </a>
                </div>
            )}

            <div className="flex-1 relative w-full h-full bg-white z-0">
                <iframe
                    ref={iframeRef}
                    src={url}
                    title="Live Preview"
                    className="absolute inset-0 w-full h-full border-0"
                    onLoad={handleLoad}
                    onError={handleError}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// IMAGE GALLERY CAROUSEL
// ─────────────────────────────────────────────
const ImageGallery = ({ images = [], title }) => {
    const [current, setCurrent] = useState(0);
    const allImages = images.filter(Boolean);

    if (allImages.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                <div className="text-center">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm opacity-50">No images uploaded</p>
                </div>
            </div>
        );
    }

    const prev = () => setCurrent(i => (i - 1 + allImages.length) % allImages.length);
    const next = () => setCurrent(i => (i + 1) % allImages.length);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden group/gallery">
            <AnimatePresence mode="wait">
                <motion.img
                    key={current}
                    src={allImages[current]}
                    alt={`${title} - image ${current + 1}`}
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                />
            </AnimatePresence>

            {allImages.length > 1 && (
                <>
                    <button onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10">
                        <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {allImages.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// PROJECT MODAL — full details with tabs
// ─────────────────────────────────────────────
const ProjectModal = ({ project, onClose }) => {
    const [tab, setTab] = useState('preview'); // preview | gallery | info
    const hasLiveLink = Boolean(project.liveLink);
    const allImages = [
        project.image, project.thumbnail,
        ...(project.images || [])
    ].filter(Boolean);
    // Deduplicate
    const imageSet = [...new Set(allImages)];

    // Default tab: if no live link, start on gallery/info
    useEffect(() => {
        setTab(hasLiveLink ? 'preview' : imageSet.length > 0 ? 'gallery' : 'info');
    }, [project._id]);

    const tabs = [
        hasLiveLink && { id: 'preview', label: 'Live Preview', icon: Monitor },
        imageSet.length > 0 && { id: 'gallery', label: `Gallery (${imageSet.length})`, icon: ImageIcon },
        { id: 'info', label: 'Details', icon: Layers },
    ].filter(Boolean);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 24 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    className="bg-[#0d1117] border border-slate-700/60 rounded-2xl w-[95vw] sm:w-[90vw] max-w-7xl h-[85vh] md:h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-black/80 relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* ── Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div>
                                <h2 className="text-lg font-bold text-white truncate">{project.title}</h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {getCategoryBadge(project)}
                                    <StatusBadge status={project.status} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                            {project.liveLink && (
                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors">
                                    <ExternalLink size={13} /> Visit
                                </a>
                            )}
                            {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                                    <Github size={13} /> Code
                                </a>
                            )}
                            <button onClick={onClose}
                                className="p-2 bg-slate-800/60 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* ── Tab Bar */}
                    <div className="flex gap-1 px-4 pt-3 pb-0 border-b border-slate-800/60 shrink-0 overflow-x-auto">
                        {tabs.map(t => (
                            <button key={t.id} onClick={() => setTab(t.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap border-b-2 -mb-px
                                    ${tab === t.id
                                        ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5'
                                        : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/40'}`}>
                                <t.icon size={14} />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Content Area */}
                    <div className="flex-1 relative overflow-hidden">
                        {tab === 'preview' && (
                            <div className="absolute inset-0 w-full h-full">
                                <LivePreview url={project.liveLink} />
                            </div>
                        )}
                        {tab === 'gallery' && (
                            <div className="absolute inset-0 w-full h-full bg-black">
                                <ImageGallery images={imageSet} title={project.title} />
                            </div>
                        )}
                        {tab === 'info' && (
                            <div className="absolute inset-0 w-full h-full overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-900/40">
                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">About The Project</h3>
                                    <p className="text-slate-200 leading-relaxed text-lg">{project.description}</p>
                                    {project.longDescription && (
                                        <p className="text-slate-300 leading-relaxed mt-4 text-base">{project.longDescription}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Technologies */}
                                    {project.technologies?.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Tech Stack</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.map((t, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-slate-800 text-cyan-300 text-sm font-medium rounded-lg border border-slate-700/50 shadow-sm">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags / Category */}
                                    {project.tags?.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Categories & Labels</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag, i) => (
                                                    <span key={i} className="px-3 py-1 font-medium rounded-full border border-purple-500/30 text-purple-300 bg-purple-500/10 shadow-sm">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Date */}
                                {project.createdAt && (
                                    <div className="pt-4 border-t border-slate-800">
                                        <p className="text-slate-500 text-sm">
                                            Added on {new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const CATEGORY_CONFIG = {
    'Web': { color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
    'Mobile': { color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
    'AI': { color: 'bg-purple-500/15 text-purple-300 border-purple-500/30', dot: 'bg-purple-400' },
    'ML': { color: 'bg-violet-500/15 text-violet-300 border-violet-500/30', dot: 'bg-violet-400' },
    'Backend': { color: 'bg-orange-500/15 text-orange-300 border-orange-500/30', dot: 'bg-orange-400' },
    'API': { color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', dot: 'bg-cyan-400' },
    'Design': { color: 'bg-pink-500/15 text-pink-300 border-pink-500/30', dot: 'bg-pink-400' },
    'Game': { color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', dot: 'bg-yellow-400' },
    'Tool': { color: 'bg-slate-500/15 text-slate-300 border-slate-500/30', dot: 'bg-slate-400' },
};
const DEFAULT_CAT = { color: 'bg-slate-600/20 text-slate-300 border-slate-600/30', dot: 'bg-slate-400' };

const getPrimaryCategory = (project) => {
    if (!project.tags || project.tags.length === 0) return null;
    for (const key of Object.keys(CATEGORY_CONFIG)) {
        if (project.tags.some(t => t.toLowerCase() === key.toLowerCase())) return key;
    }
    return project.tags[0];
};

const getCategoryBadge = (project) => {
    const cat = getPrimaryCategory(project);
    if (!cat) return null;
    const cfg = CATEGORY_CONFIG[cat] || DEFAULT_CAT;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cat}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    if (!status) return null;
    const map = {
        Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        Ongoing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        Published: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Draft: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
    };
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${map[status] || map.Draft}`}>
            {status}
        </span>
    );
};

const getOptimizedUrl = (url) => {
    if (!url) return '';
    if (url.includes('cloudinary.com')) {
        return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
    }
    return url;
};

const getProjectImage = (p) =>
    p.image || p.thumbnail || (p.images && p.images[0]) || null;

// ─────────────────────────────────────────────
// AUTO-PREVIEW CARD — image that scrolls to show live site hint
// ─────────────────────────────────────────────
const ProjectCard = ({ project, onOpen, index }) => {
    const img = getOptimizedUrl(getProjectImage(project));
    const cat = getPrimaryCategory(project);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            onClick={() => onOpen(project)}
            className="group relative bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-700/40 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 cursor-pointer flex flex-col"
        >
            {/* ── Image / Preview area */}
            <div className="relative h-48 overflow-hidden bg-slate-900 shrink-0">
                {img ? (
                    <img
                        src={img}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <Rocket size={36} className="opacity-30" />
                    </div>
                )}

                {/* Dark overlay + "Click to preview" badge on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-semibold flex items-center gap-2">
                        <Monitor size={16} className="text-cyan-400" />
                        {project.liveLink ? 'Open Live Preview' : 'View Details'}
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                    {cat && (() => {
                        const cfg = CATEGORY_CONFIG[cat] || DEFAULT_CAT;
                        return (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider backdrop-blur-sm ${cfg.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {cat}
                            </span>
                        );
                    })()}
                </div>
                <div className="absolute top-3 right-3">
                    <StatusBadge status={project.status} />
                </div>

                {/* Live indicator */}
                {project.liveLink && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] text-green-400 font-semibold">LIVE</span>
                    </div>
                )}
            </div>

            {/* ── Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {project.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-xs text-slate-500 bg-slate-800/70 px-2 py-0.5 rounded border border-slate-700/40">
                            {t}
                        </span>
                    ))}
                    {project.technologies?.length > 3 && (
                        <span className="text-xs text-slate-500 px-1">+{project.technologies.length - 3}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// FEATURED CARD (wider, more prominent)
// ─────────────────────────────────────────────
const FeaturedCard = ({ project, onOpen }) => {
    const img = getOptimizedUrl(getProjectImage(project));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => onOpen(project)}
            className="group relative bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
        >
            {/* Hero image */}
            <div className="relative h-72 overflow-hidden">
                {img ? (
                    <img src={img} alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-slate-900 flex items-center justify-center">
                        <Rocket size={64} className="text-slate-700 opacity-30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                {/* Featured badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-purple-600/90 text-white text-xs font-bold rounded-full backdrop-blur-sm shadow-lg">
                        ✦ Featured
                    </span>
                    {getPrimaryCategory(project) && (() => {
                        const cat = getPrimaryCategory(project);
                        const cfg = CATEGORY_CONFIG[cat] || DEFAULT_CAT;
                        return (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider backdrop-blur-sm ${cfg.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {cat}
                            </span>
                        );
                    })()}
                </div>

                {project.liveLink && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] text-green-400 font-semibold">LIVE</span>
                    </div>
                )}

                {/* Hover CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-2.5 text-white font-semibold flex items-center gap-2">
                        <Monitor size={18} className="text-purple-400" />
                        {project.liveLink ? 'Open Live Preview' : 'View Details'}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-7">
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                    {project.title}
                </h3>
                <p className="text-slate-400 line-clamp-2 mb-5">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 5).map((t, i) => (
                        <span key={i} className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/40">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            if (response.ok) {
                const data = await response.json();
                // Sort by order asc, then featured first, then date desc
                const sorted = [...data].sort((a, b) => {
                    if (a.order !== b.order) return a.order - b.order;
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setProjects(sorted);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    // Build category list from all project tags
    const categories = useMemo(() => {
        const catSet = new Set();
        projects.forEach(p => (p.tags || []).forEach(t => catSet.add(t)));
        return ['All', ...Array.from(catSet).sort()];
    }, [projects]);

    // Filter logic
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch =
                (project.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (project.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (project.technologies || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCat =
                selectedCategory === 'All' ||
                (project.tags || []).some(t => t.toLowerCase() === selectedCategory.toLowerCase());
            return matchesSearch && matchesCat;
        });
    }, [projects, searchQuery, selectedCategory]);

    const featuredProjects = filteredProjects.filter(p => p.featured);
    const otherProjects = filteredProjects.filter(p => !p.featured);

    const handleOpen = useCallback((project) => setSelectedProject(project), []);
    const handleClose = useCallback(() => setSelectedProject(null), []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Loading projects…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-white pt-24 pb-24 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="fixed top-20 left-0 w-[500px] h-[500px] bg-purple-700/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-20 right-0 w-[600px] h-[600px] bg-cyan-700/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ── Page Header */}
                <div className="text-center mb-14">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-cyan-500 text-sm font-semibold uppercase tracking-[0.2em] mb-3"
                    >
                        Portfolio
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
                    >
                        My{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                            Projects
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto"
                    >
                        A curated collection of my work — from live web apps to open-source tools.
                        Click any card to preview the site live.
                    </motion.p>
                </div>

                {/* ── Search + Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10 space-y-4"
                >
                    {/* Search */}
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, tech, or description…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700/50 text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600 text-sm"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(cat => {
                            const cfg = CATEGORY_CONFIG[cat] || { color: 'bg-slate-700 text-slate-300 border-slate-600' };
                            const isAll = cat === 'All';
                            const isActive = selectedCategory === cat;
                            return (
                                <button key={cat} onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                                        ${isActive
                                            ? isAll
                                                ? 'bg-white text-slate-900 border-white shadow-lg'
                                                : `${cfg.color} shadow-lg scale-105`
                                            : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white hover:bg-slate-800'
                                        }`}>
                                    {cat}
                                    {cat !== 'All' && (
                                        <span className="ml-1.5 text-xs opacity-60">
                                            {projects.filter(p => (p.tags || []).some(t => t.toLowerCase() === cat.toLowerCase())).length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ── Featured Projects */}
                {featuredProjects.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-purple-400 text-lg">✦</span>
                            <h2 className="text-xl font-bold text-white">Featured Projects</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {featuredProjects.map(p => (
                                <FeaturedCard key={p._id} project={p} onOpen={handleOpen} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── All Other Projects */}
                {otherProjects.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {selectedCategory !== 'All' ? `${selectedCategory} Projects` : 'All Projects'}
                            </h2>
                            <span className="text-sm text-slate-500">({otherProjects.length})</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-slate-700/50 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {otherProjects.map((p, i) => (
                                <ProjectCard key={p._id} project={p} onOpen={handleOpen} index={i} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-24 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700/50">
                        <Layers size={48} className="mx-auto mb-4 text-slate-600 opacity-50" />
                        <h3 className="text-lg font-semibold text-slate-400 mb-2">No projects found</h3>
                        <p className="text-slate-500 text-sm mb-5">Try adjusting your search or category filter.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="text-cyan-400 hover:underline text-sm font-medium">
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* ── Project Detail Modal */}
            {selectedProject && (
                <ProjectModal project={selectedProject} onClose={handleClose} />
            )}
        </div>
    );
};

export default ProjectsPage;
