import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Grid, List as ListIcon, Heart, MessageCircle, Clock,
  Calendar, ArrowRight, TrendingUp, Compass, Moon, Sun,
  ChevronDown, ArrowUpRight, ArrowLeft, Check
} from 'lucide-react';

// --- MOCK API DATA ---
const MOCK_BLOGS = [
  {
    id: "b1",
    title: "10 Essential Tips for Your First Umrah Journey",
    slug: "10-essential-tips-first-umrah",
    description: "Preparing for your first Umrah can be overwhelming. Discover the top 10 spiritual and practical tips to ensure a smooth and blessed journey.",
    content: "...",
    featured_image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    author: "Ahsan Raza Butt",
    publish_date: "15 Feb 2026",
    read_time: "6 min read",
    likes_count: 342,
    comments_count: 45,
    category: "Umrah"
  },
  {
    id: "b2",
    title: "How AI is Revolutionizing Travel Itineraries in 2026",
    slug: "ai-revolutionizing-travel-itineraries",
    description: "From hyper-personalized daily schedules to real-time flight adjustments, see how Artificial Intelligence is taking the stress out of travel planning.",
    content: "...",
    featured_image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
    author: "Sarah Connor",
    publish_date: "12 Feb 2026",
    read_time: "4 min read",
    likes_count: 215,
    comments_count: 18,
    category: "Technology"
  },
  {
    id: "b3",
    title: "Ultimate Guide to the Saudi Tourist eVisa",
    slug: "ultimate-guide-saudi-tourist-evisa",
    description: "Everything you need to know about applying for the Saudi tourist eVisa, processing times, requirements, and multiple-entry rules.",
    content: "...",
    featured_image: "https://images.unsplash.com/photo-1551041777-ed277b8dd348?q=80&w=1974&auto=format&fit=crop",
    author: "Tariq Ali",
    publish_date: "10 Feb 2026",
    read_time: "5 min read",
    likes_count: 512,
    comments_count: 89,
    category: "Visa"
  },
  {
    id: "b4",
    title: "Hidden Gems of Turkey: Beyond Tokyo",
    slug: "hidden-gems-turkey",
    description: "Escape the crowded tourist hotspots and explore the serene, untouched landscapes of rural Turkey that offer a glimpse into the past.",
    content: "...",
    featured_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop",
    author: "Ahsan Raza Butt",
    publish_date: "05 Feb 2026",
    read_time: "8 min read",
    likes_count: 189,
    comments_count: 24,
    category: "Travel"
  },
  {
    id: "b5",
    title: "Packing Smart: The Minimalist Traveler's Checklist",
    slug: "packing-smart-minimalist",
    description: "Learn how to pack for a two-week international trip using only a carry-on backpack. Save money on baggage fees and travel light.",
    content: "...",
    featured_image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1964&auto=format&fit=crop",
    author: "Zain Abbas",
    publish_date: "01 Feb 2026",
    read_time: "3 min read",
    likes_count: 275,
    comments_count: 31,
    category: "Tips"
  }
];

const CATEGORIES = ["All", "Travel", "Umrah", "Visa", "Tips", "Technology"];
const SORT_OPTIONS = ["Latest", "Most Popular", "Most Liked"];

