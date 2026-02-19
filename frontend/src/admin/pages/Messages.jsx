import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Star, Trash2, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Messages = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to load messages');
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const toggleRead = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ read: !currentStatus })
            });
            if (!res.ok) throw new Error('Failed to update status');

            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, read: !msg.read } : msg
            ));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const toggleStar = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ starred: !currentStatus })
            });
            if (!res.ok) throw new Error('Failed to update star');

            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, starred: !msg.starred } : msg
            ));
        } catch (error) {
            toast.error('Failed to update star');
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to delete');

            setMessages(messages.filter(msg => msg._id !== id));
            toast.success('Message deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'unread') return !msg.read;
        if (filter === 'starred') return msg.starred;
        return true;
    });

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Messages</h2>
                    <p className="text-slate-400 mt-1">Check your inbox for new opportunities</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    {['all', 'unread', 'starred'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${filter === f ? 'bg-slate-700 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-700/50 flex items-center gap-3">
                    <Search className="h-5 w-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 w-full"
                    />
                </div>

                {/* Message List */}
                <div className="divide-y divide-slate-700/50">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`group flex items-start gap-4 p-5 hover:bg-slate-800/80 transition-colors cursor-pointer ${!msg.read ? 'bg-cyan-900/10' : ''}`}
                        >
                            {/* Actions */}
                            <div className="flex flex-col gap-2 mt-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleStar(msg._id, msg.starred); }}
                                    className={`text-slate-500 hover:text-yellow-400 transition-colors ${msg.starred ? 'text-yellow-400' : ''}`}
                                >
                                    <Star className="h-5 w-5 fill-current" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleRead(msg._id, msg.read); }}
                                    className={`text-slate-500 hover:text-cyan-400 transition-colors`}
                                    title={msg.read ? "Mark as unread" : "Mark as read"}
                                >
                                    <div className={`h-4 w-4 rounded-full border-2 border-slate-400 ${!msg.read ? 'bg-cyan-400 border-cyan-400' : ''}`}></div>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`text-base truncate ${!msg.read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                                            {msg.name}
                                        </h4>
                                        <span className="text-xs text-slate-500">&lt;{msg.email}&gt;</span>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-cyan-400/80 font-medium mb-1 truncate">{msg.subject}</p>
                                <p className="text-sm text-slate-400 line-clamp-2">{msg.message}</p>
                            </div>

                            {/* Delete Action (Hover) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-full transition-all"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {filteredMessages.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No messages found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
