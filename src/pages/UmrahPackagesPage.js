import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Calendar, Plane, Moon, 
  Building, FileText, Compass, ChevronDown, ChevronRight,
  ArrowLeft, Plus, Minus, ArrowRight, Check, 
  Bus, Coffee, Filter, X, User, Baby
} from 'lucide-react';

// --- Static Mock Data ---
const tabs = [
  { name: 'Flights', icon: Plane },
  { name: 'Umrah Packages', icon: Moon }
];

const airports = [
  { code: 'LHE', city: 'Lahore', country: 'Pakistan', name: 'Allama Iqbal International' },
  { code: 'ISB', city: 'Islamabad', country: 'Pakistan', name: 'Islamabad International' },
  { code: 'KHI', city: 'Karachi', country: 'Pakistan', name: 'Jinnah International' },
  { code: 'JED', city: 'Jeddah', country: 'Saudi Arabia', name: 'King Abdulaziz International' },
  { code: 'MED', city: 'Madinah', country: 'Saudi Arabia', name: 'Prince Mohammad Bin Abdulaziz' }
];

const mockUmrahPackagesData = [
  {
    id: 101,
    name: '21 Days Premium Umrah Package',
    travelDate: '12 RAMADAN 2026',
    duration: '21 Days',
    airline: { name: 'Saudia Airlines', logo: 'https://trade.newchoudhary.com/flight/images/airlines/SV.png', code: 'SV' },
    transport: 'Jeddah ➔ Makkah ➔ Madinah ➔ Makkah ➔ Jeddah',
    flights: {
       depart: { no: 'SV-701', date: '01 Mar 2026', time: '10:30 AM', arrDate: '01 Mar 2026', arrTime: '01:15 PM', from: 'LHE', to: 'JED', duration: '5H 45M' },
       return: { no: 'SV-702', date: '22 Mar 2026', time: '04:45 PM', arrDate: '22 Mar 2026', arrTime: '11:30 PM', from: 'JED', to: 'LHE', duration: '4H 45M' }
    },
    hotels: [
       { city: 'MAKKAH', name: 'Swissôtel Al Maqam', nights: 7, checkIn: '01 Mar 2026', checkOut: '08 Mar 2026', distance: '100m from Haram' },
       { city: 'MADINAH', name: 'Pullman Zamzam Madina', nights: 8, checkIn: '08 Mar 2026', checkOut: '16 Mar 2026', distance: '150m from Masjid an-Nabawi' },
       { city: 'MAKKAH', name: 'Elaf Kinda Hotel', nights: 6, checkIn: '16 Mar 2026', checkOut: '22 Mar 2026', distance: '250m from Haram' }
    ],
    inclusions: { visa: true, ticket: true, hotel: true, transport: true, ziyarat: true, food: true },
    details: {
       food: 'Breakfast & Dinner (Open Buffet) included daily at all hotels. Timings: Breakfast (6:00 AM - 10:00 AM), Dinner (7:30 PM - 11:00 PM).',
       ziyarat: '3 Days Guided Ziyarat included. Makkah: Jabal-e-Noor, Jabal-e-Thawr, Arafat, Mina, Muzdalifah. Madinah: Masjid Quba, Masjid Qiblatain, Uhud Mountain, Date Market.'
    },
    rates: { quad: 285000, triple: 315000, double: 365000, single: 480000 }
  },
  {
    id: 102,
    name: '15 Days Standard Economy Package',
    travelDate: '05 SHAWWAL 2026',
    duration: '15 Days',
    airline: { name: 'Emirates', logo: 'https://trade.newchoudhary.com/flight/images/airlines/EK.png', code: 'EK' },
    transport: 'Jeddah ➔ Makkah ➔ Madinah ➔ Jeddah',
    flights: {
       depart: { no: 'EK-623', date: '25 Mar 2026', time: '08:00 AM', arrDate: '25 Mar 2026', arrTime: '01:30 PM', from: 'KHI', to: 'JED', duration: '6H 30M' },
       return: { no: 'EK-624', date: '09 Apr 2026', time: '09:15 PM', arrDate: '10 Apr 2026', arrTime: '04:00 AM', from: 'JED', to: 'KHI', duration: '5H 45M' }
    },
    hotels: [
       { city: 'MAKKAH', name: 'Anjum Hotel Makkah', nights: 7, checkIn: '25 Mar 2026', checkOut: '01 Apr 2026', distance: '300m from Haram' },
       { city: 'MADINAH', name: 'Anwar Al Madinah', nights: 8, checkIn: '01 Apr 2026', checkOut: '09 Apr 2026', distance: '200m from Haram' }
    ],
    inclusions: { visa: true, ticket: true, hotel: true, transport: true, ziyarat: true, food: false },
    details: {
       food: 'Meals are not included in this economy package. Plentiful local food courts are available near the hotels.',
       ziyarat: '1 Day Guided Ziyarat included in Madinah only. Covers Masjid Quba, Mount Uhud, and local Date Markets.'
    },
    rates: { quad: 195000, triple: 225000, double: 275000, single: 390000 }
  }
];



