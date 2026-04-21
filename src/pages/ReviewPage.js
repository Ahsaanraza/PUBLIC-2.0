import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Video, Clock, Play, Compass, Quote, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

const reviewVideos = [
  { name: "Ahmed Family", trip: "14-Day Umrah Package", category: "Family", img: "https://images.unsplash.com/photo-1564769665977-9dd6d5d59045?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", duration: "3:45", quote: "An absolutely seamless experience for my elderly parents. The wheelchair assistance and proximity to the Haram made all the difference." },
  { name: "Sarah & John", trip: "Premium Makkah Tour", category: "Couples", img: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", duration: "2:20", quote: "The hotels were right next to the Haram. Perfect! Waking up to the view of the Kaaba is something we will never forget." },
  { name: "Brother Tariq", trip: "Ramadan Special", category: "Ramadan", img: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", duration: "5:10", quote: "Spending Ramadan here was a dream come true, thanks to Saer. The guided taraweeh logistics were impeccably handled." },
  { name: "The Malik Family", trip: "Family Economy Package", category: "Family", img: "https://images.unsplash.com/photo-1591604466107-ec97de577aaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", duration: "4:05", quote: "Affordable, comfortable, and spiritually fulfilling. They took care of everything from visa to transport so we could just focus on prayers." },
  { name: "Sister Aisha", trip: "VIP Executive Umrah", category: "Luxury", img: "https://images.unsplash.com/photo-1519818218151-546059e61bd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", duration: "1:55", quote: "Top-tier service from landing to departure. The VIP lounge access and private GMC transfers made the journey incredibly smooth." },
  { name: "Usman & Friends", trip: "Group Guided Tour", category: "Group", img: "https://images.unsplash.com/photo-1551041777-ed277b8dd348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", duration: "3:30", quote: "The guided Ziyarat tours were incredibly informative. Our guide had deep historical knowledge of every site we visited in Madinah." }
];

export default function App({ onBack }) {
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
    <div className="bg-[#030A14] min-h-screen pb-20 animate-in fade-in duration-700 relative overflow-x-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* --- Advanced Cinematic Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
        {/* Subtle mesh/noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.apply.noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>
      
      {/* --- Premium Header --- */}
      <div className="bg-[#030A14]/70 backdrop-blur-2xl text-white py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50 border-b border-white/[0.05]">
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
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

        {/* --- Interactive Pro Category Filters (HORIZONTAL SCROLL) --- */}
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

          {/* Floating Slide Indicator (Mobile Only) */}
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
              className="flex flex-col group cursor-pointer animate-in slide-in-from-bottom-8 duration-700 fade-in"
              style={{ animationFillMode: 'both', animationDelay: `${idx * 100}ms` }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              
              {/* Top Video Frame */}
              <div className="relative rounded-t-3xl rounded-b-[10px] overflow-hidden shadow-2xl border border-slate-700/50 h-[280px] z-20 group-hover:-translate-y-2 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:border-blue-500/30">
                <img 
                  src={video.img} 
                  alt={video.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030A14] via-[#030A14]/40 to-transparent group-hover:via-transparent transition-colors duration-500"></div>
                
                {/* Floating Badges */}
                <div className="absolute top-5 left-5 flex gap-2 z-20">
                   <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                     {video.category}
                   </span>
                </div>
                <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-20">
                   <Clock size={12} className="text-blue-400" /> {video.duration}
                </div>

                {/* Cinematic Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="relative flex items-center justify-center">
                    <div className={`absolute w-full h-full rounded-full bg-blue-500/20 blur-xl transition-all duration-500 ${hoveredCard === idx ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`}></div>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-400 transition-all duration-500 group-hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <Play className="text-white group-hover:text-white fill-white ml-1.5 w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                </div>
                
                {/* Embedded Bottom Info */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#030A14] to-transparent z-20">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md">{video.name}</h3>
                  <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold tracking-wide">
                     <Compass size={14} className="opacity-80" /> {video.trip}
                  </div>
                </div>
              </div>

              {/* Bottom Frosted Glass Quote Card */}
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-b-3xl rounded-t-[10px] p-6 pt-8 relative -mt-3 z-10 transition-all duration-500 group-hover:bg-white/[0.04] group-hover:border-white/[0.08] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                 <Quote className="absolute top-6 right-6 text-blue-500/20 w-12 h-12 rotate-180 group-hover:text-blue-500/30 transition-colors duration-500" />
                 
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
                <Video size={40} className="text-slate-600" />
             </div>
             <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">No stories found</h4>
             <p className="text-slate-400 font-medium max-w-sm mx-auto">We haven't recorded any video testimonials for this specific category yet.</p>
             <button 
               onClick={() => setActiveReviewFilter('All')}
               className="mt-6 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
             >
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
}
