import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Compass, MessageCircle, Star, 
  CheckCircle2, RefreshCw, ArrowLeft, ChevronRight 
} from 'lucide-react';
import { reviewVideos } from '../data/constants';

export const ReviewsView = ({ onBack }) => {
  const [activeReviewFilter, setActiveReviewFilter] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filters = ['All', 'Family', 'Couples', 'Ramadan', 'Luxury', 'Group'];
  const filteredVideos = activeReviewFilter === 'All' 
    ? reviewVideos 
    : reviewVideos.filter(v => v.category === activeReviewFilter);

  return (
    <div className="bg-[#030A14] min-h-screen pb-20 animate-in fade-in duration-300 relative overflow-x-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* --- Advanced Cinematic Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[80px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[60px]"></div>
      </div>
      
      {/* --- Premium Header --- */}
      <div className="bg-[#030A14]/80 backdrop-blur-md text-white py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold mb-1 transition-all duration-300 group cursor-pointer">
              <div className="bg-white/5 p-1.5 rounded-full border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Back to Home
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-white/[0.03] px-5 py-2 rounded-full border border-white/[0.08] shadow-inner backdrop-blur-md">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              ))}
            </div>
            <span className="text-slate-300 text-sm font-semibold tracking-wide">4.9/5 from 10k+ Pilgrims</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 relative z-10">
        
        {/* --- Hero Title Section --- */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold tracking-widest text-[11px] md:text-xs uppercase px-4 py-2 rounded-full mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real Stories, Real Faith
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight mb-6 pb-2">
            The Wall of Love
          </h1>
          <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Listen to the heartfelt experiences of our community. Witness how <span className="text-white font-semibold">Saer.pk</span> transforms profound spiritual aspirations into seamless realities.
          </p>
        </div>

        {/* --- Interactive Pro Category Filters --- */}
        <div className="relative w-full mb-10">
          <div className="flex overflow-x-auto gap-2.5 md:gap-3 pb-6 px-4 justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x">
            {filters.map(filter => {
              const isActive = activeReviewFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveReviewFilter(filter)}
                  className={`relative shrink-0 snap-center px-5 md:px-6 py-2.5 md:py-3 rounded-full text-[13px] md:text-sm font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/50 scale-105'
                      : 'bg-white/[0.03] text-slate-400 border border-white/[0.05] hover:bg-white/[0.08] hover:text-white hover:border-white/20'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 z-0"></div>
                  )}
                  <span className="relative z-10">{filter}</span>
                </button>
              );
            })}
          </div>
          <div className="md:hidden absolute right-0 top-0 bottom-6 w-16 pointer-events-none flex items-center justify-end pr-2 z-20">
            <div className="flex items-center justify-center w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-pulse">
               <ChevronRight size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* --- Masonry-style Unified Video Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredVideos.map((video, idx) => (
            <div 
              key={idx} 
              className="flex flex-col group cursor-pointer animate-in slide-in-from-bottom-4 duration-400 fade-in"
              style={{ animationFillMode: 'both', animationDelay: `${idx * 50}ms` }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              
              {/* Top Video Frame */}
              <div className="relative rounded-t-3xl rounded-b-[10px] overflow-hidden shadow-2xl border border-slate-700/50 h-[280px] z-20 group-hover:-translate-y-2 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:border-blue-500/30">
                <img src={video.img} alt={video.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030A14] via-[#030A14]/40 to-transparent group-hover:via-transparent transition-colors duration-500"></div>
                
                <div className="absolute top-5 left-5 flex gap-2 z-20">
                  <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {video.category}
                  </span>
                </div>
                <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-20">
                  <Clock size={12} className="text-blue-400" /> {video.duration}
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="relative flex items-center justify-center">
                    <div className={`absolute w-full h-full rounded-full bg-blue-500/20 blur-xl transition-all duration-500 ${hoveredCard === idx ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`}></div>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-400 transition-all duration-500 group-hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <Play className="text-white group-hover:text-white fill-white ml-1.5 w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#030A14] to-transparent z-20">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md">{video.name}</h3>
                  <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold tracking-wide">
                    <Compass size={14} className="opacity-80" /> {video.trip}
                  </div>
                </div>
              </div>

              {/* Bottom Frosted Glass Quote Card */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-b-3xl rounded-t-[10px] p-6 pt-8 relative -mt-3 z-10 transition-all duration-300 group-hover:bg-white/[0.04] group-hover:border-white/[0.08] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <MessageCircle className="absolute top-6 right-6 text-blue-500/20 w-12 h-12 rotate-180 group-hover:text-blue-500/30 transition-colors duration-500" />
                <p className="text-slate-300 text-[15px] leading-relaxed relative z-10 pr-10 font-medium line-clamp-3">
                  "{video.quote}"
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/[0.05] pt-4">
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                    <Star size={12} className="fill-yellow-500 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
                    <span className="text-yellow-500 text-xs font-bold">5.0</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                    <CheckCircle2 size={12} /> Verified Traveler
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Empty State --- */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-32 animate-in zoom-in duration-500 relative z-10">
            <div className="w-24 h-24 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner backdrop-blur-md">
              <Play size={40} className="text-slate-600" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">No stories found</h4>
            <p className="text-slate-400 font-medium max-w-sm mx-auto">We haven't recorded any video testimonials for this specific category yet.</p>
            <button onClick={() => setActiveReviewFilter('All')} className="mt-6 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              View all reviews
            </button>
          </div>
        )}

        {/* --- Elegant Load More Button --- */}
        {filteredVideos.length > 0 && (
          <div className="mt-20 text-center pb-12 relative z-10">
            <button className="bg-white/[0.03] hover:bg-white/[0.08] text-white font-bold py-4 px-10 rounded-full border border-white/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] active:scale-95 flex items-center gap-3 mx-auto group">
              <RefreshCw size={18} className="text-slate-400 group-hover:text-white group-hover:rotate-180 transition-all duration-700" /> 
              <span className="tracking-wide">Load More Experiences</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

