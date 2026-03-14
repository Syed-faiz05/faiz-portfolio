import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Mail, MailOpen, Star, Clock, User, Reply, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

const Messages = () => {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`${API_URL}/api/messages/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success('Message deleted');
                fetchMessages();
            } else {
                toast.error('Error deleting message');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const toggleReadStatus = async (msg) => {
        try {
            const res = await fetch(`${API_URL}/api/messages/${msg._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ read: !msg.read })
            });

            if (res.ok) {
                fetchMessages();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const toggleStar = async (msg) => {
        try {
            const res = await fetch(`${API_URL}/api/messages/${msg._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ starred: !msg.starred })
            });

            if (res.ok) {
                fetchMessages();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredMessages = messages.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Mail className="text-cyan-400" />
                        Inbox
                    </h1>
                    <p className="text-slate-400 mt-1">Manage messages from your portfolio contact form</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search messages by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none w-full placeholder-slate-500"
                />
            </div>

            {/* Message List */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading messages...</div>
                ) : filteredMessages.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <MailOpen className="w-16 h-16 text-slate-600 mb-4" />
                        <h3 className="text-xl font-medium text-slate-300">Your inbox is empty</h3>
                        <p className="text-slate-500 mt-2">No messages match your search criteria.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700/50">
                        {filteredMessages.map((msg) => (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={msg._id} 
                                className={`p-4 md:p-6 transition-colors hover:bg-slate-700/30 flex flex-col md:flex-row gap-4 items-start ${!msg.read ? 'bg-slate-800/80 border-l-4 border-l-cyan-500' : 'bg-slate-900/20'}`}
                            >
                                {/* Left actions */}
                                <div className="flex items-center gap-3 md:pt-1">
                                    <button onClick={() => toggleStar(msg)} className="text-slate-400 hover:text-yellow-400 transition-colors">
                                        <Star size={20} className={msg.starred ? 'fill-yellow-400 text-yellow-400' : ''} />
                                    </button>
                                    <button onClick={() => toggleReadStatus(msg)} title="Toggle Read" className="text-slate-400 hover:text-cyan-400 transition-colors hidden md:block">
                                        {!msg.read ? <Mail className="text-cyan-400" size={20} /> : <MailOpen size={20} />}
                                    </button>
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 font-semibold text-slate-200">
                                            <User size={16} className="text-slate-500" />
                                            {msg.name} 
                                            <span className="text-slate-500 font-normal text-sm hidden sm:inline">&lt;{msg.email}&gt;</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                                            <Clock size={14} />
                                            {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                    
                                    <h4 className={`text-base mb-2 ${!msg.read ? 'text-white font-bold' : 'text-slate-300'}`}>
                                        {msg.subject}
                                    </h4>
                                    
                                    <p className="text-slate-400 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                                        {msg.message}
                                    </p>
                                    
                                    {/* Mobile bottom actions */}
                                    <div className="mt-4 flex items-center justify-between md:justify-start gap-4">
                                        <button onClick={() => toggleReadStatus(msg)} className="md:hidden flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400">
                                            {!msg.read ? <><Mail size={14}/> Mark Read</> : <><MailOpen size={14}/> Mark Unread</>}
                                        </button>
                                        
                                        <div className="flex items-center gap-3 md:mt-2">
                                            <a 
                                                href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                                            >
                                                <Reply size={14} /> Reply
                                            </a>
                                            <button 
                                                onClick={() => handleDelete(msg._id)}
                                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
