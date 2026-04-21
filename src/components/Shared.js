import React from 'react';
import { Plane } from 'lucide-react';

// --- Custom Reusable Logo Component (Precision Redesign) ---
export const BrandLogo = ({ dark = false, size = "md", showSubtitle = false, showLicense = false }) => {
  // Using exact pixel values for ultra-tight, professional spacing
  const classes = {
    sm: { 
      saer: 'text-[26px]', 
      pk: 'text-[16px]', 
      dot: 'w-[5px] h-[5px] ml-[1px] mr-[2px] mb-[3px]' 
    },
    md: { 
      saer: 'text-[32px] md:text-[44px]', 
      pk: 'text-[20px] md:text-[27px]', 
      dot: 'w-[6px] h-[6px] md:w-[8px] md:h-[8px] ml-[1px] md:ml-[2px] mr-[2px] md:mr-[3px] mb-[4px] md:mb-[5px]' 
    }
  };

  const c = classes[size];

  return (
    <div className="flex flex-col items-start select-none">
      <div className="flex items-baseline tracking-tighter">
        <span 
          className={`${c.saer} font-black leading-none ${dark ? 'text-white' : 'text-[#0B1A28]'}`} 
          style={{ fontFamily: "'Eczar', serif", letterSpacing: '-0.06em' }}
        >
          Saer
        </span>
        <div 
          className={`${c.dot} rounded-[1px] md:rounded-[2px] rotate-45 ${dark ? 'bg-blue-400' : 'bg-[#1a4484]'} shrink-0`}
        ></div>
        <span 
          className={`${c.pk} font-extrabold leading-none ${dark ? 'text-blue-400' : 'text-[#1a4484]'}`} 
          style={{ fontFamily: "'Roboto Slab', serif", letterSpacing: '-0.02em' }}
        >
          pk
        </span>
      </div>
      {showSubtitle && (
        <p className={`text-[10px] md:text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-[0.05em] mt-1.5 opacity-90 leading-none whitespace-nowrap`}>
          Saer Karo Travel And Tours SMC PVT LTD.
        </p>
      )}
      {showLicense && (
        <p className={`text-[9px] md:text-[10px] font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-[0.03em] mt-1.5 opacity-80 leading-none whitespace-nowrap`}>
          Department of Tourist Services License 11448
        </p>
      )}
    </div>
  );
};

export const Sun = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

export const Sunset = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 10V2"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m16 6-4 4-4-4"></path><path d="M16 18a4 4 0 0 0-8 0"></path>
  </svg>
);

export const LocationDropdown = ({ filteredAirports, handleLocationSelect }) => (
  <div className="hidden md:flex absolute top-[calc(100%+12px)] left-0 w-[400px] max-h-[360px] rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden bg-white z-[100] flex-col animate-in fade-in slide-in-from-top-2">
    <div className="flex-1 overflow-y-auto bg-white py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {filteredAirports.length > 0 ? (
        filteredAirports.map(airport => (
          <div 
            key={airport.code} 
            onClick={() => handleLocationSelect(airport)}
            className="px-4 py-3 hover:bg-[#f0f6ff] cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-0 group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors text-slate-500 group-hover:text-blue-600">
                  <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <div className="overflow-hidden">
                  <p className="font-bold text-slate-800 text-[14px] leading-tight truncate">{airport.city}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{airport.country} • {airport.name}</p>
              </div>
            </div>
            <div className="bg-slate-100 group-hover:bg-blue-50 px-2 py-1 rounded text-xs font-bold text-slate-600 group-hover:text-blue-700 transition-colors flex-shrink-0 ml-2">
              {airport.code}
            </div>
          </div>
        ))
      ) : (
        <div className="p-6 text-center text-slate-500 text-sm font-medium">
          No matching airports found
        </div>
      )}
    </div>
  </div>
);
