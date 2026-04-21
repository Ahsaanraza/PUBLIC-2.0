import { BookingView } from './pages/BookingView';
import { BranchesView } from './pages/BranchesView';
import { ContactView } from './pages/ContactView';
import { AboutView } from './pages/AboutView';
import { PrivacyView } from './pages/PrivacyView';
import { TermsView } from './pages/TermsView';
import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, Users, Phone, MessageCircle, Headset, Zap, ShieldCheck, ChevronRight, ChevronLeft, Clock, X, Play, ChevronDown, Building2, Plane, Moon, FileText, Compass, User, Baby, Star, Sparkles, Loader2, Filter, Check, Briefcase, CheckCircle2, CreditCard, ArrowRightLeft, ArrowLeft, Plus, Minus, ArrowRight, BedDouble } from 'lucide-react';
import ReviewPage from './pages/ReviewPage';
import BlogPage from './pages/BlogsPage';
import UmrahPackagesPage from './pages/UmrahPackagesPage';
import ManageBookingPage from './pages/ManageBookingsPage';
import SignInPopup from './components/SignInPopup';
import ProfilePage from './pages/ProfilePage';
import { useNavigate, useLocation } from 'react-router-dom';
import UserDashboard from './pages/userdashboard';
import SeeBookingDashboard from './pages/SeeBookingDashboard';
import { tabs, recommendedHolidays, videos, blogs, faqs, airports, mockAirlines, mockFlightResults, fareTiers } from './data/constants';
import { formatDate, generateMonthData } from './utils/helpers';
import { BrandLogo, Sun, Sunset, LocationDropdown } from './components/Shared';
// --- Main App Component ---
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  // Sync activeTab and popups with URL hash
  useEffect(() => {
    // Correctly handle both #Support and #/Support patterns
    const hash = location.hash.replace('#/', '').replace('#', '');
    if (hash) {
      if (hash === 'SignIn' || hash === '/SignIn') {
        setIsSignInOpen(true);
        return;
      }
      if (hash === 'Support' || hash === '/Support') {
        setShowSupportPopup(true);
        return;
      }
      
      const cleanedHash = hash.replace(/^\//, '');
      const matchedTab = tabs.find(t => t.name.replace(/\s+/g, '') === cleanedHash);
      if (matchedTab) {
        setActiveTab(matchedTab.name);
      }
    }
  }, [location.hash]);

  // URL-to-View Mapping
  const getViewFromPath = (path) => {
    if (path === '/dashboard' || path.startsWith('/dashboard/')) return 'userdashboard';
    
    switch(path) {
      case '/': return 'home';
      case '/flights': return 'results';
      case '/umrah-packages': return 'umrah_packages';
      case '/booking': return 'booking';
      case '/manage-booking': return 'manage_bookings';
      case '/dashboard': return 'userdashboard';
      case '/see-booking': return 'see_booking_dashboard';
      case '/profile': return 'profile';
      case '/branches': return 'branches';
      case '/contact': return 'contact';
      case '/about': return 'about';
      case '/privacy': return 'privacy';
      case '/terms': return 'terms';
      case '/reviews': return 'reviews';
      case '/blogs': return 'blogs';
      default: return 'home';
    }
  };

  const currentView = getViewFromPath(location.pathname);

  // View-to-URL Navigation Helper
  const setCurrentView = (view) => {
    let path = '/';
    switch(view) {
      case 'home': path = '/'; break;
      case 'results': path = '/flights'; break;
      case 'umrah_packages': path = '/umrah-packages'; break;
      case 'booking': path = '/booking'; break;
      case 'manage_bookings': path = '/manage-booking'; break;
      case 'userdashboard': path = '/dashboard'; break;
      case 'see_booking_dashboard': path = '/see-booking'; break;
      case 'profile': path = '/profile'; break;
      case 'branches': path = '/branches'; break;
      case 'contact': path = '/contact'; break;
      case 'about': path = '/about'; break;
      case 'privacy': path = '/privacy'; break;
      case 'terms': path = '/terms'; break;
      case 'reviews': path = '/reviews'; break;
      case 'blogs': path = '/blogs'; break;
      default: path = '/';
    }
    navigate(path);
  };
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentHolidayIndex, setCurrentHolidayIndex] = useState(0);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const [flightType, setFlightType] = useState('Return');

  // Modify Search & Filters State
  const [isModifyingSearch, setIsModifyingSearch] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeSortTab, setActiveSortTab] = useState('Recommended');

  // Interactive Filters State
  const [selectedStops, setSelectedStops] = useState(['Any']);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500000);

  // Reviews State
  const [activeReviewFilter, setActiveReviewFilter] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const toggleFilter = (setter, item) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };
  const clearAllFilters = () => {
    setSelectedStops(['Any']);
    setSelectedAirlines([]);
    setSelectedTimes([]);
    setMaxPrice(500000);
  };

  // AI Planner State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  // AI Generate Function
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = {
        title: "Personalized Umrah Journey",
        summary: "A 14-day spiritual journey tailored to your needs with elderly parents, focusing on accessibility and Ramadan timing.",
        itinerary: [{
          day: "Day 1-2",
          location: "Makkah",
          activities: "Arrival and settling in. Light tawaf and sa'i with wheelchair assistance. Rest and spiritual preparation."
        }, {
          day: "Day 3-5",
          location: "Makkah",
          activities: "Full Umrah rituals with family support. Daily prayers at Masjid al-Haram. Rest periods between activities."
        }, {
          day: "Day 6-10",
          location: "Madinah",
          activities: "Travel to Madinah. Visit Masjid al-Nabawi. Daily prayers and reflection. Wheelchair-accessible accommodations."
        }, {
          day: "Day 11-14",
          location: "Madinah",
          activities: "Continued spiritual activities. Farewell visits to holy sites. Return travel preparations."
        }],
        estimatedBudget: "SAR 15,000 - 20,000"
      };
      setAiResult(mockResult);
    } catch (error) {
      setAiError("Failed to generate itinerary. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Umrah Packages State
  const [umrahPackageType, setUmrahPackageType] = useState('Premium');
  const [umrahAdults, setUmrahAdults] = useState(1);
  const [umrahChildren, setUmrahChildren] = useState(0);
  const [umrahInfants, setUmrahInfants] = useState(0);
  const totalUmrahTravelers = umrahAdults + umrahChildren + umrahInfants;
  const [isUmrahPaxModalOpen, setIsUmrahPaxModalOpen] = useState(false);
  const [umrahRoomType, setUmrahRoomType] = useState('Quad');
  const [isUmrahRoomModalOpen, setIsUmrahRoomModalOpen] = useState(false);
  const [umrahDepartLoc, setUmrahDepartLoc] = useState(airports[10]);
  const [umrahDays, setUmrahDays] = useState('14 Days');
  const [isUmrahDaysModalOpen, setIsUmrahDaysModalOpen] = useState(false);
  const [umrahMonth, setUmrahMonth] = useState('Ramadan (Feb/Mar 2026)');
  const [isUmrahMonthModalOpen, setIsUmrahMonthModalOpen] = useState(false);
  const [umrahMonthSearch, setUmrahMonthSearch] = useState('');
  const filteredUmrahMonths = ['Anytime', 'Ramadan (Feb/Mar 2026)', 'Shawwal (Mar/Apr 2026)', 'Dhul Qadah (Apr/May 2026)', 'Dhul Hijjah (May/Jun 2026)', 'Muharram (Jun/Jul 2026)', 'Safar (Jul/Aug 2026)'].filter(m => m.toLowerCase().includes(umrahMonthSearch.toLowerCase()));

  // Location State
  const [departLoc, setDepartLoc] = useState(airports[10]);
  const [arriveLoc, setArriveLoc] = useState(airports[4]);
  const [locModal, setLocModal] = useState({
    isOpen: false,
    type: 'depart',
    multiIndex: null
  });
  const [locSearch, setLocSearch] = useState('');

  // Passenger & Class State
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [flightClass, setFlightClass] = useState('Economy');
  const totalTravelers = adults + children + infants;

  // Date & Multi-City State
  const [departDate, setDepartDate] = useState(new Date(2026, 3, 6));
  const [returnDate, setReturnDate] = useState(null);
  const [multiCityFlights, setMultiCityFlights] = useState([{
    from: airports[10],
    to: airports[3],
    date: new Date(2026, 3, 6)
  }, {
    from: airports[3],
    to: airports[4],
    date: new Date(2026, 3, 10)
  }]);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 3, 1));

  const [bookingType, setBookingType] = useState('ticket'); // 'ticket' | 'umrah'
  const [selectedUmrahPackage, setSelectedUmrahPackage] = useState(null);
  const [selectedUmrahRoom, setSelectedUmrahRoom] = useState(null);

  // --- Inline Booking Flow State ---
  const [expandedFlightId, setExpandedFlightId] = useState(null);
  const [activeFareLeg, setActiveFareLeg] = useState(0);
  const [selectedFares, setSelectedFares] = useState({}); // { legIndex: fareId }
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState(null);
  const getSearchLegs = () => {
    if (flightType === 'Multi City') {
      return multiCityFlights.filter(f => f.from && f.to);
    } else if (flightType === 'Return') {
      return [{
        from: departLoc || airports[0],
        to: arriveLoc || airports[3],
        date: departDate
      }, {
        from: arriveLoc || airports[3],
        to: departLoc || airports[0],
        date: returnDate || departDate
      }];
    } else {
      return [{
        from: departLoc || airports[0],
        to: arriveLoc || airports[3],
        date: departDate
      }];
    }
  };
  const calculateTotalPriceForFlight = (flightObj, faresObj) => {
    if (!flightObj) return 0;
    const legsCount = getSearchLegs().length;
    const basePerLeg = Math.floor((flightObj.price || 0) / legsCount);
    let total = 0;
    for (let i = 0; i < legsCount; i++) {
      const tierId = faresObj[i] || 'classic';
      const tier = fareTiers.find(t => t.id === tierId);
      total += (basePerLeg + (tier?.addPrice || 0)) * totalTravelers;
    }
    return total;
  };
  const handleAddDestination = () => {
    if (multiCityFlights.length < 6) {
      const lastDate = multiCityFlights[multiCityFlights.length - 1].date;
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const lastTo = multiCityFlights[multiCityFlights.length - 1].to;
      setMultiCityFlights([...multiCityFlights, {
        from: lastTo,
        to: null,
        date: nextDate
      }]);
    }
  };
  const handleRemoveDestination = indexToRemove => {
    setMultiCityFlights(multiCityFlights.filter((_, idx) => idx !== indexToRemove));
  };
  const [dateConfig, setDateConfig] = useState({
    isOpen: false,
    type: 'depart',
    activeMultiIndex: 0
  });
  useEffect(() => {
    const handleClickOutside = event => {
      if (event.target.closest('.mobile-modal')) return;
      if (!event.target.closest('.date-picker-wrapper')) {
        setDateConfig(prev => ({
          ...prev,
          isOpen: false
        }));
      }
      if (!event.target.closest('.passenger-wrapper')) {
        setIsPassengerModalOpen(false);
      }
      if (!event.target.closest('.class-wrapper')) {
        setIsClassModalOpen(false);
      }
      if (!event.target.closest('.loc-picker-wrapper')) {
        setLocModal(prev => ({
          ...prev,
          isOpen: false
        }));
      }
      if (!event.target.closest('.umrah-passenger-wrapper')) setIsUmrahPaxModalOpen(false);
      if (!event.target.closest('.umrah-room-wrapper')) setIsUmrahRoomModalOpen(false);
      if (!event.target.closest('.umrah-days-wrapper')) setIsUmrahDaysModalOpen(false);
      if (!event.target.closest('.umrah-month-wrapper')) setIsUmrahMonthModalOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleLocationSelect = airport => {
    if (locModal.multiIndex !== null) {
      const newFlights = [...multiCityFlights];
      if (locModal.type === 'depart') {
        newFlights[locModal.multiIndex].from = airport;
      } else {
        newFlights[locModal.multiIndex].to = airport;
      }
      setMultiCityFlights(newFlights);
    } else {
      if (locModal.type === 'depart') setDepartLoc(airport); else if (locModal.type === 'umrah-depart') setUmrahDepartLoc(airport); else setArriveLoc(airport);
    }
    setLocModal({
      ...locModal,
      isOpen: false
    });
    setLocSearch('');
  };
  const handleSwap = () => {
    setDepartLoc(arriveLoc);
    setArriveLoc(departLoc);
  };
  const handleSwapMulti = idx => {
    const newFlights = [...multiCityFlights];
    const temp = newFlights[idx].from;
    newFlights[idx].from = newFlights[idx].to;
    newFlights[idx].to = temp;
    setMultiCityFlights(newFlights);
  };
  const filteredAirports = airports.filter(a => a.city.toLowerCase().includes(locSearch.toLowerCase()) || a.code.toLowerCase().includes(locSearch.toLowerCase()) || a.country.toLowerCase().includes(locSearch.toLowerCase()));
  const handleDecreaseAdults = () => {
    if (adults > 1) {
      setAdults(adults - 1);
      if (infants > adults - 1) setInfants(adults - 1);
    }
  };
  const handleAddInfant = () => {
    if (infants < adults) setInfants(infants + 1);
  };
  const handleDateSelect = date => {
    if (flightType === 'Return') {
      if (dateConfig.type === 'depart') {
        setDepartDate(date);
        if (returnDate && date > returnDate) setReturnDate(null);
        setDateConfig({
          isOpen: true,
          type: 'return',
          activeMultiIndex: 0
        });
      } else {
        if (date >= departDate) {
          setReturnDate(date);
          setDateConfig({
            isOpen: false,
            type: 'return',
            activeMultiIndex: 0
          });
        }
      }
    } else if (flightType === 'Multi City') {
      const newFlights = [...multiCityFlights];
      newFlights[dateConfig.activeMultiIndex].date = date;
      setMultiCityFlights(newFlights);
      setDateConfig({
        ...dateConfig,
        isOpen: false
      });
    } else {
      setDepartDate(date);
      setDateConfig({
        ...dateConfig,
        isOpen: false
      });
    }
  };
  const calendarMonths = Array.from({
    length: 12
  }).map((_, i) => {
    const d = new Date(2026, 3 + i, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return {
      name: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      days: generateMonthData(d.getFullYear(), d.getMonth())
    };
  });
  const isDateSelected = (date, type) => {
    if (!date) return false;
    if (flightType === 'Multi City') {
      return multiCityFlights[dateConfig.activeMultiIndex]?.date?.getTime() === date.getTime();
    }
    if (type === 'depart') return departDate?.getTime() === date.getTime();
    if (type === 'return') return flightType === 'Return' && returnDate?.getTime() === date.getTime();
    return false;
  };
  const handleSearchSubmit = () => {
    setCurrentView('results');
    setIsModifyingSearch(false);
    setExpandedFlightId(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleUmrahSearchSubmit = () => {
    setCurrentView('umrah_packages');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const toggleFlightExpansion = (flight, legs) => {
    if (expandedFlightId === flight.id) {
      setExpandedFlightId(null);
    } else {
      setExpandedFlightId(flight.id);
      setActiveFareLeg(0);
      const initialFares = {};
      legs.forEach((_, i) => initialFares[i] = 'classic');
      setSelectedFares(initialFares);
      setSelectedFlightForBooking(flight);
    }
  };
  const handleFareSelect = (tierId, legsCount) => {
    setSelectedFares(prev => {
      const next = {
        ...prev,
        [activeFareLeg]: tierId
      };
      return next;
    });
    if (activeFareLeg < legsCount - 1) {
      setTimeout(() => setActiveFareLeg(prev => prev + 1), 250);
    } else {
      // Last leg selected - Auto advance to booking directly
      setTimeout(() => {
        setBookingType('ticket');
        setCurrentView('booking');
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 400);
    }
  };

  // --- Core Filtering Logic ---
  const activeFilteredFlights = useMemo(() => {
    let result = [...mockFlightResults];
    result = result.filter(flight => flight.price <= maxPrice);
    if (!selectedStops.includes('Any')) {
      result = result.filter(flight => {
        if (selectedStops.includes('Non-stop') && flight.stops === 'Non-stop') return true;
        if (selectedStops.includes('1') && flight.stops === '1 Stop') return true;
        if (selectedStops.includes('2') && flight.stops.includes('2')) return true;
        if (selectedStops.includes('3') && flight.stops.includes('3')) return true;
        return false;
      });
    }
    if (selectedAirlines.length > 0) {
      result = result.filter(flight => selectedAirlines.includes(flight.airline.code));
    }
    if (selectedTimes.length > 0) {
      result = result.filter(flight => {
        const [timeStr, modifier] = flight.depTime.split(' ');
        let [hours] = timeStr.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        let timeCat = '';
        if (hours >= 0 && hours < 6) timeCat = 'Morning'; else if (hours >= 6 && hours < 12) timeCat = 'Noon'; else if (hours >= 12 && hours < 18) timeCat = 'Evening'; else timeCat = 'Night';
        return selectedTimes.includes(timeCat);
      });
    }
    if (activeSortTab === 'Cheapest') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSortTab === 'Quickest') {
      result.sort((a, b) => a.durationMins - b.durationMins);
    } else {
      result.sort((a, b) => a.id - b.id);
    }
    return result;
  }, [selectedStops, selectedAirlines, selectedTimes, activeSortTab, maxPrice]);
  const renderDesktopDatePicker = () => {
    const month1 = calendarViewDate;
    const month2 = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1);
    const getMonthName = date => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };
    const handlePrevMonth = e => {
      e.stopPropagation();
      setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1));
    };
    const handleNextMonth = e => {
      e.stopPropagation();
      setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1));
    };
    const renderMonthGrid = monthDate => {
      const days = generateMonthData(monthDate.getFullYear(), monthDate.getMonth());
      return <div className="flex-1">
        <div className="grid grid-cols-7 text-center text-sm font-bold py-3 mb-2 border-b border-slate-200">
          <div className="text-slate-800">Mon</div><div className="text-slate-800">Tue</div><div className="text-slate-800">Wed</div>
          <div className="text-slate-800">Thu</div><div className="text-slate-800">Fri</div><div className="text-slate-800">Sat</div>
          <div className="text-slate-800">Sun</div>
        </div>
        <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center">
          {days.map((date, dIndex) => {
            if (!date) return <div key={`empty-${dIndex}`} className="w-10 h-10"></div>;
            const isDepart = isDateSelected(date, 'depart');
            const isReturn = flightType === 'Return' && isDateSelected(date, 'return');
            const isSelected = isDepart || isReturn;
            let isDisabled = false;
            if (flightType === 'Return' && dateConfig.type === 'return' && departDate) {
              isDisabled = date < departDate;
            }
            return <div key={dIndex} className="relative flex justify-center w-full">
              <button disabled={isDisabled} onClick={e => {
                e.stopPropagation();
                handleDateSelect(date);
              }} className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all text-[15px] ${isSelected ? 'bg-[#1a4484] text-white font-bold shadow-md z-10' : isDisabled ? 'text-slate-300 cursor-not-allowed opacity-50' : 'text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900'}`}>
                {isSelected && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-[2px] rounded-md whitespace-nowrap shadow-sm pointer-events-none z-20 border border-white">
                  {flightType === 'Multi City' ? `Flight ${dateConfig.activeMultiIndex + 1}` : isDepart ? 'Depart' : 'Return'}
                </div>}
                {date.getDate()}
              </button>
            </div>;
          })}
        </div>
      </div>;
    };
    return <div className="hidden md:flex absolute top-[calc(100%+12px)] right-0 w-[680px] lg:w-[740px] rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden bg-white z-[100] flex-col animate-in fade-in slide-in-from-top-2 p-6">
      <div className="relative flex items-center justify-center mb-2 px-1">
        <button onClick={handlePrevMonth} className="absolute left-0 p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-800">
          <ChevronLeft size={22} />
        </button>
        <div className="flex w-full">
          <div className="flex-1 text-center font-bold text-[17px] text-slate-800">{getMonthName(month1)}</div>
          <div className="flex-1 text-center font-bold text-[17px] text-slate-800">{getMonthName(month2)}</div>
        </div>
        <button onClick={handleNextMonth} className="absolute right-0 p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-800">
          <ChevronRight size={22} />
        </button>
      </div>
      <div className="flex gap-8">
        {renderMonthGrid(month1)}
        {renderMonthGrid(month2)}
      </div>
    </div>;
  };

  // --- REUSABLE FLIGHT SEARCH FORM ---
  <div className="flex flex-col gap-4">
    {/* Top Bar: Trip Types & Travelers/Class */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-1 md:mb-2 relative z-30">
      {/* Trip Types */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {['One Way', 'Return', 'Multi City'].map(type => <button key={type} onClick={() => {
          setFlightType(type);
          setDateConfig({
            ...dateConfig,
            isOpen: false
          });
        }} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-sm font-semibold transition-all border ${flightType === type ? 'bg-[#eef4ff] border-[#b0cfff] text-[#1e4687] shadow-sm' : 'bg-transparent border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
          {type}
        </button>)}
      </div>

      {/* Travelers & Class */}
      <div className="hidden md:flex items-center gap-6 z-50">
        {/* Traveler Wrapper */}
        <div className="relative passenger-wrapper">
          <div onClick={() => {
            setIsPassengerModalOpen(!isPassengerModalOpen);
            setIsClassModalOpen(false);
          }} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-[#24529a] font-semibold text-[15px] transition-colors group">
            <User size={18} className="text-[#24529a] group-hover:scale-110 transition-transform" />
            <span>{totalTravelers} Traveler{totalTravelers > 1 ? 's' : ''}</span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isPassengerModalOpen ? 'rotate-180' : ''}`} />
          </div>

          {isPassengerModalOpen && <div className="absolute top-[calc(100%+12px)] right-0 w-[340px] rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden bg-white z-[100] flex-col animate-in fade-in slide-in-from-top-2">
            <div className="p-6 flex flex-col">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-slate-700" />
                  <div>
                    <p className="text-[15px] font-bold text-slate-800 leading-tight">Adults</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">12 years and above</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleDecreaseAdults} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${adults <= 1 ? 'border-slate-200 text-slate-300' : 'border-blue-200 text-[#24529a] hover:bg-blue-50'}`}><Minus size={16} /></button>
                  <span className="w-4 text-center font-bold text-slate-800">{adults}</span>
                  <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-blue-200 text-[#24529a] hover:bg-blue-50 flex items-center justify-center transition-colors"><Plus size={16} /></button>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-slate-700 ml-0.5" />
                  <div>
                    <p className="text-[15px] font-bold text-slate-800 leading-tight">Children</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">2 to 11 years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${children <= 0 ? 'border-slate-200 text-slate-300' : 'border-blue-200 text-[#24529a] hover:bg-blue-50'}`}><Minus size={16} /></button>
                  <span className="w-4 text-center font-bold text-slate-800">{children}</span>
                  <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-blue-200 text-[#24529a] hover:bg-blue-50 flex items-center justify-center transition-colors"><Plus size={16} /></button>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-3">
                  <Baby size={20} className="text-slate-700" />
                  <div>
                    <p className="text-[15px] font-bold text-slate-800 leading-tight">Infants</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">7 days to 23 months</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setInfants(Math.max(0, infants - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${infants <= 0 ? 'border-slate-200 text-slate-300' : 'border-blue-200 text-[#24529a] hover:bg-blue-50'}`}><Minus size={16} /></button>
                  <span className="w-4 text-center font-bold text-slate-800">{infants}</span>
                  <button onClick={handleAddInfant} className={`w-8 h-8 rounded-full border border-[#1a4484] text-[#1a4484] flex items-center justify-center hover:bg-blue-50 transition-colors ${infants >= adults ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsPassengerModalOpen(false)} className="bg-[#1a4484] hover:bg-[#123060] text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm">Done</button>
            </div>
          </div>}
        </div>

        {/* Class Wrapper */}
        <div className="relative class-wrapper">
          <div onClick={() => {
            setIsClassModalOpen(!isClassModalOpen);
            setIsPassengerModalOpen(false);
          }} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-[#24529a] font-semibold text-[15px] transition-colors">
            <span className="capitalize">{flightClass}</span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isClassModalOpen ? 'rotate-180' : ''}`} />
          </div>

          {isClassModalOpen && <div className="absolute top-[calc(100%+12px)] right-0 w-[240px] rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden bg-white z-[100] flex-col animate-in fade-in slide-in-from-top-2">
            <div className="p-4 flex flex-col gap-2">
              {['Economy', 'Premium Economy', 'Business', 'First'].map(cls => <label key={cls} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${flightClass === cls ? 'border-[#1a4484] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`} onClick={() => {
                setFlightClass(cls);
                setIsClassModalOpen(false);
              }}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${flightClass === cls ? 'border-[#1a4484]' : 'border-slate-300'}`}>
                  {flightClass === cls && <div className="w-2 h-2 bg-[#1a4484] rounded-full"></div>}
                </div>
                <span className={`text-[14px] ${flightClass === cls ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'}`}>{cls}</span>
              </label>)}
            </div>
          </div>}
        </div>
      </div>
    </div>

    {/* Main Form Fields */}
    <div className="flex flex-col gap-3 relative z-20">
      {flightType === 'Multi City' ? <div className="space-y-4 md:space-y-3">
        {multiCityFlights.map((flight, idx) => <div key={idx} className="flex flex-col md:flex-row w-full gap-3 md:gap-0 md:bg-white md:border md:border-slate-300 md:rounded-[1.25rem] md:p-1.5 md:shadow-sm md:items-center relative group" style={{
          zIndex: 50 - idx
        }}>

          <div className="md:hidden flex justify-between items-center mb-1 mx-1">
            <p className="text-xs text-slate-500 font-semibold">Flight {idx + 1}</p>
            {idx >= 2 && <button onClick={() => handleRemoveDestination(idx)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Remove</button>}
          </div>

          <div className="loc-picker-wrapper flex flex-col md:flex-row relative w-full md:flex-[2.2] bg-white border border-slate-300 rounded-xl md:border-none md:bg-transparent md:rounded-none shadow-sm md:shadow-none z-50">
            {/* From */}
            <div onClick={() => {
              if (!(locModal.isOpen && locModal.type === 'depart' && locModal.multiIndex === idx)) {
                setLocModal({
                  isOpen: true,
                  type: 'depart',
                  multiIndex: idx
                });
                setLocSearch('');
              }
              setTimeout(() => document.getElementById(`depart-input-multi-${idx}`)?.focus(), 10);
            }} className={`flex-1 flex items-center p-3 border-b md:border-b-0 border-slate-200 cursor-text hover:bg-slate-50 md:rounded-xl transition-colors relative ${locModal.isOpen && locModal.type === 'depart' && locModal.multiIndex === idx ? 'bg-blue-50/50 md:bg-blue-50/50 ring-1 ring-[#24529a] md:ring-0 md:border md:border-[#24529a]' : ''}`}>
              <MapPin className="text-[#24529a] mr-3 flex-shrink-0" size={20} />
              <div className="flex flex-col flex-1 text-left overflow-hidden">
                <span className="text-[10px] md:text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">From</span>
                <span className={`md:hidden w-full font-bold text-sm truncate ${flight.from ? 'text-slate-900' : 'text-slate-400'}`}>
                  {flight.from ? `${flight.from.city} (${flight.from.code})` : 'Where from?'}
                </span>
                <input id={`depart-input-multi-${idx}`} type="text" placeholder="Where from?" value={locModal.isOpen && locModal.type === 'depart' && locModal.multiIndex === idx ? locSearch : flight.from ? `${flight.from.city} (${flight.from.code})` : ''} onChange={e => setLocSearch(e.target.value)} className={`hidden md:block w-full outline-none font-bold text-sm md:text-base truncate bg-transparent placeholder:font-normal placeholder:text-slate-400 ${locModal.isOpen && locModal.type === 'depart' && locModal.multiIndex === idx ? 'text-slate-900' : flight.from ? 'text-slate-900' : 'text-slate-400'}`} />
              </div>
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200"></div>
            </div>
            {/* Swap */}
            <div onClick={e => {
              e.stopPropagation();
              handleSwapMulti(idx);
            }} className="absolute right-4 md:right-auto md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-9 h-9 md:w-8 md:h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md md:shadow-sm text-slate-600 hover:text-[#24529a] hover:border-[#24529a] transition-all cursor-pointer z-10 hover:rotate-180">
              <ArrowRightLeft size={14} className="md:rotate-0 rotate-90" />
            </div>
            {/* To */}
            <div onClick={() => {
              if (!(locModal.isOpen && locModal.type === 'arrive' && locModal.multiIndex === idx)) {
                setLocModal({
                  isOpen: true,
                  type: 'arrive',
                  multiIndex: idx
                });
                setLocSearch('');
              }
              setTimeout(() => document.getElementById(`arrive-input-multi-${idx}`)?.focus(), 10);
            }} className={`flex-1 flex items-center p-3 cursor-text hover:bg-slate-50 md:rounded-xl transition-colors relative md:ml-2 ${locModal.isOpen && locModal.type === 'arrive' && locModal.multiIndex === idx ? 'bg-blue-50/50 md:bg-blue-50/50 ring-1 ring-[#24529a] md:ring-0 md:border md:border-[#24529a]' : ''}`}>
              <MapPin className="text-[#24529a] mr-3 flex-shrink-0" size={20} />
              <div className="flex flex-col flex-1 text-left overflow-hidden">
                <span className="text-[10px] md:text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">To</span>
                <span className={`md:hidden w-full font-bold text-sm truncate ${flight.to ? 'text-slate-900' : 'text-slate-400'}`}>
                  {flight.to ? `${flight.to.city} (${flight.to.code})` : 'Where to?'}
                </span>
                <input id={`arrive-input-multi-${idx}`} type="text" placeholder="Where to?" value={locModal.isOpen && locModal.type === 'arrive' && locModal.multiIndex === idx ? locSearch : flight.to ? `${flight.to.city} (${flight.to.code})` : ''} onChange={e => setLocSearch(e.target.value)} className={`hidden md:block w-full outline-none font-bold text-sm md:text-base truncate bg-transparent placeholder:font-normal placeholder:text-slate-400 ${locModal.isOpen && locModal.type === 'arrive' && locModal.multiIndex === idx ? 'text-slate-900' : flight.to ? 'text-slate-900' : 'text-slate-400'}`} />
              </div>
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200"></div>
            </div>
            {locModal.isOpen && locModal.multiIndex === idx && <LocationDropdown filteredAirports={filteredAirports} handleLocationSelect={handleLocationSelect} />}
          </div>

          <div className="w-full md:w-auto md:flex-1 relative flex items-center gap-2 date-picker-wrapper z-40">
            {/* Date Box */}
            <div onClick={() => setDateConfig({
              isOpen: true,
              type: 'depart',
              activeMultiIndex: idx
            })} className={`w-full flex items-center bg-white border md:border-none border-slate-300 rounded-xl md:rounded-xl p-3 md:p-3 transition-all shadow-sm md:shadow-none h-fit cursor-pointer hover:bg-slate-50 ${dateConfig.isOpen && dateConfig.activeMultiIndex === idx ? 'border-[#24529a] md:border md:border-[#24529a] ring-1 ring-[#24529a] md:ring-0 md:bg-blue-50/50' : 'hover:border-blue-400 md:hover:border-transparent'}`}>
              <Calendar className="text-[#24529a] mr-3 flex-shrink-0" size={20} />
              <div className="flex flex-col flex-1 text-left">
                <span className="text-[10px] md:text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">Date</span>
                <span className="w-full outline-none text-slate-900 font-bold text-sm md:text-base select-none">
                  {formatDate(flight.date)}
                </span>
              </div>
            </div>
            {idx >= 2 && <div onClick={() => handleRemoveDestination(idx)} className="hidden md:flex w-10 h-10 shrink-0 ml-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 items-center justify-center cursor-pointer transition-colors" title="Remove Flight">
              <X size={20} />
            </div>}
            {dateConfig.isOpen && dateConfig.activeMultiIndex === idx && renderDesktopDatePicker()}
          </div>
        </div>)}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mt-4 gap-4">
          {multiCityFlights.length < 6 ? <button onClick={handleAddDestination} className="text-[#24529a] text-sm md:text-base font-bold flex items-center justify-center md:justify-start gap-2 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2.5 md:py-2 rounded-xl md:rounded-lg w-full md:w-auto border border-blue-100">
            <Plus size={18} /> Add Flight
          </button> : <div></div>}

          <button onClick={handleSearchSubmit} className="hidden md:flex flex-shrink-0 bg-transparent text-slate-700 hover:text-[#1a4484] font-bold pl-4 pr-5 py-0 h-[44px] rounded-full items-center justify-center gap-2.5 transition-all duration-300 border border-slate-300 hover:border-[#1a4484] shadow-sm hover:shadow active:scale-95 group">
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#1a4484] flex items-center justify-center transition-colors">
              <Search size={14} strokeWidth={3} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <span className="tracking-wide">Search Flights</span>
          </button>
        </div>
      </div> : (/* ONE WAY / RETURN */
        <div className="flex flex-col md:flex-row w-full gap-3 md:gap-1 md:bg-white md:border md:border-slate-300 md:rounded-[1.25rem] md:p-1.5 md:shadow-md md:items-center relative z-20">
          <div className="loc-picker-wrapper flex flex-col md:flex-row relative w-full md:flex-[2.2] bg-white border border-slate-300 rounded-xl md:border-none md:bg-transparent md:rounded-none shadow-sm md:shadow-none z-50">
            {/* From */}
            <div onClick={() => {
              if (!(locModal.isOpen && locModal.type === 'depart' && locModal.multiIndex === null)) {
                setLocModal({
                  isOpen: true,
                  type: 'depart',
                  multiIndex: null
                });
                setLocSearch('');
              }
              setTimeout(() => document.getElementById('depart-input-main')?.focus(), 10);
            }} className={`flex-1 flex items-center p-3 md:p-3 border-b border-slate-200 md:border-b-0 cursor-text hover:bg-slate-50 md:rounded-xl transition-colors relative group ${locModal.isOpen && locModal.type === 'depart' ? 'bg-blue-50/50 md:bg-blue-50/50 ring-1 md:ring-0 md:border md:border-[#24529a] ring-[#24529a]' : ''}`}>
              <MapPin className="text-[#24529a] mr-3 flex-shrink-0" size={20} />
              <div className="flex flex-col flex-1 text-left overflow-hidden">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">From</span>
                <span className={`md:hidden w-full font-bold text-sm truncate ${departLoc ? 'text-slate-900' : 'text-slate-400'}`}>
                  {departLoc ? `${departLoc.city} (${departLoc.code})` : 'Where from?'}
                </span>
                <input id="depart-input-main" type="text" placeholder="Where from?" value={locModal.isOpen && locModal.type === 'depart' && locModal.multiIndex === null ? locSearch : departLoc ? `${departLoc.city} (${departLoc.code})` : ''} onChange={e => setLocSearch(e.target.value)} className={`hidden md:block w-full outline-none font-bold text-sm md:text-base truncate bg-transparent placeholder:font-normal placeholder:text-slate-400 ${locModal.isOpen && locModal.type === 'depart' && locModal.multiIndex === null ? 'text-slate-900' : departLoc ? 'text-slate-900' : 'text-slate-400'}`} />
              </div>
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200 group-hover:bg-transparent transition-colors"></div>
            </div>

            {/* Swap Button */}
            <div onClick={e => {
              e.stopPropagation();
              handleSwap();
            }} className="absolute right-4 md:right-auto md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-9 h-9 md:w-8 md:h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md md:shadow-sm text-slate-600 hover:text-[#24529a] hover:border-[#24529a] transition-all cursor-pointer z-10 hover:rotate-180">
              <ArrowRightLeft size={14} className="md:rotate-0 rotate-90" />
            </div>

            {/* To */}
            <div onClick={() => {
              if (!(locModal.isOpen && locModal.type === 'arrive' && locModal.multiIndex === null)) {
                setLocModal({
                  isOpen: true,
                  type: 'arrive',
                  multiIndex: null
                });
                setLocSearch('');
              }
              setTimeout(() => document.getElementById('arrive-input-main')?.focus(), 10);
            }} className={`flex-1 flex items-center p-3 md:p-3 cursor-text hover:bg-slate-50 md:rounded-xl transition-colors relative group md:ml-2 ${locModal.isOpen && locModal.type === 'arrive' ? 'bg-blue-50/50 md:bg-blue-50/50 ring-1 md:ring-0 md:border md:border-[#24529a] ring-[#24529a]' : ''}`}>
              <MapPin className="text-[#24529a] mr-3 flex-shrink-0" size={20} />
              <div className="flex flex-col flex-1 text-left overflow-hidden">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">To</span>
                <span className={`md:hidden w-full font-bold text-sm truncate ${arriveLoc ? 'text-slate-900' : 'text-slate-400'}`}>
                  {arriveLoc ? `${arriveLoc.city} (${arriveLoc.code})` : 'Where to?'}
                </span>
                <input id="arrive-input-main" type="text" placeholder="Where to?" value={locModal.isOpen && locModal.type === 'arrive' && locModal.multiIndex === null ? locSearch : arriveLoc ? `${arriveLoc.city} (${arriveLoc.code})` : ''} onChange={e => setLocSearch(e.target.value)} className={`hidden md:block w-full outline-none font-bold text-sm md:text-base truncate bg-transparent placeholder:font-normal placeholder:text-slate-400 ${locModal.isOpen && locModal.type === 'arrive' && locModal.multiIndex === null ? 'text-slate-900' : arriveLoc ? 'text-slate-900' : 'text-slate-400'}`} />
              </div>
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200 group-hover:bg-transparent transition-colors"></div>
            </div>

            {locModal.isOpen && locModal.multiIndex === null && <LocationDropdown filteredAirports={filteredAirports} handleLocationSelect={handleLocationSelect} />}
          </div>

          <div className="flex gap-2 md:gap-0 w-full md:flex-[1.8] relative date-picker-wrapper z-40">
            {/* Depart */}
            <div onClick={() => setDateConfig({
              isOpen: true,
              type: 'depart',
              activeMultiIndex: 0
            })} className={`flex-1 flex items-center bg-white border border-slate-300 rounded-xl md:border-none md:bg-transparent p-3 md:p-3 shadow-sm md:shadow-none cursor-pointer hover:bg-slate-50 md:rounded-xl transition-colors relative group ${dateConfig.isOpen && dateConfig.type === 'depart' ? 'border-[#24529a] md:border md:border-[#24529a] ring-1 ring-[#24529a] md:ring-0 md:bg-blue-50/50' : 'hover:border-blue-400 md:hover:border-transparent'}`}>
              <Calendar className="text-[#24529a] mr-2 md:mr-3 flex-shrink-0" size={20} />
              <div className="flex flex-col flex-1 text-left">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">Depart</span>
                <span className={`w-full font-bold text-sm md:text-base select-none truncate ${departDate ? 'text-slate-900' : 'text-slate-400'}`}>
                  {formatDate(departDate) || 'Select Date'}
                </span>
              </div>
              {flightType === 'Return' && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200 group-hover:bg-transparent transition-colors"></div>}
            </div>

            {/* Return */}
            {flightType === 'Return' && <div onClick={() => setDateConfig({
              isOpen: true,
              type: 'return',
              activeMultiIndex: 0
            })} className={`flex-1 flex items-center bg-white border border-slate-300 rounded-xl md:border-none md:bg-transparent p-3 md:p-3 shadow-sm md:shadow-none cursor-pointer hover:bg-slate-50 md:rounded-xl transition-colors md:ml-2 ${dateConfig.isOpen && dateConfig.type === 'return' ? 'border-[#24529a] md:border md:border-[#24529a] ring-1 ring-[#24529a] md:ring-0 md:bg-blue-50/50' : 'hover:border-blue-400 md:hover:border-transparent'}`}>
              <Calendar className={`mr-2 md:mr-3 flex-shrink-0 ${returnDate || dateConfig.isOpen ? 'text-[#24529a]' : 'text-slate-400'}`} size={20} />
              <div className="flex flex-col flex-1 text-left">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">Return</span>
                <span className={`w-full font-bold text-sm md:text-base select-none truncate ${returnDate ? 'text-slate-900' : 'text-slate-400'}`}>
                  {formatDate(returnDate) || 'Select Date'}
                </span>
              </div>
            </div>}
            {dateConfig.isOpen && flightType !== 'Multi City' && renderDesktopDatePicker()}
          </div>

          <button onClick={handleSearchSubmit} className="hidden md:flex ml-2 flex-shrink-0 bg-transparent text-slate-700 hover:text-[#1a4484] font-bold pl-4 pr-5 py-0 h-[46px] rounded-full items-center justify-center gap-2.5 transition-all duration-300 border border-slate-300 hover:border-[#1a4484] shadow-sm hover:shadow active:scale-95 group">
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#1a4484] flex items-center justify-center transition-colors">
              <Search size={14} strokeWidth={3} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <span className="tracking-wide">Search</span>
          </button>
        </div>)}

      {/* Mobile Only: Passengers, Class & Search */}
      <div className="md:hidden flex gap-2 mt-1 relative z-10">
        <div onClick={() => setIsPassengerModalOpen(true)} className={`flex-[1.5] flex items-center bg-white border rounded-xl p-3.5 transition-all shadow-sm cursor-pointer ${isPassengerModalOpen ? 'border-[#24529a] ring-1 ring-[#24529a]' : 'border-slate-300'}`}>
          <Users className="text-[#24529a] mr-2 flex-shrink-0" size={18} />
          <span className="w-full text-slate-800 font-medium text-sm truncate">
            {totalTravelers} Traveler{totalTravelers > 1 ? 's' : ''}
          </span>
          <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
        </div>
        <div onClick={() => setIsClassModalOpen(true)} className={`flex-1 flex items-center bg-white border rounded-xl p-3.5 transition-all shadow-sm cursor-pointer ${isClassModalOpen ? 'border-[#24529a] ring-1 ring-[#24529a]' : 'border-slate-300'}`}>
          <span className="w-full text-slate-800 font-medium text-sm truncate capitalize">
            {flightClass}
          </span>
          <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
        </div>
      </div>
      <div className="md:hidden mt-2 relative z-10">
        <button onClick={handleSearchSubmit} className="w-full bg-transparent text-slate-700 hover:text-[#1a4484] font-bold py-2.5 rounded-full flex items-center justify-center gap-2.5 transition-all duration-300 border border-slate-300 hover:border-[#1a4484] shadow-sm hover:shadow active:scale-[0.98] group">
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#1a4484] flex items-center justify-center transition-colors">
            <Search size={14} strokeWidth={3} className="text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <span className="tracking-wide">Search</span>
        </button>
      </div>

    </div>
  </div>;

  // --- REUSABLE UMRAH SEARCH FORM --