// --- MAIN COMPONENT ---
export default function BlogsPage({ setCurrentView, onBack }) {
  const [theme, setTheme] = useState('light');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(4);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Toggle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle outside click for custom dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLike = (id, e) => {
    e.stopPropagation();
    const newLiked = new Set(likedPosts);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedPosts(newLiked);
  };

  // Filter & Sort Logic
  let filteredBlogs = MOCK_BLOGS.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'Most Liked') {
    filteredBlogs.sort((a, b) => b.likes_count - a.likes_count);
  } else if (sortBy === 'Most Popular') {
    filteredBlogs.sort((a, b) => b.comments_count - a.comments_count);
  }

  const displayedBlogs = filteredBlogs.slice(0, visibleCount);

  // --- SUB-COMPONENTS ---

  const TopNav = () => (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B1A28]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex justify-between items-center transition-colors">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#0B1A28] dark:text-white hover:text-[#1a4484] dark:hover:text-blue-400 transition-colors font-bold text-[12px] sm:text-[13px] uppercase tracking-widest active:scale-95"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span className="hidden sm:inline">Go Back Home</span>
          <span className="sm:hidden">Home</span>
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="w-10 h-10 sm:w-auto sm:h-auto flex items-center justify-center p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95 relative z-50"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
        </button>
        <button 
          onClick={() => setCurrentView('booking')}
          className="hidden sm:flex items-center gap-2 bg-[#1a4484] hover:bg-blue-800 text-white px-6 py-2.5 rounded-full font-bold text-[12px] uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(26,68,132,0.4)] transition-all active:scale-95"
        >
          Book Now
        </button>
      </div>
    </div>
  );

  const BlogCard = ({ blog }) => {
    const isLiked = likedPosts.has(blog.id);
    const isGrid = viewMode === 'grid';

    return (
      <article
        key={blog.id}
        className={`group cursor-pointer bg-white dark:bg-slate-800/50 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(26,68,132,0.2)] dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-1 flex ${isGrid ? 'flex-col' : 'flex-row items-stretch'}`}
        onClick={() => {
          if (setCurrentView) {
            setCurrentView('blogview');
            window.scrollTo(0, 0);
          }
        }}
      >
        <div className={`relative overflow-hidden shrink-0 ${isGrid ? 'w-full h-52 sm:h-60' : 'w-[120px] sm:w-2/5 min-h-[130px] sm:min-h-[250px]'}`}>
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className={`absolute top-2 left-2 sm:top-4 sm:left-4 ${!isGrid && 'hidden sm:block'}`}>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/90 dark:bg-[#0B1A28]/90 backdrop-blur-md text-[#1a4484] dark:text-blue-400 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
              {blog.category}
            </span>
          </div>
          <button
            onClick={(e) => toggleLike(blog.id, e)}
            className={`absolute z-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#0B1A28]/90 backdrop-blur-md shadow-sm hover:scale-110 transition-transform ${isGrid ? 'top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10' : 'bottom-2 left-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10'}`}
          >
            <Heart size={isGrid ? 18 : 14} className={`sm:w-5 sm:h-5 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-slate-300'}`} strokeWidth={isLiked ? 0 : 2} />
          </button>
        </div>

        <div className={`flex flex-col flex-1 min-w-0 ${isGrid ? 'p-4 sm:p-6 md:p-8' : 'p-3 sm:p-6 md:p-8 justify-center'}`}>
          <div className={`flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-3 flex-wrap ${!isGrid && 'hidden sm:flex'}`}>
            <span className="flex items-center gap-1 sm:gap-1.5"><Calendar size={14} className="text-[#1a4484] dark:text-blue-400" /> {blog.publish_date}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block"></span>
            <span className="flex items-center gap-1 sm:gap-1.5"><Clock size={14} className="text-[#1a4484] dark:text-blue-400" /> {blog.read_time}</span>
          </div>

          <h2 className={`${isGrid ? 'text-[16px] sm:text-xl' : 'text-[14px] sm:text-xl'} md:text-2xl font-heading font-black text-[#0B1A28] dark:text-white leading-tight sm:leading-tight mb-1 sm:mb-3 group-hover:text-[#1a4484] dark:group-hover:text-blue-400 transition-colors line-clamp-2`}>
            {blog.title}
          </h2>

          <p className={`text-[12px] sm:text-[14px] md:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2 sm:mb-6 line-clamp-2 md:line-clamp-3 font-body ${!isGrid && 'line-clamp-2 sm:line-clamp-3'}`}>
            {blog.description}
          </p>

          <div className="mt-auto pt-2 sm:pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div className={`flex items-center gap-2 sm:gap-2.5 ${!isGrid && 'hidden sm:flex'}`}>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#0B1A28] to-[#1a4484] flex items-center justify-center text-white font-bold text-[9px] sm:text-[10px]">
                {blog.author.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-[11px] sm:text-[13px] font-bold text-[#0B1A28] dark:text-white truncate max-w-[100px] sm:max-w-none">{blog.author}</span>
            </div>

            <div className={`flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[12px] font-bold text-slate-400 dark:text-slate-500 ${!isGrid && 'w-full sm:w-auto justify-between sm:justify-end'}`}>
              {!isGrid && (
                <span className="sm:hidden text-[9px] text-[#1a4484] dark:text-blue-400 uppercase tracking-widest">{blog.category}</span>
              )}
              <div className="flex gap-3">
                <span className="flex items-center gap-1 sm:gap-1.5"><Heart size={14} /> {blog.likes_count + (isLiked ? 1 : 0)}</span>
                <span className="flex items-center gap-1 sm:gap-1.5"><MessageCircle size={14} /> {blog.comments_count}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const Sidebar = () => (
    <aside className="space-y-6 sm:space-y-8">
      {/* Search Widget */}
      <div className="bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-xl">
        <h3 className="text-[13px] sm:text-[14px] font-heading font-bold text-[#0B1A28] dark:text-white uppercase tracking-widest mb-4">Search</h3>
        <div className="relative w-full overflow-hidden rounded-xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} strokeWidth={2} /></div>
          {/* text-[16px] is used here explicitly to prevent iOS auto-zoom */}
          <input
            type="text"
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full box-border bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#1a4484] focus:ring-2 focus:ring-[#1a4484]/20 py-3.5 pl-11 pr-4 text-[16px] sm:text-[13px] font-semibold text-[#0B1A28] dark:text-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Categories Widget */}
      <div className="bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-xl">
        <h3 className="text-[13px] sm:text-[14px] font-heading font-bold text-[#0B1A28] dark:text-white uppercase tracking-widest mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all active:scale-95 border ${
                activeCategory === cat
                  ? 'bg-[#1a4484] text-white border-[#1a4484] shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#1a4484] dark:hover:border-blue-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Posts Widget */}
      <div className="bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={18} className="text-[#f97316]" />
          <h3 className="text-[13px] sm:text-[14px] font-heading font-bold text-[#0B1A28] dark:text-white uppercase tracking-widest">Popular Now</h3>
        </div>
        <div className="space-y-5">
          {[MOCK_BLOGS[2], MOCK_BLOGS[0], MOCK_BLOGS[1]].map((blog, idx) => (
            <div key={blog.id} className="flex gap-4 group cursor-pointer" onClick={() => {
              setCurrentView('blogview');
              window.scrollTo(0, 0);
            }}>
              <span className="text-2xl font-brand-saer text-slate-200 dark:text-slate-700 group-hover:text-[#1a4484] dark:group-hover:text-blue-500 transition-colors shrink-0">0{idx + 1}</span>
              <div>
                <h4 className="text-[13px] sm:text-[14px] font-bold text-[#0B1A28] dark:text-white group-hover:text-[#1a4484] dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-1">
                  {blog.title}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{blog.read_time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen font-body bg-[#f0f2f5] dark:bg-[#0B1A28] text-[#0B1A28] dark:text-white transition-colors duration-300 w-full overflow-x-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@900&family=Inter:wght@400;500;600;700&family=Montserrat:wght@800;900&family=Roboto+Slab:wght@800&display=swap');
          .font-body { font-family: 'Inter', sans-serif; }
          .font-heading { font-family: 'Montserrat', sans-serif; }
          .font-brand-saer { font-family: 'Eczar', serif; letter-spacing: -0.06em; }
          .font-brand-pk { font-family: 'Roboto Slab', serif; letter-spacing: -0.02em; }
          
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {TopNav()}

        {/* --- HERO SECTION --- */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-10 sm:-mr-20 -mt-10 sm:-mt-20 pointer-events-none"></div>

            <div className="max-w-3xl relative z-10">
              <span className="inline-block px-3 py-1.5 bg-[#1a4484]/10 dark:bg-blue-900/30 text-[#1a4484] dark:text-blue-400 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-4 sm:mb-6">Discover & Learn</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-black text-[#0B1A28] dark:text-white tracking-tight leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6">
                Insights for the modern traveler.
              </h1>
              <p className="text-[14px] sm:text-[16px] md:text-[18px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                Stay updated with the latest travel trends, visa requirements, and comprehensive guides for your spiritual journeys.
              </p>
            </div>
          </div>
        </div>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-16">

          {/* --- FILTERS & CONTROLS --- */}
          <div className="flex flex-row justify-between items-center gap-3 sm:gap-4 mb-8 sm:mb-10 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800 w-full">
            <div className="relative flex-1 sm:flex-none sm:min-w-[180px]" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-[14px] sm:text-[13px] font-bold text-[#0B1A28] dark:text-white outline-none focus:border-[#1a4484] transition-colors shadow-sm"
              >
                <span>{sortBy}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-[#1a4484]' : ''}`} />
              </button>

              {/* Custom Dropdown Menu for Sort */}
              {isSortOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                      className={`w-full text-left flex items-center gap-2 px-4 py-3 text-[14px] sm:text-[13px] font-bold transition-colors text-[#0B1A28] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50`}
                    >
                      {sortBy === opt ? <Check size={16} className="text-[#0B1A28] dark:text-white" /> : <div className="w-4" />}
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex-1 sm:flex-none max-w-[120px] sm:max-w-none">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:w-11 sm:h-11 py-2 sm:py-0 rounded-lg transition-all flex justify-center items-center ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#0B1A28] dark:text-white' : 'text-slate-400 hover:text-[#0B1A28] dark:hover:text-white'}`}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:w-11 sm:h-11 py-2 sm:py-0 rounded-lg transition-all flex justify-center items-center ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#0B1A28] dark:text-white' : 'text-slate-400 hover:text-[#0B1A28] dark:hover:text-white'}`}
                title="List View"
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>

          {/* --- TWO COLUMN LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">

            {/* Main Content Area */}
            <div className="lg:col-span-8 xl:col-span-9 w-full min-w-0">

              {displayedBlogs.length > 0 ? (
                <>
                  <div className={`grid gap-6 md:gap-8 w-full ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {displayedBlogs.map(blog => (
                      BlogCard({ blog })
                    ))}
                  </div>

                  {/* Load More Pagination */}
                  {visibleCount < filteredBlogs.length && (
                    <div className="mt-10 sm:mt-12 flex justify-center w-full">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 4)}
                        className="w-full sm:w-auto justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#1a4484] dark:hover:border-blue-500 text-[#0B1A28] dark:text-white px-8 py-3.5 rounded-full font-bold text-[12px] sm:text-[13px] uppercase tracking-widest shadow-sm transition-all active:scale-95 flex items-center gap-2"
                      >
                        Load More Blogs <ChevronDown size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm w-full">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-5 sm:mb-6 mx-auto">
                    <Search size={28} className="text-slate-400 sm:w-8 sm:h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-[#0B1A28] dark:text-white mb-2 sm:mb-3 tracking-tight">No blogs found</h3>
                  <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 max-w-sm mx-auto leading-relaxed">
                    We couldn't find any articles matching your search or category filter.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="w-full sm:w-auto justify-center bg-[#1a4484] hover:bg-blue-800 text-white px-8 py-3.5 rounded-full text-[11px] sm:text-[12px] font-extrabold uppercase tracking-widest shadow-md transition-all active:scale-95"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            </div>

            {/* Sidebar Area */}
            <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 w-full">
              {Sidebar()}
            </div>

          </div>

          {/* Mobile Sidebar Alternative */}
          <div className="mt-12 sm:mt-16 lg:hidden w-full">
            {Sidebar()}
          </div>

        </main>
      </div>
    </div>
  );
}