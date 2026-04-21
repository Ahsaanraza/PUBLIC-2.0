import React, { useState, useEffect } from 'react';
import {
    Heart, MessageCircle, ThumbsUp, Send,
    Moon, Sun, Link, X, ArrowRight, ArrowLeft
} from 'lucide-react';

const Facebook = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);


// --- INITIAL MOCK JSON DATA (API READY) ---
const INITIAL_BLOG_DATA = {
    id: "blog-99281A",
    meta: {
        title: "The Future of Travel in 2026: AI, Experiences, and Beyond",
        author: "Ahsan Raza Butt",
        date: "15 Feb 2026",
        readTime: "5 min read",
        featuredImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
        tags: ["Travel Trends", "Technology", "Future"]
    },
    stats: {
        likes: 245,
        comments: 12
    },
    blocks: [
        { id: 'b1', type: 'h2', content: 'A New Era of Exploration', align: 'left' },
        { id: 'b2', type: 'p', content: 'Exploring new destinations has never been easier. With the rise of AI-driven itineraries, travelers can now experience hyper-personalized journeys tailored specifically to their mood, budget, and real-time global events.', align: 'left' },
        { id: 'b3', type: 'quote', content: 'Travel is the only thing you buy that makes you richer. In 2026, it also makes you smarter.', align: 'center' },
        { id: 'b4', type: 'image', content: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', align: 'center', width: '100%' },
        { id: 'b5', type: 'h2', content: 'Sustainable & Smart', align: 'left' },
        { id: 'b6', type: 'p', content: 'Eco-tourism has transitioned from a niche choice to a standard expectation. Flights are increasingly optimized for lower emissions, and accommodations are deeply integrated with local ecosystems.', align: 'left' },
        { id: 'b7', type: 'button', content: { text: 'Explore Smart Packages', url: '#' }, align: 'center', style: 'primary' },
        { id: 'b8', type: 'divider', content: '', align: 'center' },
        { id: 'b9', type: 'form', content: { title: 'Want more insights? Subscribe to our Newsletter.', buttonText: 'Subscribe Now' }, align: 'center' }
    ]
};

const MOCK_COMMENTS = [
    {
        id: 'c1', author: 'Sarah Connor', avatar: 'SC', time: '2 hours ago', text: 'This is absolutely spot on! I cannot wait to see how AI changes my upcoming trip to Japan.', likes: 14, replies: [
            { id: 'r1', author: 'Ahsan Raza Butt', avatar: 'AB', time: '1 hour ago', text: 'Thank you, Sarah! Japan is definitely leading the way in smart tourism integrations.', likes: 5 }
        ]
    },
    { id: 'c2', author: 'David Miller', avatar: 'DM', time: '5 hours ago', text: 'Are these smart packages currently available on Saer.pk?', likes: 2, replies: [] }
];

// --- EXTRACTED COMPONENTS ---

const BlockRenderer = ({ block, setCurrentView }) => {
    const getTextAlignClass = (align) => {
        if (align === 'center') return 'text-center mx-auto justify-center';
        if (align === 'right') return 'text-right ml-auto justify-end';
        return 'text-left mr-auto justify-start';
    };

    const alignClass = getTextAlignClass(block.align);

    switch (block.type) {
        case 'h1':
            return <h1 className={`text-4xl md:text-5xl font-heading font-black text-[#0B1A28] dark:text-white mb-6 leading-tight ${alignClass}`}>{block.content}</h1>;
        case 'h2':
            return <h2 className={`text-2xl md:text-3xl font-heading font-extrabold text-[#0B1A28] dark:text-white mt-8 mb-4 leading-snug ${alignClass}`}>{block.content}</h2>;
        case 'p':
            return <p className={`text-[16px] md:text-[18px] text-slate-700 dark:text-slate-300 font-body leading-relaxed mb-6 ${alignClass}`}>{block.content}</p>;
        case 'quote':
            return (
                <blockquote className={`border-l-4 border-[#1a4484] pl-6 py-2 my-8 italic text-xl text-slate-600 dark:text-slate-400 font-brand-pk ${alignClass}`}>
                    "{block.content}"
                </blockquote>
            );
        case 'image':
            return (
                <div className={`my-8 flex ${alignClass}`}>
                    <img src={block.content} alt="Blog Asset" className="rounded-[2rem] shadow-lg object-cover" style={{ width: block.width || '100%', maxHeight: '600px' }} />
                </div>
            );
        case 'button':
            return (
                <div className={`my-8 flex ${alignClass}`}>
                    <button 
                        onClick={() => setCurrentView ? setCurrentView('booking') : alert('Booking Flow')}
                        className="bg-[#1a4484] hover:bg-blue-800 text-white px-8 py-3.5 rounded-full font-bold text-[13px] uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(26,68,132,0.4)] transition-all active:scale-95 inline-flex items-center gap-2"
                    >
                        {block.content.text} <ArrowRight size={16} />
                    </button>
                </div>
            );
        case 'divider':
            return <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 my-12 rounded-full mx-auto"></div>;
        case 'form':
            return (
                <div className={`w-full max-w-xl bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 my-10 shadow-xl ${alignClass}`}>
                    <h3 className="text-xl font-heading font-bold text-[#0B1A28] dark:text-white mb-6 text-center">{block.content.title}</h3>
                    <div className="space-y-4">
                        <input type="text" placeholder="Full Name" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#1a4484] rounded-lg py-3 px-4 text-[14px] font-semibold text-[#0B1A28] dark:text-white outline-none transition-all" />
                        <input type="email" placeholder="Email Address" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#1a4484] rounded-lg py-3 px-4 text-[14px] font-semibold text-[#0B1A28] dark:text-white outline-none transition-all" />
                        <button className="w-full bg-[#0B1A28] dark:bg-white dark:text-[#0B1A28] text-white px-6 py-3.5 rounded-lg font-bold text-[13px] uppercase tracking-widest shadow-lg transition-all active:scale-95">
                            {block.content.buttonText}
                        </button>
                    </div>
                </div>
            );
        default:
            return null;
    }
};

// --- MAIN APPLICATION ---

export default function BlogView({ onBack, setCurrentView }) {
    const [theme, setTheme] = useState('light'); // 'light' | 'dark'

    const [blogData] = useState(INITIAL_BLOG_DATA);
    const [comments] = useState(MOCK_COMMENTS);

    const [hasLiked, setHasLiked] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [activeReaction, setActiveReaction] = useState(null);

    // Toggle Theme
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className={`min-h-screen font-body transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0B1A28]' : 'bg-[#f0f2f5]'}`}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@900&family=Inter:wght@400;500;600;700&family=Montserrat:wght@800;900&family=Roboto+Slab:wght@800&display=swap');
        .font-body { font-family: 'Inter', sans-serif; }
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-brand-saer { font-family: 'Eczar', serif; letter-spacing: -0.06em; }
        .font-brand-pk { font-family: 'Roboto Slab', serif; letter-spacing: -0.02em; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            {/* --- TOP NAVIGATION --- */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B1A28]/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center transition-colors">
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#0B1A28] dark:text-white hover:text-[#1a4484] dark:hover:text-blue-400 transition-colors font-bold text-[12px] sm:text-[13px] uppercase tracking-widest active:scale-95"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Back to Blogs</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 sm:p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        {theme === 'light' ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
                    </button>
                </div>
            </div>

            <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-8 md:py-16">

                {/* --- META DATA (Header) --- */}
                <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
                        {blogData.meta.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-blue-50 dark:bg-slate-800 text-[#1a4484] dark:text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-widest border border-blue-100 dark:border-slate-700">{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#0B1A28] dark:text-white tracking-tight leading-[1.1] mb-6">
                        {blogData.meta.title}
                    </h1>
                    <div className="flex items-center gap-4 text-[14px] text-slate-500 dark:text-slate-400 font-medium mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B1A28] to-[#1a4484] flex items-center justify-center text-white font-bold text-xs">
                                {blogData.meta.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-[#0B1A28] dark:text-white font-semibold">{blogData.meta.author}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <span>{blogData.meta.date}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <span>{blogData.meta.readTime}</span>
                    </div>

                    {blogData.meta.featuredImage && (
                        <img src={blogData.meta.featuredImage} alt="Featured" className="w-full h-[300px] md:h-[450px] object-cover rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800" />
                    )}
                </header>

                {/* --- BLOCKS CONTENT --- */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                    {blogData.blocks.map((block) => (
                        <BlockRenderer key={block.id} block={block} setCurrentView={setCurrentView} />
                    ))}
                </div>

                {/* --- PUBLIC INTERACTIONS --- */}
                <div className="mt-16 animate-in fade-in duration-700 delay-300">
                    {/* Engagement Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 border-t border-b border-slate-200 dark:border-slate-800 my-10">
                        <div className="flex items-center gap-4 relative">
                            {/* Like Button & Reactions Popup */}
                            <div
                                className="relative flex items-center"
                                onMouseEnter={() => setShowReactions(true)}
                                onMouseLeave={() => setShowReactions(false)}
                            >
                                <button
                                    onClick={() => { setHasLiked(!hasLiked); setActiveReaction(hasLiked ? null : '❤️'); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[13px] transition-all ${hasLiked ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    <Heart size={18} className={hasLiked ? 'fill-current' : ''} />
                                    {activeReaction ? activeReaction : 'Like'} ({blogData.stats.likes + (hasLiked ? 1 : 0)})
                                </button>

                                {/* Reaction Popup */}
                                {showReactions && (
                                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-full p-2 flex gap-1 animate-in zoom-in-95 duration-200">
                                        {['👍', '❤️', '👏', '💡'].map(emoji => (
                                            <button key={emoji} onClick={() => { setActiveReaction(emoji); setHasLiked(true); setShowReactions(false); }} className="text-xl hover:scale-125 transition-transform p-1">
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[13px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <MessageCircle size={18} /> Comment ({comments.length})
                            </button>
                        </div>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mr-2">Share</span>
                            <button onClick={() => alert('Copied to clipboard!')} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-[#1a4484] hover:text-white dark:hover:bg-blue-600 transition-colors border border-slate-200 dark:border-slate-700"><Link size={16} /></button>
                            <button onClick={() => alert('Share to Twitter')} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-[#1da1f2] hover:text-white dark:hover:bg-[#1da1f2] transition-colors border border-slate-200 dark:border-slate-700"><X size={16} /></button>
                            <button onClick={() => alert('Share to Facebook')} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-[#4267B2] hover:text-white dark:hover:bg-[#4267B2] transition-colors border border-slate-200 dark:border-slate-700"><Facebook size={16} /></button>
                        </div>
                    </div>

                    {/* Comment Section */}
                    <div>
                        <h3 className="text-2xl font-heading font-extrabold text-[#0B1A28] dark:text-white mb-6">Discussion</h3>

                        {/* Add Comment Input */}
                        <div className="flex gap-4 mb-10 bg-white dark:bg-slate-800 p-2 pl-4 pr-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-[#1a4484]/20 focus-within:border-[#1a4484] transition-all">
                            <input type="text" placeholder="Add to the discussion..." className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#0B1A28] dark:text-white font-medium" />
                            <button className="bg-[#1a4484] text-white p-3 rounded-full hover:bg-blue-800 transition-colors shadow-md active:scale-95"><Send size={18} strokeWidth={2.5} /></button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-8">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[#0B1A28] dark:text-white text-[13px] shrink-0">
                                        {comment.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-[#0B1A28] dark:text-white text-[14px]">{comment.author}</span>
                                                <span className="text-[11px] font-semibold text-slate-400">{comment.time}</span>
                                            </div>
                                            <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed mb-3">{comment.text}</p>
                                            <div className="flex gap-4 text-[12px] font-bold text-slate-500">
                                                <button className="hover:text-[#1a4484] dark:hover:text-blue-400 transition-colors flex items-center gap-1"><ThumbsUp size={14} /> {comment.likes}</button>
                                                <button className="hover:text-[#1a4484] dark:hover:text-blue-400 transition-colors">Reply</button>
                                            </div>
                                        </div>

                                        {/* Nested Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="mt-4 space-y-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800">
                                                {comment.replies.map(reply => (
                                                    <div key={reply.id} className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#0B1A28] flex items-center justify-center font-bold text-white text-[11px] shrink-0">
                                                            {reply.avatar}
                                                        </div>
                                                        <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                            <div className="flex items-baseline gap-2 mb-1">
                                                                <span className="font-bold text-[#0B1A28] dark:text-white text-[13px]">{reply.author}</span>
                                                                <span className="text-[10px] font-semibold text-slate-400">{reply.time}</span>
                                                            </div>
                                                            <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">{reply.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}