// --- Individual Umrah Package Card Component ---
const UmrahPackageCard = ({ pkg, isExpanded, onToggleExpand, onBook }) => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBookClick = (e) => {
    e.stopPropagation();
    if (!selectedRoom) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onBook(selectedRoom);
  };

  const startingRate = pkg.rates.quad;

  return (
    <div className={`bg-white rounded-[2rem] transition-all duration-300 overflow-hidden shadow-sm ${isExpanded ? 'border-2 border-[#1a4484] shadow-lg' : 'border border-slate-200 hover:border-[#1a4484]/40 hover:shadow-md'} flex flex-col w-full relative z-10`}>
      
      {/* === SUMMARY VIEW (TOP SECTION) === */}
      <div className="p-4 sm:p-6 md:p-8 relative cursor-pointer group" onClick={onToggleExpand}>
        
        {/* Basic Info & Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-blue-50 text-[#1a4484] text-[10px] md:text-[11px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider border border-blue-100 shadow-sm whitespace-nowrap">
            {pkg.travelDate}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-100 rounded-md shadow-sm bg-white whitespace-nowrap">
            <img src={pkg.airline.logo} alt={pkg.airline.name} className="h-3 md:h-3.5 object-contain grayscale opacity-80" />
            <span className="text-[10px] md:text-[11px] font-bold text-slate-500">{pkg.airline.name}</span>
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tight leading-snug truncate">{pkg.name}</h3>
        
        {/* Pills Row: Transport & Hotels */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
           <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-600 font-semibold bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 max-w-full">
             <Bus size={14} className="text-[#1a4484] shrink-0" />
             <span className="truncate">{pkg.transport}</span>
           </div>
           
           {pkg.hotels.find(h => h.city.toUpperCase() === 'MAKKAH') && (
              <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-600 font-semibold bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 max-w-full">
                 {/* Custom Kaaba Icon */}
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0"><rect x="4" y="5" width="16" height="14" rx="1" fill="#000000"/><path d="M4 11h16" stroke="#fbbf24" strokeWidth="2"/></svg>
                 <span className="truncate"><span className="text-slate-400 font-medium">Makkah:</span> {pkg.hotels.find(h => h.city.toUpperCase() === 'MAKKAH').name}</span>
              </div>
           )}

           {pkg.hotels.find(h => h.city.toUpperCase() === 'MADINAH') && (
              <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-600 font-semibold bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 max-w-full">
                 {/* Custom Green Dome Icon */}
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0"><path d="M12 2C6.477 2 2 6.477 2 12v10h20V12c0-5.523-4.477-10-10-10z" fill="#10b981"/><rect x="11" y="0" width="2" height="4" fill="#10b981"/></svg>
                 <span className="truncate"><span className="text-slate-400 font-medium">Madinah:</span> {pkg.hotels.find(h => h.city.toUpperCase() === 'MADINAH').name}</span>
              </div>
           )}
        </div>

        {/* Inclusions Row */}
        <div className="flex flex-wrap items-center gap-4 md:gap-5 mb-6">
          {[
            { label: 'Visa', inc: pkg.inclusions.visa, icon: FileText },
            { label: 'Flights', inc: pkg.inclusions.ticket, icon: Plane },
            { label: 'Hotels', inc: pkg.inclusions.hotel, icon: Building },
            { label: 'Transport', inc: pkg.inclusions.transport, icon: Bus },
            { label: 'Ziyarat', inc: pkg.inclusions.ziyarat, icon: Compass },
            { label: 'Food', inc: pkg.inclusions.food, icon: Coffee }
          ].map((inc, idx) => {
            const Icon = inc.icon;
            return (
              <div key={idx} className={`flex items-center gap-1.5 whitespace-nowrap ${inc.inc ? 'opacity-100' : 'opacity-50'}`}>
                <Icon size={15} className={inc.inc ? "text-[#1a4484]" : "text-slate-400"} />
                <span className={`text-[11px] md:text-xs font-bold ${inc.inc ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{inc.label}</span>
              </div>
            )
          })}
        </div>

        {/* Price & View Details Toggle */}
        <div className="flex justify-between items-start pt-2">
           <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 block">Quad Sharing From</span>
              <p className="text-3xl lg:text-4xl font-black text-[#1a4484] mb-1 tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                 PKR {startingRate.toLocaleString()}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">per person • taxes included</p>
           </div>

           <div className="flex items-center justify-end text-slate-400 group-hover:text-[#1a4484] transition-colors mt-1">
              <span className="text-[11px] font-bold uppercase tracking-widest">{isExpanded ? 'Hide Details' : 'View Details'}</span>
              <ChevronDown size={18} className={`ml-1.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
           </div>
        </div>

      </div>

      {/* === EXPANDABLE CONTENT SECTION === */}
      {isExpanded && (
        <div className="flex flex-col">
          {/* Subtle Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60"></div>

          {/* Detailed Itinerary */}
          <div className="bg-[#f8fafc] p-4 sm:p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
               
               {/* Left Col: Flights & Info */}
               <div className="space-y-6">
                  <div>
                     <h4 className="font-extrabold text-[#1a4484] text-lg mb-4 flex items-center gap-2"><Plane size={20} /> Included Flights</h4>
                     
                     <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm w-full overflow-hidden">
                        {/* --- Outbound Flight Grid --- */}
                        <div className="grid grid-cols-[70px_20px_minmax(0,1fr)] gap-x-2 sm:gap-x-4 w-full">
                           <div className="text-right pt-0.5">
                              <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight">{pkg.flights.depart.time}</span>
                           </div>
                           <div className="relative flex justify-center w-full">
                              <div className="w-3 h-3 rounded-full bg-[#1a4484] shadow-[0_0_0_3px_rgba(26,68,132,0.15)] mt-1.5 relative z-10 shrink-0"></div>
                              <div className="absolute top-4 bottom-[-20px] w-px border-l-2 border-dashed border-slate-200"></div>
                           </div>
                           <div className="pb-8 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                                 <p className="font-black text-slate-900 text-sm md:text-base leading-tight truncate">{pkg.flights.depart.from}</p>
                                 <span className="text-[9px] md:text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded shadow-sm border border-slate-200 shrink-0 w-fit">{pkg.flights.depart.duration}</span>
                              </div>
                              <p className="text-[11px] md:text-xs text-slate-500 font-medium truncate">{pkg.flights.depart.date}</p>
                           </div>

                           <div></div>
                           <div className="relative flex justify-center w-full">
                              <div className="absolute top-[-20px] bottom-[-20px] w-px border-l-2 border-dashed border-slate-200"></div>
                           </div>
                           <div className="pb-8 min-w-0">
                              <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-2 w-fit max-w-full shadow-sm">
                                 <img src={pkg.airline.logo} className="h-3 md:h-3.5 object-contain grayscale opacity-80 shrink-0" alt="airline" />
                                 <span className="text-[10px] md:text-[11px] font-bold text-slate-600 truncate">{pkg.flights.depart.no}</span>
                              </div>
                           </div>

                           <div className="text-right pt-0.5">
                              <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight">{pkg.flights.depart.arrTime}</span>
                           </div>
                           <div className="relative flex justify-center w-full">
                              <div className="absolute top-[-20px] h-6 w-px border-l-2 border-dashed border-slate-200"></div>
                              <div className="w-3 h-3 rounded-full border-2 border-[#1a4484] bg-white mt-1.5 relative z-10 shrink-0"></div>
                           </div>
                           <div className="pb-2 min-w-0">
                              <p className="font-black text-slate-900 text-sm md:text-base leading-tight truncate">{pkg.flights.depart.to}</p>
                              <p className="text-[11px] md:text-xs text-slate-500 font-medium mt-1.5 truncate">{pkg.flights.depart.arrDate}</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 my-6 w-full">
                           <div className="w-[70px] shrink-0"></div>
                           <div className="w-5 h-px border-b-2 border-dashed border-slate-200 shrink-0"></div>
                           <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50 px-3 py-1 rounded-md border border-slate-100">Return Flight</span>
                           <div className="flex-1 h-px border-b-2 border-dashed border-slate-200"></div>
                        </div>

                        {/* --- Return Flight Grid --- */}
                        <div className="grid grid-cols-[70px_20px_minmax(0,1fr)] gap-x-2 sm:gap-x-4 w-full">
                           <div className="text-right pt-0.5">
                              <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight">{pkg.flights.return.time}</span>
                           </div>
                           <div className="relative flex justify-center w-full">
                              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)] mt-1.5 relative z-10 shrink-0"></div>
                              <div className="absolute top-4 bottom-[-20px] w-px border-l-2 border-dashed border-slate-200"></div>
                           </div>
                           <div className="pb-8 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                                 <p className="font-black text-slate-900 text-sm md:text-base leading-tight truncate">{pkg.flights.return.from}</p>
                                 <span className="text-[9px] md:text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded shadow-sm border border-slate-200 shrink-0 w-fit">{pkg.flights.return.duration}</span>
                              </div>
                              <p className="text-[11px] md:text-xs text-slate-500 font-medium truncate">{pkg.flights.return.date}</p>
                           </div>

                           <div></div>
                           <div className="relative flex justify-center w-full">
                              <div className="absolute top-[-20px] bottom-[-20px] w-px border-l-2 border-dashed border-slate-200"></div>
                           </div>
                           <div className="pb-8 min-w-0">
                              <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-2 w-fit max-w-full shadow-sm">
                                 <img src={pkg.airline.logo} className="h-3 md:h-3.5 object-contain grayscale opacity-80 shrink-0" alt="airline" />
                                 <span className="text-[10px] md:text-[11px] font-bold text-slate-600 truncate">{pkg.flights.return.no}</span>
                              </div>
                           </div>

                           <div className="text-right pt-0.5">
                              <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight">{pkg.flights.return.arrTime}</span>
                           </div>
                           <div className="relative flex justify-center w-full">
                              <div className="absolute top-[-20px] h-6 w-px border-l-2 border-dashed border-slate-200"></div>
                              <div className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-white mt-1.5 relative z-10 shrink-0"></div>
                           </div>
                           <div className="pb-2 min-w-0">
                              <p className="font-black text-slate-900 text-sm md:text-base leading-tight truncate">{pkg.flights.return.to}</p>
                              <p className="text-[11px] md:text-xs text-slate-500 font-medium mt-1.5 truncate">{pkg.flights.return.arrDate}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {pkg.inclusions.food && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm w-full overflow-hidden">
                           <div className="flex items-center gap-2 font-extrabold text-slate-800 mb-3"><Coffee size={18} className="text-[#1a4484]" /> Food & Meals</div>
                           <p className="text-[12px] md:text-[13px] text-slate-600 leading-relaxed font-medium">{pkg.details.food}</p>
                        </div>
                     )}
                     {pkg.inclusions.ziyarat && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm w-full overflow-hidden">
                           <div className="flex items-center gap-2 font-extrabold text-slate-800 mb-3"><Compass size={18} className="text-[#1a4484]" /> Ziyarat Coverage</div>
                           <p className="text-[12px] md:text-[13px] text-slate-600 leading-relaxed font-medium">{pkg.details.ziyarat}</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Right Col: Hotel Timeline */}
               <div>
                  <h4 className="font-extrabold text-[#1a4484] text-lg mb-4 flex items-center gap-2"><Building size={20} /> Accommodation Timeline</h4>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm w-full overflow-hidden h-full">
                     <div className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-3 sm:gap-x-4 w-full h-full">
                        {pkg.hotels.map((hotel, hIdx) => (
                           <React.Fragment key={hIdx}>
                              <div className="relative flex justify-center w-full">
                                 <div className="relative z-10 w-3 h-3 bg-[#1a4484] rounded-full shadow-[0_0_0_4px_rgba(26,68,132,0.15)] mt-[22px] shrink-0"></div>
                                 {hIdx !== pkg.hotels.length - 1 && (
                                   <div className="absolute top-[32px] bottom-[-16px] w-px bg-slate-200"></div>
                                 )}
                              </div>
                              
                              <div className={`w-full min-w-0 ${hIdx !== pkg.hotels.length - 1 ? 'pb-6' : ''}`}>
                                 <div className="bg-slate-50 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 hover:border-blue-200 transition-colors hover:shadow-md relative group w-full">
                                    <div className="absolute right-3 top-3 md:right-4 md:top-4 bg-blue-50 border border-blue-100 px-2 py-1.5 rounded-md shadow-sm text-[10px] font-bold text-[#1a4484] shrink-0">{hotel.nights} Nights</div>
                                    
                                    <span className="text-[10px] md:text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1.5 block truncate">{hotel.city}</span>
                                    <h5 className="font-extrabold text-slate-900 text-base md:text-lg mb-2 pr-14 leading-snug break-words">{hotel.name}</h5>
                                    
                                    <div className="flex items-center gap-1.5 text-[11px] md:text-[12px] text-slate-500 font-medium mb-4 bg-white w-fit px-2.5 py-1 rounded-md border border-slate-100 max-w-full">
                                       <MapPin size={12} className="text-[#1a4484] shrink-0" /> <span className="truncate">{hotel.distance}</span>
                                    </div>
                                    
                                    <div className="text-[10px] md:text-[11px] text-slate-600 flex flex-wrap items-center gap-1.5 md:gap-2 mt-auto">
                                       <span className="font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white shadow-sm whitespace-nowrap">{hotel.checkIn}</span> 
                                       <ArrowRight size={12} className="text-slate-400 shrink-0" /> 
                                       <span className="font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white shadow-sm whitespace-nowrap">{hotel.checkOut}</span>
                                    </div>
                                 </div>
                              </div>
                           </React.Fragment>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* === BOTTOM BOOKING ACTION BAR === */}
          <div className="bg-white border-t border-slate-200 p-5 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-b-[2rem] shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            
            <div className="w-full md:w-72 relative" ref={dropdownRef}>
               <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${showError ? 'text-red-500' : 'text-slate-500'}`}>
                  {showError ? '* Select a room type first' : 'Select Room Type'}
               </span>
               
               <button 
                 onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); setShowError(false); }}
                 className={`flex items-center justify-between w-full bg-white border-2 ${showError ? 'border-red-400 ring-2 ring-red-50' : isDropdownOpen ? 'border-[#1a4484]' : 'border-slate-200 hover:border-blue-300'} px-4 py-3.5 rounded-xl text-[15px] font-bold text-slate-700 transition-all focus:outline-none`}
               >
                 <span className="capitalize">{selectedRoom ? `${selectedRoom} Sharing` : 'Select room...'}</span>
                 <ChevronDown size={18} className={`text-[#1a4484] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
               </button>
               
               {isDropdownOpen && (
                 <div className="absolute right-0 left-0 bottom-full mb-2 w-full bg-white border border-slate-200 rounded-xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                   {['quad', 'triple', 'double', 'single'].map(room => {
                     const rate = pkg.rates[room];
                     if(!rate) return null;
                     const isSelected = selectedRoom === room;
                     return (
                       <div 
                         key={room} 
                         onClick={(e) => { e.stopPropagation(); setSelectedRoom(room); setIsDropdownOpen(false); setShowError(false); }}
                         className={`px-4 py-3.5 cursor-pointer flex flex-col justify-center transition-colors border-b border-slate-50 last:border-0 ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                       >
                         <div className="flex justify-between items-center w-full">
                            <span className={`capitalize text-[15px] font-bold ${isSelected ? 'text-[#1a4484]' : 'text-slate-700'}`}>{room} Sharing</span>
                            {isSelected && <Check size={16} className="text-[#1a4484]" strokeWidth={3} />}
                         </div>
                         <span className={`text-[11px] font-black mt-0.5 ${isSelected ? 'text-[#1a4484]' : 'text-slate-500'}`}>PKR {rate.toLocaleString()}</span>
                       </div>
                     )
                   })}
                 </div>
               )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto border-t border-slate-100 md:border-t-0 pt-5 md:pt-0">
               <div className="w-full md:w-auto text-left md:text-right">
                  <p className="text-3xl md:text-4xl font-black text-[#1a4484] tracking-tight leading-none mb-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {selectedRoom ? `PKR ${pkg.rates[selectedRoom].toLocaleString()}` : `PKR ${startingRate.toLocaleString()}`}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">per person • taxes included</p>
               </div>

               <button 
                 onClick={handleBookClick} 
                 className="w-full md:w-auto bg-[#1a4484] hover:bg-[#123060] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-[15px]"
               >
                  Book Package <ArrowRight size={18} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- App Container ---
const UmrahPackagesPage = ({ onBack = () => {}, onBook = () => {}, modifySearchForm, searchState = {} }) => {
  const [currentView, setCurrentView] = useState('results'); // defaulting to 'results' to test immediately
  const [activeTab, setActiveTab] = useState('Umrah Packages');
  
  // Search State
  const [isModifyingSearch, setIsModifyingSearch] = useState(false);
  const [umrahAdults, setUmrahAdults] = useState(1);
  const [umrahChildren, setUmrahChildren] = useState(0);
  const [umrahInfants, setUmrahInfants] = useState(0);
  const totalUmrahTravelers = umrahAdults + umrahChildren + umrahInfants;
  
  const [umrahRoomType, setUmrahRoomType] = useState('Quad');
  const [isUmrahRoomModalOpen, setIsUmrahRoomModalOpen] = useState(false);
  const [isUmrahPaxModalOpen, setIsUmrahPaxModalOpen] = useState(false);
  const [umrahDepartLoc, setUmrahDepartLoc] = useState(airports[0]);
  const [umrahDays, setUmrahDays] = useState('14 Days');
  const [isUmrahDaysModalOpen, setIsUmrahDaysModalOpen] = useState(false);
  const [umrahMonth, setUmrahMonth] = useState('Ramadan 2026');
  const [isUmrahMonthModalOpen, setIsUmrahMonthModalOpen] = useState(false);
  const [umrahMonthSearch, setUmrahMonthSearch] = useState('');

  const filteredUmrahMonths = [
    'Anytime',
    'Ramadan 2026',
    'Shawwal 2026',
    'Dhul Qadah 2026',
    'Dhul Hijjah 2026',
    'Muharram 2026',
    'Safar 2026'
  ].filter(m => m.toLowerCase().includes(umrahMonthSearch.toLowerCase()));

  // Results State
  const [expandedUmrahPackageId, setExpandedUmrahPackageId] = useState(null);
  const [activeSortTab, setActiveSortTab] = useState('Recommended');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const [locModal, setLocModal] = useState({ isOpen: false, type: 'umrah-depart' });
  const [locSearch, setLocSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredAirports = airports.filter(a => 
    a.city.toLowerCase().includes(locSearch.toLowerCase()) || 
    a.code.toLowerCase().includes(locSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.mobile-modal')) return;
      if (!event.target.closest('.loc-picker-wrapper')) setLocModal({ isOpen: false });
      if (!event.target.closest('.umrah-passenger-wrapper')) setIsUmrahPaxModalOpen(false);
      if (!event.target.closest('.umrah-days-wrapper')) setIsUmrahDaysModalOpen(false);
      if (!event.target.closest('.umrah-month-wrapper')) setIsUmrahMonthModalOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (airport) => {
    setUmrahDepartLoc(airport);
    setLocModal({ isOpen: false });
    setLocSearch(''); 
  };

  const handleSearchSubmit = () => {
    setCurrentView('results');
    setIsModifyingSearch(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleUmrahExpansion = (pkgId) => {
    setExpandedUmrahPackageId(expandedUmrahPackageId === pkgId ? null : pkgId);
  };

  // Fallback to local state if props are missing (e.g. running in isolation)
  const displayDepartLoc = searchState.umrahDepartLoc || umrahDepartLoc;
  const displayMonth = searchState.umrahMonth || umrahMonth;
  const displayDays = searchState.umrahDays || umrahDays;
  const displayTravelers = searchState.totalUmrahTravelers || totalUmrahTravelers;

  // Grand Total for active view
  const grandTotal = 0;

  // --- REUSABLE UMRAH SEARCH FORM (Hero) ---
  // Removed local umrahSearchForm implementation to use the one imported from App.js landing page



  // --- REUSABLE DESKTOP AND MOBILE FILTERS COMPONENT ---
  const renderUmrahFilters = () => (
    <div className="flex flex-col gap-4 md:gap-5 w-full">
      {/* Travel Dates Filter */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200">
         <h4 className="font-bold text-slate-800 mb-3 md:mb-4">Travel Dates</h4>
         <div className="flex flex-col gap-3">
            <div className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-[#1a4484] focus-within:ring-1 focus-within:ring-[#1a4484] transition-all bg-white">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">From</span>
               <input type="date" className="w-full text-xs md:text-sm font-semibold text-slate-800 outline-none bg-transparent" defaultValue="2026-02-15" />
            </div>
            <div className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-[#1a4484] focus-within:ring-1 focus-within:ring-[#1a4484] transition-all bg-white">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">To</span>
               <input type="date" className="w-full text-xs md:text-sm font-semibold text-slate-800 outline-none bg-transparent" defaultValue="2026-03-30" />
            </div>
         </div>
      </div>

      {/* Package Type */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200">
         <h4 className="font-bold text-slate-800 mb-3 md:mb-4">Package Type</h4>
         <div className="flex flex-col gap-2.5 md:gap-3">
            {['Economy', 'Standard', 'Premium', 'VIP'].map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" className="w-[18px] h-[18px] rounded border-slate-300 text-[#1a4484] focus:ring-[#1a4484] transition-colors" defaultChecked={type === 'Premium' || type === 'Standard'} />
                 <span className="text-[13px] md:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{type} Packages</span>
              </label>
            ))}
         </div>
      </div>

      {/* Travel Month */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200">
         <h4 className="font-bold text-slate-800 mb-3 md:mb-4">Travel Month</h4>
         <div className="flex flex-col gap-2.5 md:gap-3">
            {['Ramadan 2026', 'Shawwal 2026', 'Dhul Qadah 2026', 'Dhul Hijjah 2026'].map((month) => (
              <label key={month} className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" className="w-[18px] h-[18px] rounded border-slate-300 text-[#1a4484] focus:ring-[#1a4484] transition-colors" defaultChecked={month === 'Ramadan 2026'} />
                 <span className="text-[13px] md:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{month}</span>
              </label>
            ))}
         </div>
      </div>

      {/* Duration Range */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200">
         <h4 className="font-bold text-slate-800 mb-3 md:mb-4">Duration</h4>
         <div className="flex flex-col gap-2.5 md:gap-3">
            {['Under 10 Days', '10 - 15 Days', '15 - 20 Days', '21+ Days'].map((duration) => (
              <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" className="w-[18px] h-[18px] rounded border-slate-300 text-[#1a4484] focus:ring-[#1a4484] transition-colors" defaultChecked={duration === '10 - 15 Days' || duration === '21+ Days'} />
                 <span className="text-[13px] md:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{duration}</span>
              </label>
            ))}
         </div>
      </div>

      {/* Departure City */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200">
         <h4 className="font-bold text-slate-800 mb-3 md:mb-4">Departure City</h4>
         <div className="flex flex-col gap-2.5 md:gap-3">
            {['Lahore (LHE)', 'Karachi (KHI)', 'Islamabad (ISB)', 'Peshawar (PEW)', 'Multan (MUX)'].map((city) => (
              <label key={city} className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" className="w-[18px] h-[18px] rounded border-slate-300 text-[#1a4484] focus:ring-[#1a4484] transition-colors" defaultChecked={city.includes('LHE')} />
                 <span className="text-[13px] md:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{city}</span>
              </label>
            ))}
         </div>
      </div>

      {/* Flight Class */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200">
         <h4 className="font-bold text-slate-800 mb-3 md:mb-4">Flight Class</h4>
         <div className="flex flex-col gap-2.5 md:gap-3">
            {['Economy', 'Premium Economy', 'Business', 'First Class'].map((flightClass) => (
              <label key={flightClass} className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" className="w-[18px] h-[18px] rounded border-slate-300 text-[#1a4484] focus:ring-[#1a4484] transition-colors" defaultChecked={flightClass === 'Economy'} />
                 <span className="text-[13px] md:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{flightClass}</span>
              </label>
            ))}
         </div>
      </div>
    </div>
  );


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@600;700;800&family=Roboto+Slab:wght@600;700;800&family=Montserrat:wght@700;800;900&display=swap');
      `}</style>
      
      {/* 2. Content */}
      {currentView === 'home' ? (
        <section className="relative w-full z-[60] pb-20 min-h-screen">
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-0">
            <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Mecca" className="w-full h-full object-cover object-center opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-50"></div>
          </div>

          <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md mb-2">Find your path</h1>
              <p className="text-slate-200 text-lg">Search for the best Umrah packages from Pakistan</p>
            </div>

            <div className="max-w-[1100px] mx-auto bg-white/10 backdrop-blur-xl rounded-[2rem] p-2 md:p-4 border border-white/20 shadow-2xl">
              <div className="flex overflow-x-auto gap-2 mb-3 p-1.5 bg-slate-900/30 rounded-full w-fit mx-auto md:mx-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.name} onClick={() => setActiveTab(tab.name)}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === tab.name ? 'bg-white text-blue-700 shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
                    >
                      <Icon size={16} className={activeTab === tab.name ? 'text-blue-600' : 'text-slate-400'} /> {tab.name}
                    </button>
                  )
                })}
              </div>

              <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:px-8 shadow-2xl relative z-20">
                {activeTab === 'Umrah Packages' ? modifySearchForm : (
                  <div className="text-center py-10 text-slate-500 font-medium">Please select "Umrah Packages" to test this flow.</div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : currentView === 'results' ? (
        <div className="bg-[#f0f2f5] min-h-screen pb-16 animate-in fade-in duration-500">
          
          {/* Top Summary Bar */}
          <div className="bg-[#0B1A28] text-white py-4 shadow-md sticky top-[64px] md:top-[80px] z-40 border-t border-slate-700/50">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                  <ArrowLeft size={20} className="text-white hover:text-slate-300 cursor-pointer mr-3" onClick={onBack} />
                      <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2 truncate">
                         Umrah Packages <ChevronRight size={18} className="text-slate-400" /> {displayDepartLoc?.city || 'Any City'}
                      </h2>
                    </div>
                    <p className="text-[13px] md:text-sm text-slate-300 font-medium md:pl-8">
                       {displayMonth} <span className="mx-2 text-slate-500">|</span> {displayDays} <span className="mx-2 text-slate-500">|</span> {displayTravelers} Pilgrim{displayTravelers > 1 ? 's' : ''}
                    </p>
                 </div>
                 <button onClick={() => setIsModifyingSearch(!isModifyingSearch)} className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isModifyingSearch ? 'bg-white/20 text-white' : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'}`}>
                    <Search size={16} /> Modify Search <ChevronDown size={18} className={`transition-transform duration-300 ml-1 ${isModifyingSearch ? 'rotate-180' : ''}`} />
                 </button>
             </div>
          </div>

          {/* Expandable Modify Search Area (Inline) */}
          {isModifyingSearch && (
            <div 
              className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative z-30 border-b border-slate-200 animate-in slide-in-from-top-2"
              onClick={(e) => {
                const btn = e.target.closest('button');
                if (btn && btn.textContent.includes('Search')) setIsModifyingSearch(false);
              }}
            >
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
                  {modifySearchForm}
               </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
             
             {/* LEFT SIDEBAR: FILTERS */}
             <div className="hidden lg:block col-span-1 space-y-5">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Filter size={18} className="text-[#1a4484]" /> Filters</h3>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Clear All</button>
                 </div>
                 {renderUmrahFilters()}
             </div>

             {/* RIGHT MAIN CONTENT: RESULTS */}
             <div className="col-span-1 lg:col-span-3 space-y-5">
                 
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">
                       {mockUmrahPackagesData.length} Packages Found
                    </h3>
                    <div className="lg:hidden flex gap-2">
                       <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 shadow-sm active:bg-slate-50">
                          <Filter size={16} /> Filters
                       </button>
                    </div>
                 </div>

                 {/* Interactive Sorting Tabs for Umrah */}
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden">
                    <button 
                      onClick={() => setActiveSortTab('Recommended')}
                      className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${activeSortTab === 'Recommended' ? 'border-[#1a4484] bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}
                    >
                       <span className={`block text-sm font-bold ${activeSortTab === 'Recommended' ? 'text-[#1a4484]' : 'text-slate-700'}`}>Recommended</span>
                    </button>
                    <button 
                      onClick={() => setActiveSortTab('Cheapest')}
                      className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${activeSortTab === 'Cheapest' ? 'border-[#1a4484] bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}
                    >
                       <span className={`block text-sm font-bold ${activeSortTab === 'Cheapest' ? 'text-[#1a4484]' : 'text-slate-700'}`}>Price: Low to High</span>
                    </button>
                 </div>

                 {/* Umrah Packages Cards List */}
                 <div className="flex flex-col gap-6">
                    {mockUmrahPackagesData.map(pkg => (
                       <UmrahPackageCard 
                         key={pkg.id} 
                         pkg={pkg}
                         isExpanded={expandedUmrahPackageId === pkg.id}
                         onToggleExpand={() => toggleUmrahExpansion(pkg.id)}
                         onBook={(roomType) => {
                            onBook(pkg, roomType);
                         }}
                       />
                    ))}
                 </div>

             </div>
          </div>
          
          {/* Mobile Filters Modal */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col lg:hidden animate-in slide-in-from-bottom-2 mobile-modal">
               <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                     <Filter size={20} className="text-[#1a4484]" />
                     <h2 className="text-[18px] font-bold text-slate-900">Filters</h2>
                  </div>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors -mr-2">
                     <X size={24} />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                  {renderUmrahFilters()}
               </div>
               <div className="p-4 bg-white border-t border-slate-200 pb-8">
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-[#1252a8] text-white font-medium py-3.5 rounded-lg">
                     Apply Filters
                  </button>
               </div>
            </div>
          )}
        </div>
      ) : null}

      {/* --- MOBILE FULL-SCREEN MODALS --- */}

      {/* Mobile Location Picker Modal */}
      {locModal.isOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
          <div className="flex flex-col border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
              <div className="flex items-center p-4">
                <button onClick={() => setLocModal(prev => ({...prev, isOpen: false}))} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-[18px] font-bold text-slate-900">Select Origin</h2>
              </div>
              <div className="px-4 pb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Search city or airport code..." 
                      value={locSearch}
                      onChange={(e) => setLocSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-100 border-transparent rounded-xl text-[15px] outline-none focus:border-[#24529a] focus:bg-white focus:ring-1 focus:ring-[#24529a] transition-all"
                    />
                </div>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white">
            {filteredAirports.length > 0 ? (
              filteredAirports.map(airport => (
                <div 
                  key={airport.code} 
                  onClick={() => handleLocationSelect(airport)}
                  className="px-5 py-4 cursor-pointer flex items-center justify-between border-b border-slate-100 active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                        <Plane className="w-5 h-5 -rotate-45" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-slate-800 text-[16px] leading-tight truncate">{airport.city}</p>
                        <p className="text-[13px] text-slate-500 mt-1 truncate">{airport.country} • {airport.name}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 px-2 py-1 rounded text-[13px] font-bold text-blue-700 flex-shrink-0 ml-3">
                    {airport.code}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-[15px]">
                No airports found matching "{locSearch}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Umrah Passenger Modal */}
      {isUmrahPaxModalOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
          <div className="flex items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
              <button onClick={() => setIsUmrahPaxModalOpen(false)} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-[18px] font-bold text-slate-900">Pilgrims</h2>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
              <div className="px-5">
                {/* Adults Row */}
                <div className="flex justify-between items-center py-5 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      <User size={22} className="text-slate-800 mt-0.5" />
                      <div>
                          <p className="text-[16px] font-medium text-slate-900 leading-none">Adults</p>
                          <p className="text-[13px] text-slate-500 mt-1.5">12 years and above</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setUmrahAdults(Math.max(1, umrahAdults - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${umrahAdults <= 1 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
                          <Minus size={16} />
                      </button>
                      <span className="w-4 text-center font-bold text-slate-900 text-[16px]">{umrahAdults}</span>
                      <button onClick={() => setUmrahAdults(umrahAdults + 1)} className="w-8 h-8 rounded-full border border-[#1a4484] text-[#1a4484] flex items-center justify-center hover:bg-blue-50 transition-colors">
                          <Plus size={16} />
                      </button>
                    </div>
                </div>

                {/* Children Row */}
                <div className="flex justify-between items-center py-5 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      <Baby size={22} className="text-slate-800 mt-0.5" />
                      <div>
                          <p className="text-[16px] font-medium text-slate-900 leading-none">Children</p>
                          <p className="text-[13px] text-slate-500 mt-1.5">2 to 11 years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setUmrahChildren(Math.max(0, umrahChildren - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${umrahChildren <= 0 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
                          <Minus size={16} />
                      </button>
                      <span className="w-4 text-center font-bold text-slate-900 text-[16px]">{umrahChildren}</span>
                      <button onClick={() => setUmrahChildren(umrahChildren + 1)} className="w-8 h-8 rounded-full border border-[#1a4484] text-[#1a4484] flex items-center justify-center hover:bg-blue-50 transition-colors">
                          <Plus size={16} />
                      </button>
                    </div>
                </div>

                {/* Infants Row */}
                <div className="flex justify-between items-center py-5 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      <Baby size={22} className="text-slate-800 mt-0.5" />
                      <div>
                          <p className="text-[16px] font-medium text-slate-900 leading-none">Infants</p>
                          <p className="text-[13px] text-slate-500 mt-1.5">Under 2 years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setUmrahInfants(Math.max(0, umrahInfants - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${umrahInfants <= 0 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
                          <Minus size={16} />
                      </button>
                      <span className="w-4 text-center font-bold text-slate-900 text-[16px]">{umrahInfants}</span>
                      <button onClick={() => setUmrahInfants(umrahInfants + 1)} className={`w-8 h-8 rounded-full border border-[#1a4484] text-[#1a4484] flex items-center justify-center hover:bg-blue-50 transition-colors ${umrahInfants >= umrahAdults ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <Plus size={16} />
                      </button>
                    </div>
                </div>
              </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 z-20 pb-8">
              <button onClick={() => setIsUmrahPaxModalOpen(false)} className="w-full bg-[#1252a8] text-white font-medium py-3.5 rounded-lg active:scale-[0.98] transition-transform text-[17px]">
                Done
              </button>
          </div>
        </div>
      )}

      {/* Mobile Umrah Room Modal */}
      {isUmrahRoomModalOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
          <div className="flex items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
              <button onClick={() => setIsUmrahRoomModalOpen(false)} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-[18px] font-bold text-slate-900">Room Type</h2>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
              <div className="pt-4 px-5">
                <div className="flex flex-col gap-4">
                    {['Quad', 'Triple', 'Double', 'Single'].map(room => (
                      <label key={room} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${umrahRoomType === room ? 'border-[#1a4484] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`} onClick={() => setUmrahRoomType(room)}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${umrahRoomType === room ? 'border-[#1a4484]' : 'border-slate-300'}`}>
                            {umrahRoomType === room && <div className="w-3 h-3 bg-[#1a4484] rounded-full"></div>}
                          </div>
                          <span className={`text-[16px] ${umrahRoomType === room ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium'}`}>{room} Sharing</span>
                      </label>
                    ))}
                </div>
              </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 z-20 pb-8">
              <button onClick={() => setIsUmrahRoomModalOpen(false)} className="w-full bg-[#1252a8] text-white font-medium py-3.5 rounded-lg active:scale-[0.98] transition-transform text-[17px]">
                Done
              </button>
          </div>
        </div>
      )}

      {/* Mobile Umrah Duration Modal */}
      {isUmrahDaysModalOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
          <div className="flex items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
              <button onClick={() => setIsUmrahDaysModalOpen(false)} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-[18px] font-bold text-slate-900">Duration</h2>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
              <div className="pt-4 px-5">
                <div className="flex flex-col gap-4">
                    {['7 Days', '10 Days', '14 Days', '15 Days', '21 Days', '28 Days', 'Custom'].map(day => (
                      <div 
                        key={day} 
                        onClick={() => { setUmrahDays(day); setIsUmrahDaysModalOpen(false); }}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${umrahDays === day ? 'border-[#1a4484] bg-blue-50/50 text-[#1a4484] font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'}`}
                      >
                          <span className="text-[16px]">{day}</span>
                          {umrahDays === day && <Check size={20} className="text-[#1a4484]" />}
                      </div>
                    ))}
                </div>
              </div>
          </div>
        </div>
      )}

      {/* Mobile Umrah Month Modal */}
      {isUmrahMonthModalOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
          <div className="flex flex-col border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
              <div className="flex items-center p-4">
                <button onClick={() => setIsUmrahMonthModalOpen(false)} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-[18px] font-bold text-slate-900">When</h2>
              </div>
              <div className="px-4 pb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Search month..." 
                      value={umrahMonthSearch}
                      onChange={(e) => setUmrahMonthSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-100 border-transparent rounded-xl text-[15px] outline-none focus:border-[#24529a] focus:bg-white focus:ring-1 focus:ring-[#24529a] transition-all"
                    />
                </div>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white pb-24">
              {filteredUmrahMonths.length > 0 ? (
                filteredUmrahMonths.map(month => (
                  <div 
                    key={month} 
                    onClick={() => { setUmrahMonth(month); setIsUmrahMonthModalOpen(false); setUmrahMonthSearch(''); }}
                    className={`px-5 py-4 cursor-pointer flex items-center justify-between border-b border-slate-100 active:bg-slate-50 transition-colors ${umrahMonth === month ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${umrahMonth === month ? 'bg-blue-100 text-[#1a4484]' : 'bg-slate-100 text-slate-500'}`}>
                          <Calendar className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                          <p className={`text-[16px] leading-tight truncate ${umrahMonth === month ? 'font-bold text-[#1a4484]' : 'font-medium text-slate-800'}`}>{month}</p>
                      </div>
                    </div>
                    {umrahMonth === month && (
                      <Check size={20} className="text-[#1a4484] flex-shrink-0 ml-3" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-[15px]">
                  No matching months found
                </div>
              )}
          </div>
        </div>
      )}

    </>
  );
};

export default UmrahPackagesPage;
