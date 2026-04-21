import { BookingView } from './pages/BookingView';
import { BranchesView } from './pages/BranchesView';
import { ContactView } from './pages/ContactView';
import { AboutView } from './pages/AboutView';
import { RegistrationView } from './pages/RegistrationView';
import { PrivacyView } from './pages/PrivacyView';
import { TermsView } from './pages/TermsView';
import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, Users, Phone, MessageCircle, Headset, Zap, ShieldCheck, ChevronRight, ChevronLeft, Clock, X, Play, ChevronDown, Building2, Plane, Moon, Compass, User, Baby, Star, Sparkles, Loader2, Filter, Check, Briefcase, CheckCircle2, ArrowRightLeft, ArrowLeft, Plus, Minus, ArrowRight, BedDouble } from 'lucide-react';
import { ReviewsView } from './pages/ReviewsView';
import BlogPage from './pages/BlogsPage';
import BlogView from './pages/BlogView';
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
      case '/register-agent': return 'register_agent';
      case '/register-branch': return 'register_branch';
      case '/reviews': return 'reviews';
      case '/blogs': return 'blogs';
      case '/blog-view': return 'blogview';
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
      case 'register_agent': path = '/register-agent'; break;
      case 'register_branch': path = '/register-branch'; break;
      case 'reviews': path = '/reviews'; break;
      case 'blogs': path = '/blogs'; break;
      case 'blogview': path = '/blog-view'; break;
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


  const toggleFilter = (setter, item) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };
  const clearAllFilters = () => {
    setSelectedStops(['Any']);
    setSelectedAirlines([]);
    setSelectedTimes([]);
    setMaxPrice(500000);
  };

  // --- Auto-play sliders for Mobile ---
  useEffect(() => {
    const holidayInterval = setInterval(() => {
      setCurrentHolidayIndex(prev => (prev + 1) % recommendedHolidays.length);
    }, 4500);
    const videoInterval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % videos.length);
    }, 6000);
    const blogInterval = setInterval(() => {
      setCurrentBlogIndex(prev => (prev + 1) % (blogs?.length || 1));
    }, 5000);

    return () => {
      clearInterval(holidayInterval);
      clearInterval(videoInterval);
      clearInterval(blogInterval);
    };
  }, []);

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
      }, 100);
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
  const flightSearchForm = <div className="flex flex-col gap-4">
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

  // --- REUSABLE UMRAH SEARCH FORM ---
  const umrahSearchForm = <div className="flex flex-col gap-4">
    {/* Top Bar: Package Types & Travelers */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-1 md:mb-2 relative z-30">
      <div className="relative w-full md:w-auto">
        <div className="flex overflow-x-auto gap-1.5 md:gap-2 w-full pr-8 md:pr-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {['Economy', 'Standard', 'Premium', 'VIP'].map(type => <button key={type} onClick={() => setUmrahPackageType(type)} className={`whitespace-nowrap flex-shrink-0 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-[13px] md:text-sm font-semibold transition-all border ${umrahPackageType === type ? 'bg-[#eef4ff] border-[#b0cfff] text-[#1e4687] shadow-sm' : 'bg-transparent border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
            {type}
          </button>)}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden flex items-center justify-end">
          <ChevronRight size={16} className="text-slate-400 opacity-80 animate-pulse mr-0.5" />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 lg:gap-6 z-50 flex-shrink-0 md:ml-auto md:pl-4">
        <div className="relative umrah-passenger-wrapper">
          <div onClick={() => {
            setIsUmrahPaxModalOpen(!isUmrahPaxModalOpen);
            setIsUmrahRoomModalOpen(false);
          }} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-[#24529a] font-semibold text-[15px] transition-colors group">
            <Users size={18} className="text-[#24529a] group-hover:scale-110 transition-transform" />
            <span>{totalUmrahTravelers} Pilgrim{totalUmrahTravelers > 1 ? 's' : ''}</span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isUmrahPaxModalOpen ? 'rotate-180' : ''}`} />
          </div>

          {isUmrahPaxModalOpen && <div className="absolute top-[calc(100%+12px)] right-0 w-[340px] rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden bg-white z-[100] flex-col animate-in fade-in slide-in-from-top-2">
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
                  <button onClick={() => setUmrahAdults(Math.max(1, umrahAdults - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${umrahAdults <= 1 ? 'border-slate-200 text-slate-300' : 'border-blue-200 text-[#24529a] hover:bg-blue-50'}`}><Minus size={16} /></button>
                  <span className="w-4 text-center font-bold text-slate-800">{umrahAdults}</span>
                  <button onClick={() => setUmrahAdults(umrahAdults + 1)} className="w-8 h-8 rounded-full border border-blue-200 text-[#24529a] hover:bg-blue-50 flex items-center justify-center transition-colors"><Plus size={16} /></button>
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
                  <button onClick={() => setUmrahChildren(Math.max(0, umrahChildren - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${umrahChildren <= 0 ? 'border-slate-200 text-slate-300' : 'border-blue-200 text-[#24529a] hover:bg-blue-50'}`}><Minus size={16} /></button>
                  <span className="w-4 text-center font-bold text-slate-800">{umrahChildren}</span>
                  <button onClick={() => setUmrahChildren(umrahChildren + 1)} className="w-8 h-8 rounded-full border border-blue-200 text-[#24529a] hover:bg-blue-50 flex items-center justify-center transition-colors"><Plus size={16} /></button>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-3">
                  <Baby size={20} className="text-slate-700" />
                  <div>
                    <p className="text-[15px] font-bold text-slate-800 leading-tight">Infants</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Under 2 years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setUmrahInfants(Math.max(0, umrahInfants - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${umrahInfants <= 0 ? 'border-slate-200 text-slate-300' : 'border-blue-200 text-[#24529a] hover:bg-blue-50'}`}><Minus size={16} /></button>
                  <span className="w-4 text-center font-bold text-slate-800">{umrahInfants}</span>
                  <button onClick={() => setUmrahInfants(umrahInfants + 1)} className={`w-8 h-8 rounded-full border border-[#1a4484] text-[#1a4484] flex items-center justify-center hover:bg-blue-50 transition-colors ${umrahInfants >= umrahAdults ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsUmrahPaxModalOpen(false)} className="bg-[#1a4484] hover:bg-[#123060] text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm">Done</button>
            </div>
          </div>}
        </div>

        <div className="relative umrah-room-wrapper">
          <div onClick={() => {
            setIsUmrahRoomModalOpen(!isUmrahRoomModalOpen);
            setIsUmrahPaxModalOpen(false);
          }} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-[#24529a] font-semibold text-[15px] transition-colors group">
            <BedDouble size={18} className="text-[#24529a] group-hover:scale-110 transition-transform" />
            <span>{umrahRoomType} Sharing</span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isUmrahRoomModalOpen ? 'rotate-180' : ''}`} />
          </div>

          {isUmrahRoomModalOpen && <div className="absolute top-[calc(100%+12px)] right-0 w-[240px] rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden bg-white z-[100] flex-col animate-in fade-in slide-in-from-top-2 p-4 gap-2">
            {['Quad', 'Triple', 'Double', 'Single'].map(room => <label key={room} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors mb-2 last:mb-0 ${umrahRoomType === room ? 'border-[#1a4484] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`} onClick={() => {
              setUmrahRoomType(room);
              setIsUmrahRoomModalOpen(false);
            }}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${umrahRoomType === room ? 'border-[#1a4484]' : 'border-slate-300'}`}>
                {umrahRoomType === room && <div className="w-2 h-2 bg-[#1a4484] rounded-full"></div>}
              </div>
              <span className={`text-[14px] ${umrahRoomType === room ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'}`}>{room} Sharing</span>
            </label>)}
          </div>}
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3 relative z-20">
      <div className="flex flex-col md:flex-row w-full gap-3 md:gap-1 md:bg-white md:border md:border-slate-300 md:rounded-[1.25rem] md:p-1.5 md:shadow-md md:items-center relative z-20">
        <div className="loc-picker-wrapper flex relative w-full md:flex-[1.2] min-w-0 bg-white border border-slate-300 rounded-xl md:border-none md:bg-transparent md:rounded-none shadow-sm md:shadow-none z-50">
          <div onClick={() => {
            if (!(locModal.isOpen && locModal.type === 'umrah-depart')) {
              setLocModal({
                isOpen: true,
                type: 'umrah-depart',
                multiIndex: null
              });
              setLocSearch('');
            }
            setTimeout(() => document.getElementById('umrah-depart-input')?.focus(), 10);
          }} className={`flex-1 flex items-center p-3 md:p-3 cursor-text hover:bg-slate-50 rounded-xl md:rounded-xl transition-colors relative group ${locModal.isOpen && locModal.type === 'umrah-depart' ? 'bg-blue-50/50 md:bg-blue-50/50 ring-1 md:ring-0 md:border md:border-[#24529a] ring-[#24529a]' : ''}`}>
            <MapPin className="text-[#24529a] mr-3 flex-shrink-0" size={20} />
            <div className="flex flex-col flex-1 text-left overflow-hidden">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">Departing</span>
              <span className={`md:hidden w-full font-bold text-sm truncate ${umrahDepartLoc ? 'text-slate-900' : 'text-slate-400'}`}>
                {umrahDepartLoc ? `${umrahDepartLoc.city} (${umrahDepartLoc.code})` : 'Where from?'}
              </span>
              <input id="umrah-depart-input" type="text" placeholder="Where from?" value={locModal.isOpen && locModal.type === 'umrah-depart' ? locSearch : umrahDepartLoc ? `${umrahDepartLoc.city} (${umrahDepartLoc.code})` : ''} onChange={e => setLocSearch(e.target.value)} className={`hidden md:block w-full outline-none font-bold text-sm md:text-base truncate bg-transparent placeholder:font-normal placeholder:text-slate-400 ${locModal.isOpen && locModal.type === 'umrah-depart' ? 'text-slate-900' : umrahDepartLoc ? 'text-slate-900' : 'text-slate-400'}`} />
            </div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200 group-hover:bg-transparent transition-colors"></div>
          </div>

          {locModal.isOpen && locModal.type === 'umrah-depart' && <LocationDropdown filteredAirports={filteredAirports} handleLocationSelect={handleLocationSelect} />}
        </div>

        <div className="flex gap-2 md:gap-0 w-full md:flex-[2.2] min-w-0 relative z-40">
          <div className="flex-1 min-w-0 flex items-center bg-white border border-slate-300 rounded-xl md:border-none md:bg-transparent p-3 md:p-3 shadow-sm md:shadow-none cursor-pointer hover:bg-slate-50 md:rounded-xl transition-colors relative group umrah-days-wrapper">
            <div className="flex flex-1 items-center overflow-hidden" onClick={() => setIsUmrahDaysModalOpen(!isUmrahDaysModalOpen)}>
              <Moon className="text-[#24529a] mr-2 md:mr-3 flex-shrink-0" size={20} />
              <div className="flex flex-col flex-1 text-left relative overflow-hidden">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">Duration</span>
                <span className="w-full font-bold text-sm md:text-base text-slate-900 truncate pr-2 md:pr-6">{umrahDays}</span>
              </div>
            </div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200 group-hover:bg-transparent transition-colors pointer-events-none"></div>
            {isUmrahDaysModalOpen && <div className="hidden md:flex absolute top-[calc(100%+12px)] left-0 w-full md:w-[220px] rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden bg-white z-[100] flex-col animate-in fade-in slide-in-from-top-2 p-2">
              {['7 Days', '10 Days', '14 Days', '15 Days', '21 Days', '28 Days', 'Custom'].map(day => <div key={day} onClick={e => {
                e.stopPropagation();
                setUmrahDays(day);
                setIsUmrahDaysModalOpen(false);
              }} className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold cursor-pointer transition-colors ${umrahDays === day ? 'bg-blue-50 text-[#1a4484]' : 'text-slate-700 hover:bg-slate-50'}`}>
                {day}
              </div>)}
            </div>}
          </div>

          <div className={`flex-1 min-w-0 flex items-center bg-white border border-slate-300 rounded-xl md:border-none md:bg-transparent p-3 md:p-3 shadow-sm md:shadow-none cursor-text hover:bg-slate-50 md:rounded-xl transition-colors relative group md:ml-2 umrah-month-wrapper ${isUmrahMonthModalOpen ? 'bg-blue-50/50 md:bg-blue-50/50 ring-1 md:ring-0 md:border md:border-[#24529a] ring-[#24529a]' : ''}`} onClick={() => {
            if (!isUmrahMonthModalOpen) {
              setIsUmrahMonthModalOpen(true);
              setUmrahMonthSearch('');
            }
            setTimeout(() => document.getElementById('umrah-month-input')?.focus(), 10);
          }}>
            <Calendar className="text-[#24529a] mr-2 md:mr-3 flex-shrink-0" size={20} />
            <div className="flex flex-col flex-1 text-left relative overflow-hidden">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest leading-none mb-1">When</span>
              <span className="md:hidden w-full font-bold text-sm truncate text-slate-900">{umrahMonth}</span>
              <input id="umrah-month-input" type="text" placeholder="Search month..." value={isUmrahMonthModalOpen ? umrahMonthSearch : umrahMonth} onChange={e => setUmrahMonthSearch(e.target.value)} className="hidden md:block w-full outline-none font-bold text-sm md:text-[15px] truncate bg-transparent placeholder:font-normal placeholder:text-slate-400 text-slate-900" />
            </div>
            {isUmrahMonthModalOpen && <div className="hidden md:flex absolute top-[calc(100%+12px)] right-0 w-full md:w-[300px] rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden bg-white z-[100] flex-col animate-in fade-in slide-in-from-top-2 p-2">
              <div className="max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {filteredUmrahMonths.map(month => <div key={month} onClick={e => {
                  e.stopPropagation();
                  setUmrahMonth(month);
                  setIsUmrahMonthModalOpen(false);
                  setUmrahMonthSearch('');
                }} className={`px-4 py-3 rounded-xl text-[14px] cursor-pointer transition-colors flex items-center justify-between ${umrahMonth === month ? 'bg-blue-50 text-[#1a4484] font-bold' : 'text-slate-700 font-medium hover:bg-slate-50'}`}>
                  <span className="truncate">{month}</span>
                  {umrahMonth === month && <Check size={16} className="flex-shrink-0" />}
                </div>)}
                {filteredUmrahMonths.length === 0 && <div className="text-center py-4 text-slate-500 text-sm">No matching months</div>}
              </div>
            </div>}
          </div>
        </div>

        <button onClick={handleUmrahSearchSubmit} className="hidden md:flex ml-2 flex-shrink-0 bg-transparent text-slate-700 hover:text-[#1a4484] font-bold pl-4 pr-5 py-0 h-[46px] rounded-full items-center justify-center gap-2.5 transition-all duration-300 border border-slate-300 hover:border-[#1a4484] shadow-sm hover:shadow active:scale-95 group">
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#1a4484] flex items-center justify-center transition-colors">
            <Search size={14} strokeWidth={3} className="text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <span className="tracking-wide">Search Packages</span>
        </button>
      </div>

      <div className="md:hidden flex gap-2 mt-1 relative z-10">
        <div onClick={() => setIsUmrahPaxModalOpen(true)} className="flex-[1.5] flex items-center bg-white border border-slate-300 rounded-xl p-3.5 transition-all shadow-sm cursor-pointer">
          <Users className="text-[#24529a] mr-2 flex-shrink-0" size={18} />
          <span className="w-full text-slate-800 font-medium text-sm truncate">
            {totalUmrahTravelers} Pilgrim{totalUmrahTravelers > 1 ? 's' : ''}
          </span>
          <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
        </div>
        <div onClick={() => setIsUmrahRoomModalOpen(true)} className="flex-1 flex items-center bg-white border border-slate-300 rounded-xl p-3.5 transition-all shadow-sm cursor-pointer">
          <BedDouble className="text-[#24529a] mr-2 flex-shrink-0" size={18} />
          <span className="w-full text-slate-800 font-medium text-sm truncate">
            {umrahRoomType}
          </span>
          <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
        </div>
      </div>
      <div className="md:hidden mt-2 relative z-10">
        <button onClick={handleUmrahSearchSubmit} className="w-full bg-transparent text-slate-700 hover:text-[#1a4484] font-bold py-2.5 rounded-full flex items-center justify-center gap-2.5 transition-all duration-300 border border-slate-300 hover:border-[#1a4484] shadow-sm hover:shadow active:scale-[0.98] group">
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#1a4484] flex items-center justify-center transition-colors">
            <Search size={14} strokeWidth={3} className="text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <span className="tracking-wide">Search Packages</span>
        </button>
      </div>
    </div>
  </div>;


  // --- SUPPORT WIDGET (REUSABLE) ---
  const supportWidget = <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden mb-6 relative">
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-full blur-xl -mr-10 -mt-10 pointer-events-none"></div>
    <div className="p-5">
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1a4484] shadow-sm">
          <Headset size={20} strokeWidth={2} />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-[16px]">24/7 HELPLINE</h4>
          <p className="text-[16px] font-black text-slate-800 transition-colors leading-none tracking-tight" style={{
            fontFamily: "'Montserrat', sans-serif"
          }}>0300-0701506</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 relative z-10">
        <a href="tel:+923000701506" className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-[#1a4484] bg-white p-3 rounded-xl transition-colors border border-slate-100 shadow-sm hover:shadow">
          <Phone size={16} className="text-[#1a4484]" />
          <span style={{
            fontFamily: "'Montserrat', sans-serif"
          }} className="font-bold tracking-tight">0300-0701506</span>
        </a>
        <a href="https://wa.me/923000701506" className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-[#20bd5a] bg-white p-3 rounded-xl transition-colors border border-slate-100 shadow-sm hover:shadow">
          <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp Us
        </a>
      </div>
    </div>
  </div>;

  // --- REUSABLE CORE FILTERS (Price, Stops, Time, Airlines) ---
  const filtersCore = <>
    {/* Price Filter */}
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-5">
      <h4 className="font-bold text-slate-800 mb-6">Max Price</h4>
      <input type="range" min="90000" max="500000" step="1000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a4484] mb-4" />
      <div className="flex justify-between text-xs font-semibold text-slate-500">
        <span>PKR 90,000</span>
        <span>Up to PKR {maxPrice.toLocaleString()}</span>
      </div>
    </div>

    {/* Stops Filter */}
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-5">
      <h4 className="font-bold text-slate-800 mb-4">Number of Layovers</h4>
      <div className="flex gap-2">
        {['Non-stop', '1', '2', '3', 'Any'].map(stop => <button key={stop} onClick={() => {
          if (stop === 'Any') setSelectedStops(['Any']); else {
            let newStops = selectedStops.filter(s => s !== 'Any');
            if (newStops.includes(stop)) newStops = newStops.filter(s => s !== stop); else newStops.push(stop);
            setSelectedStops(newStops.length === 0 ? ['Any'] : newStops);
          }
        }} className={`flex-1 py-2 px-1 text-xs font-bold rounded-lg border transition-all ${selectedStops.includes(stop) ? 'bg-[#1a4484] text-white border-[#1a4484] shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1a4484] hover:text-[#1a4484]'}`}>
          {stop}
        </button>)}
      </div>
    </div>

    {/* Time Filter */}
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-5">
      <h4 className="font-bold text-slate-800 mb-4">Departure Time</h4>
      <div className="grid grid-cols-2 gap-2">
        {[{
          id: 'Morning',
          icon: Moon,
          range: '00:00 - 06:00'
        }, {
          id: 'Noon',
          icon: Sun,
          range: '06:00 - 12:00'
        }, {
          id: 'Evening',
          icon: Sunset,
          range: '12:00 - 18:00'
        }, {
          id: 'Night',
          icon: Moon,
          range: '18:00 - 24:00'
        }].map(time => {
          const Icon = time.icon;
          const isSelected = selectedTimes.includes(time.id);
          return <div key={time.id} onClick={() => toggleFilter(setSelectedTimes, time.id)} className={`border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors group ${isSelected ? 'bg-blue-50/50 border-[#1a4484]' : 'border-slate-200 hover:border-[#1a4484]'}`}>
            <Icon size={20} className={`mb-1 transition-colors ${isSelected ? 'text-[#1a4484]' : 'text-slate-400 group-hover:text-[#1a4484]'}`} />
            <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{time.id}</span>
            <span className={`text-[10px] transition-colors ${isSelected ? 'text-slate-500' : 'text-slate-400'}`}>{time.range}</span>
          </div>;
        })}
      </div>
    </div>

    {/* Airlines Filter */}
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-5">
      <h4 className="font-bold text-slate-800 mb-4">Airlines</h4>
      <div className="flex flex-col gap-3">
        {mockAirlines.map(airline => <div key={airline.code} className="flex items-center justify-between cursor-pointer group" onClick={() => toggleFilter(setSelectedAirlines, airline.code)}>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAirlines.includes(airline.code) ? 'border-[#1a4484] bg-[#1a4484] text-white' : 'border-slate-300 group-hover:border-[#1a4484]'}`}>
              {selectedAirlines.includes(airline.code) && <Check size={14} />}
            </div>
            <span className={`text-sm font-medium transition-colors ${selectedAirlines.includes(airline.code) ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>{airline.name}</span>
          </div>
        </div>)}
      </div>
    </div>
  </>;

  // --- REUSABLE DESKTOP FILTERS COMPONENT (Includes Support Widget) ---
  const filtersContentDesktop = <>
    {supportWidget}
    {filtersCore}
  </>;

  // --- BOOKING VIEW (PASSENGER DETAILS) ---

  return <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
    <style>{`
                                  @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@600;700;800&family=Roboto+Slab:wght@600;700;800&family=Montserrat:wght@700;800;900&display=swap');
                                `}</style>

    {/* 1. Header Navigation */}
    <nav className="sticky top-0 z-50 w-full bg-white backdrop-blur-md border-b border-slate-200 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => {
            setCurrentView('home');
            setIsModifyingSearch(false);
            setExpandedFlightId(null);
            window.scrollTo(0, 0);
          }}>
            <BrandLogo />
          </div>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {/* Support / Helpline */}
            <button onClick={() => setShowSupportPopup(true)} className="flex items-center gap-3 group py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 bg-transparent text-left">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 group-hover:border-[#1a4484] group-hover:text-[#1a4484] transition-all shadow-sm">
                <Headset size={16} strokeWidth={2} />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
                </span>
              </div>
              <div className="flex flex-col pr-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 group-hover:text-[#1a4484] transition-colors">24/7 HELPLINE</span>
                <span className="text-[14px] font-black text-slate-800 group-hover:text-[#1a4484] transition-colors leading-none tracking-tight" style={{
                  fontFamily: "'Montserrat', sans-serif"
                }}>0300-0701506</span>
              </div>
            </button>

            {/* Manage Bookings */}
            <button onClick={() => {
              setCurrentView('manage_bookings');
              window.scrollTo(0, 0);
            }} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[14px] font-bold text-slate-700 hover:text-[#1a4484] transition-colors group bg-transparent">
              <Briefcase size={18} className="text-slate-400 group-hover:text-[#1a4484] transition-colors" strokeWidth={2} />
              Manage Bookings
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {/* Sign In */}
            <button onClick={() => setIsSignInOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[14px] font-bold text-slate-700 hover:text-[#1a4484] transition-colors group bg-transparent">
              <User size={18} className="text-slate-400 group-hover:text-[#1a4484] transition-colors" strokeWidth={2} />
              Sign In
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="lg:hidden flex items-center gap-4 sm:gap-6 mt-1">
            <button onClick={() => setShowSupportPopup(true)} className="flex flex-col items-center justify-center gap-1.5 group transition-colors bg-transparent">
              <div className="relative">
                <Headset size={20} strokeWidth={2} className="text-slate-600 group-hover:text-[#1a4484] transition-colors sm:w-6 sm:h-6" />
                <span className="absolute -top-0.5 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-white"></span>
                </span>
              </div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-[#1a4484]">Support</span>
            </button>
            <button onClick={() => {
              setCurrentView('manage_bookings');
              window.scrollTo(0, 0);
            }} className="flex flex-col items-center justify-center gap-1.5 group transition-colors">
              <Briefcase size={18} strokeWidth={2} className="text-slate-600 group-hover:text-[#1a4484] transition-colors sm:w-5 sm:h-5 mt-[1px]" />
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-[#1a4484]">Bookings</span>
            </button>
            <button onClick={() => setIsSignInOpen(true)} className="flex flex-col items-center justify-center gap-1.5 group transition-colors">
              <User size={20} strokeWidth={2} className="text-slate-600 group-hover:text-[#1a4484] transition-colors sm:w-6 sm:h-6" />
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-[#1a4484]">Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Conditional Views */}
    {currentView === 'home' ? <>
      {/* 2. Hero Section */}
      <section className="relative w-full z-[60]">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-0">
          <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Mecca background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/90"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 md:h-40 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-0"></div>
        </div>

        <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-6 md:pb-8">
          <div className="text-center mb-6 md:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
              Find your path
            </h1>
          </div>

          {/* Search Widget */}
          <div className="max-w-[1100px] mx-auto bg-white/10 backdrop-blur-xl rounded-[2rem] p-2 md:p-4 border border-white/20 shadow-2xl transition-all duration-500 mb-2 md:mb-4">

            {/* Main Tabs */}
            <div className="flex overflow-x-auto gap-1 md:gap-2 mb-3 p-1.5 bg-slate-900/30 rounded-full border border-white/10 shadow-inner [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                return <button key={tab.name} onClick={() => navigate('/#' + tab.name.replace(/\s+/g, ''))} className={`group whitespace-nowrap px-4 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 flex-1 sm:flex-none text-center flex items-center justify-center gap-1.5 md:gap-2 ${isActive ? 'bg-white text-blue-700 shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
                  <Icon size={16} className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
                  <span>{tab.name}</span>
                </button>;
              })}
            </div>

            {/* Conditional Forms */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:px-8 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 mt-2 relative z-20">
              {activeTab === 'Flights' ? flightSearchForm : activeTab === 'Umrah Packages' ? umrahSearchForm : activeTab === 'AI Planner' ? <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                {!aiResult ? <>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 md:p-5 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1a4484] flex items-center justify-center flex-shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-bold text-lg mb-1">AI Spiritual Journey Planner</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">Tell us about your ideal Umrah journey. Who are you traveling with? What are your spiritual goals? Our Gemini AI will craft a personalized itinerary just for you.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g., I'm planning a 14-day trip in Ramadan with my elderly parents. We need wheelchair access and want to spend the last 10 days in Madinah..." className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#24529a] focus:ring-1 focus:ring-[#24529a] transition-all outline-none text-sm md:text-base resize-none" />
                  </div>
                  {aiError && <div className="text-red-500 text-sm font-semibold px-2">{aiError}</div>}
                  <button onClick={handleAIGenerate} disabled={aiLoading || !aiPrompt.trim()} className="w-full bg-[#224f92] hover:bg-[#1a3d72] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                    {aiLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    {aiLoading ? 'Crafting your journey...' : 'Generate Custom Itinerary ✨'}
                  </button>
                </> : <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#1a4484]">{aiResult.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{aiResult.summary}</p>
                    </div>
                    <button onClick={() => setAiResult(null)} className="text-slate-400 hover:text-slate-700 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 md:p-6 max-h-[350px] overflow-y-auto space-y-6">
                    {aiResult.itinerary.map((day, idx) => <div key={idx} className="relative pl-6 before:absolute before:left-1 before:top-1.5 before:w-2.5 before:h-2.5 before:bg-[#24529a] before:rounded-full after:absolute after:left-[7px] after:top-5 after:bottom-[-24px] last:after:hidden after:w-0.5 after:bg-slate-200">
                      <span className="text-[11px] font-bold text-[#24529a] uppercase tracking-widest block mb-1">{day.day} - {day.location}</span>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{day.activities}</p>
                    </div>)}
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2 pt-4 border-t border-slate-100">
                    <div className="flex flex-col w-full md:w-auto text-center md:text-left">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Est. Budget</span>
                      <span className="text-[#1a4484] font-bold text-lg">{aiResult.estimatedBudget}</span>
                    </div>
                    <div className="flex w-full md:w-auto gap-3">
                      <button onClick={() => setAiResult(null)} className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Adjust Plan</button>
                      <button className="flex-1 md:flex-none bg-[#224f92] hover:bg-[#1a3d72] text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md active:scale-[0.98]">Book this Plan</button>
                    </div>
                  </div>
                </div>}
              </div> : <div className="flex flex-col gap-4 text-center py-8">
                <p className="text-slate-500 font-medium">This module is coming soon.</p>
              </div>}
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Premium Support Banner */}
      <section className="pt-4 md:pt-6 pb-4 bg-slate-50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0B1A28] via-[#11273d] to-[#0B1A28] rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative z-10">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Headset className="w-8 h-8 text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-[#0B1A28] rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-1.5">
                  <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight">Need expert assistance?</h3>
                  <span className="hidden md:inline-flex bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-500/20 uppercase tracking-widest items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Online
                  </span>
                </div>
                <p className="text-slate-400 text-sm md:text-base font-medium">Our Umrah advisors are ready to help you plan your perfect spiritual journey.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-fit relative z-10 p-1.5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] mx-auto lg:mx-0">
              <div className="px-4 md:px-5 flex items-center gap-3 border-r border-white/10">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden sm:block">24/7 HELPLINE</span>
                <span className="text-white font-bold tracking-wider text-sm md:text-[18px]" style={{
                  fontFamily: "'Montserrat', sans-serif"
                }}>0300-0701506</span>
              </div>
              <div className="flex items-center gap-1.5 pr-1">
                <a href="tel:+923000701506" title="Call Us" className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-900 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-95 group">
                  <Phone className="w-4 h-4 group-hover:animate-bounce" />
                </a>
                <a href="https://wa.me/923000701506" title="WhatsApp Us" className="w-10 h-10 flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] active:scale-95 group">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deals & Offers */}
      <section className="py-8 md:py-12 lg:py-16 bg-slate-50 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4 md:gap-6 max-w-7xl mx-auto">
            <div className="text-left max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-1 md:mb-2">Deals & Offers</h2>
              <p className="text-sm md:text-base text-slate-500">Exclusive packages and discounted rates for your spiritual journey.</p>
            </div>
          </div>

          <div className="hidden md:flex overflow-hidden relative w-full py-4 group">
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="flex gap-5 w-max animate-scroll-deals hover:[animation-play-state:paused]">
              {[...recommendedHolidays, ...recommendedHolidays].map((item, idx) => <div key={idx} className="w-[280px] lg:w-[320px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1">
                <div className="h-44 overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-[#1a4484] text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                      {item.days}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Star size={10} className="fill-white" /> {item.rating}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors leading-tight line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex justify-between items-end pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Starts From</span>
                      <span className="text-blue-600 font-bold text-base lg:text-lg leading-none">{item.price}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>)}
            </div>
          </div>

          <div className="md:hidden relative w-full h-[340px] overflow-hidden max-w-sm mx-auto">
            {recommendedHolidays.map((item, idx) => {
              let position = 'translate-x-full opacity-0';
              if (idx === currentHolidayIndex) {
                position = 'translate-x-0 opacity-100 z-10';
              } else if (idx === (currentHolidayIndex - 1 + recommendedHolidays.length) % recommendedHolidays.length) {
                position = '-translate-x-full opacity-0 z-0';
              }
              return <div key={idx} className={`absolute inset-0 transition-all duration-700 ease-in-out ${position} pb-8`}>
                <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 w-full group">
                  <div className="h-44 overflow-hidden relative flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-md text-[#1a4484] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md">
                        {item.days}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-[11px] font-bold px-2 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                      <Star size={12} className="fill-white" /> {item.rating}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col relative flex-grow justify-between">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-end mt-2 pt-3 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Starts From</span>
                        <span className="text-blue-600 font-bold text-lg leading-none">{item.price}</span>
                      </div>
                      <span className="text-blue-600 font-semibold text-sm flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                        Book <ChevronRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>;
            })}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {recommendedHolidays.map((_, idx) => <button key={idx} onClick={() => setCurrentHolidayIndex(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentHolidayIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300'}`} />)}
            </div>
          </div>
        </div>
      </section>

      {/* 4. App Download Section */}
      <section className="py-6 md:py-10 bg-slate-50 relative">
        <style>{`
                                        @keyframes float-phone-compact {
                                          0% { transform: translateY(0px) rotate(-4deg); }
                                          50% { transform: translateY(-10px) rotate(-2deg); }
                                          100% { transform: translateY(0px) rotate(-4deg); }
                                        }
                                        .animate-float-phone-compact {
                                          animation: float-phone-compact 6s ease-in-out infinite;
                                        }
                                      `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0B1A28] via-[#0f2136] to-[#0B1A28] rounded-[2rem] shadow-2xl border border-slate-800 relative overflow-hidden group min-h-[260px] md:min-h-[300px] flex flex-col md:flex-row items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-100 [mask-image:radial-gradient(circle_at_center,black_40%,transparent_90%)] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/20 to-indigo-600/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-emerald-500/10 to-teal-400/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[90px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="absolute right-[30%] top-[10%] text-white/[0.03] pointer-events-none" style={{
              animation: 'float-phone-compact 12s ease-in-out infinite reverse'
            }}>
              <Moon size={140} className="-rotate-12" strokeWidth={0.5} />
            </div>
            <div className="absolute left-[35%] top-[-20%] text-blue-200/[0.03] pointer-events-none animate-[spin_40s_linear_infinite]">
              <Compass size={120} strokeWidth={0.5} />
            </div>
            <svg className="absolute left-[5%] top-[20%] text-white/10 w-32 md:w-48 h-20 md:h-32 transform -rotate-6 pointer-events-none" viewBox="0 0 200 100">
              <path d="M10,50 Q60,10 100,50 T190,50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6,6" />
              <circle cx="10" cy="50" r="3" fill="currentColor" />
              <circle cx="190" cy="50" r="3" fill="currentColor" />
            </svg>
            <div className="absolute right-[45%] top-[20%] text-yellow-400/30 animate-pulse pointer-events-none" style={{
              animationDuration: '3s'
            }}>
              <Star fill="currentColor" size={16} />
            </div>
            <div className="absolute left-[12%] bottom-[20%] text-blue-400/20 pointer-events-none hidden md:block" style={{
              animation: 'float-phone-compact 8s ease-in-out infinite'
            }}>
              <Plane size={24} className="-rotate-45" />
            </div>
            <div className="absolute right-[42%] bottom-[15%] bg-blue-500/[0.05] backdrop-blur-md border border-blue-400/20 rounded-xl px-3 py-1.5 hidden lg:flex items-center gap-2 pointer-events-none shadow-2xl transform rotate-3 animate-float-phone-compact" style={{
              animationDelay: '2.5s'
            }}>
              <ShieldCheck size={12} className="text-blue-300" />
              <span className="text-blue-200/90 text-[9px] font-bold uppercase tracking-wider">Secure Booking</span>
            </div>

            <div className="w-full md:w-[60%] lg:w-[65%] p-6 sm:p-8 md:p-10 lg:pl-12 relative z-10 flex flex-col justify-center text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-1.5 py-1 px-3 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] sm:text-[10px] font-bold tracking-widest mb-3 uppercase w-fit mx-auto md:mx-0 shadow-sm">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                Saer.pk Mobile App
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight leading-tight">
                Your Spiritual Journey,<br className="hidden lg:block" /> Now in Your Pocket.
              </h2>
              <p className="text-slate-400 text-sm md:text-[15px] mb-6 md:mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
                Get amazing discounts, exclusive app-only deals, and manage your Umrah bookings effortlessly.
              </p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center md:justify-start w-full">
                <div className="flex items-center gap-3 sm:gap-4 bg-white/5 px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md w-fit justify-center mx-auto md:mx-0">
                  <div className="bg-white p-1.5 rounded-xl shadow-md flex-shrink-0">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://saer.pk/download" alt="QR Code" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
                  </div>
                  <div className="text-left flex flex-col justify-center pr-2">
                    <span className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none mb-1.5">Scan to</span>
                    <span className="text-white font-bold text-base sm:text-lg leading-none whitespace-nowrap">Download</span>
                  </div>
                </div>
                <div className="hidden xl:block w-px h-14 bg-slate-700/50"></div>
                <div className="flex flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
                  <a href="#top" className="hover:scale-105 transition-transform flex-shrink-0">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-[40px] sm:h-[46px] lg:h-14 object-contain" />
                  </a>
                  <a href="#top" className="hover:scale-105 transition-transform flex-shrink-0">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-[40px] sm:h-[46px] lg:h-14 object-contain" />
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[40%] lg:w-[35%] h-[160px] md:h-full relative z-10 flex justify-center md:justify-end pointer-events-none mt-4 md:mt-0">
              <div className="absolute top-4 md:top-8 right-auto md:right-8 lg:right-16 w-[200px] md:w-[220px] lg:w-[240px] h-[400px] md:h-[480px] bg-slate-800 rounded-[2.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700 animate-float-phone-compact">
                <div className="absolute top-[80px] -left-1 w-1 h-10 bg-slate-700 rounded-l-md"></div>
                <div className="absolute top-[130px] -left-1 w-1 h-10 bg-slate-700 rounded-l-md"></div>
                <div className="absolute top-[100px] -right-1 w-1 h-14 bg-slate-700 rounded-r-md"></div>
                <div className="w-full h-full bg-slate-50 rounded-[2rem] md:rounded-[2.2rem] overflow-hidden relative shadow-inner flex flex-col">
                  <div className="absolute top-2 inset-x-0 h-5 bg-slate-900 rounded-full w-20 mx-auto z-20 flex justify-center items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] ml-6 border border-white/10"></div>
                  </div>
                  <div className="h-[35%] w-full bg-[#1a4484] relative overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="App header" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
                      <BrandLogo dark={true} size="sm" />
                    </div>
                  </div>
                  <div className="p-3 md:p-4 flex flex-col gap-3 flex-1 bg-slate-50 -mt-4 rounded-t-2xl relative z-10 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
                    <div className="w-full h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3 gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="h-2 w-1/2 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1 md:mt-2">
                      <div className="w-full h-20 md:h-24 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col items-center justify-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-100"></div>
                        <div className="h-1.5 w-12 bg-blue-200 rounded-full"></div>
                      </div>
                      <div className="w-full h-20 md:h-24 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col items-center justify-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100"></div>
                        <div className="h-1.5 w-12 bg-emerald-200 rounded-full"></div>
                      </div>
                    </div>
                    <div className="w-full h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3 gap-3">
                      <div className="w-8 h-8 rounded-md bg-slate-100"></div>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-1.5 w-3/4 bg-slate-200 rounded-full"></div>
                        <div className="h-1.5 w-1/3 bg-slate-100 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Reviews Section */}
      <section className="py-8 md:py-12 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-8 gap-4 max-w-5xl mx-auto">
            <div className="pr-28 sm:pr-0">
              <span className="text-blue-400 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1.5 md:mb-2 block">Our Reviews</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Watch Real Experiences</h2>
              <p className="text-sm text-slate-400 mt-1">Hear directly from our community about their unforgettable spiritual journeys.</p>
            </div>
            <button onClick={() => {
              setCurrentView('reviews');
            }} className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto p-2 -mr-2 sm:p-0 sm:m-0 flex items-center text-blue-400 font-semibold text-sm hover:text-blue-300 transition-colors group cursor-pointer z-20">
              See all <span className="hidden sm:inline">&nbsp;reviews</span> <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
            {videos.map((video, idx) => <div key={idx} className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-800 group cursor-pointer h-56 lg:h-64 flex flex-col justify-end">
              <img src={video.img} alt={video.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent group-hover:via-slate-900/20 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 group-hover:scale-110 shadow-xl shadow-black/30">
                  <Play className="text-white fill-white ml-1" size={24} />
                </div>
              </div>
              <div className="relative z-10 p-5">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-1 leading-tight">{video.name}</h3>
                <p className="text-blue-400 text-xs lg:text-sm font-medium">{video.trip}</p>
              </div>
            </div>)}
          </div>
          <div className="md:hidden relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            {videos.map((video, idx) => {
              let position = 'translate-x-full opacity-0';
              if (idx === currentVideoIndex) {
                position = 'translate-x-0 opacity-100 z-10';
              } else if (idx === (currentVideoIndex - 1 + videos.length) % videos.length) {
                position = '-translate-x-full opacity-0 z-0';
              }
              return <div key={idx} className={`absolute inset-0 transition-all duration-700 ease-in-out ${position} group cursor-pointer flex flex-col justify-end`}>
                <img src={video.img} alt={video.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center -mt-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-xl shadow-black/30">
                    <Play className="text-white fill-white ml-1" size={28} />
                  </div>
                </div>
                <div className="relative z-10 p-6 pb-12">
                  <h3 className="text-2xl font-bold text-white mb-1">{video.name}</h3>
                  <p className="text-blue-400 text-sm font-medium">{video.trip}</p>
                </div>
              </div>;
            })}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {videos.map((_, idx) => <button key={idx} onClick={() => setCurrentVideoIndex(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentVideoIndex ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/30 hover:bg-white/60'}`} />)}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Features / Why Choose Us */}
      <section className="py-10 md:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="w-full lg:w-5/12">
              <span className="text-blue-600 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-2 block">The Saer.pk Advantage</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3 md:mb-4 leading-tight">
                Why should you choose our services?
              </h2>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed mb-6 md:mb-8">
                Explore the convenience of Saer.pk, Pakistan's first online platform for hassle-free Umrah packages. We combine local expertise with innovative technology to secure your ideal spiritual journey in seconds.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3 md:-space-x-4">
                  <img className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                    9k+
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-900 text-base">Trusted Platform</p>
                  <p className="text-slate-500 text-xs">By thousands of travelers</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-7/12 flex flex-col gap-3 md:gap-4">
              {[{
                icon: Zap,
                title: "SwiftOps",
                desc: "Elevating Your Experience with Rapid Service Excellence and instant booking confirmations."
              }, {
                icon: Clock,
                title: "RefundSwift",
                desc: "Unmatched Service Delivery with an ironclad 48-Hour money-back Guarantee."
              }, {
                icon: ShieldCheck,
                title: "ProcessEase",
                desc: "Streamlined, Effortless, Every Transaction Simplified through our secure payment gateway."
              }].map((feature, idx) => {
                const Icon = feature.icon;
                return <div key={idx} className="bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 flex items-start gap-4 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 border border-transparent hover:border-slate-100 group cursor-default">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 md:py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs md:text-sm font-semibold text-slate-400 tracking-widest uppercase mb-8 md:mb-10">Our Trusted Airline Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            <div className="flex items-center gap-3 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-105">
              <img src="https://trade.newchoudhary.com/flight/images/airlines/EK.png" alt="Emirates Icon" className="h-8 md:h-10 object-contain shadow-sm" onError={e => e.target.style.display = 'none'} />
            </div>
            <div className="flex items-center gap-3 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-105">
              <img src="https://trade.newchoudhary.com/flight/images/airlines/QR.png" alt="Qatar Airways Icon" className="h-8 md:h-10 object-contain shadow-sm" onError={e => e.target.style.display = 'none'} />
            </div>
            <div className="flex items-center gap-3 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-105">
              <img src="https://trade.newchoudhary.com/flight/images/airlines/SV.png" alt="Saudia Icon" className="h-8 md:h-10 object-contain shadow-sm" onError={e => e.target.style.display = 'none'} />
            </div>
            <div className="flex items-center gap-3 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-105">
              <img src="https://trade.newchoudhary.com/flight/images/airlines/FZ.png" alt="Flydubai Icon" className="h-8 md:h-10 object-contain shadow-sm" onError={e => e.target.style.display = 'none'} />
            </div>
            <div className="flex items-center gap-3 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-105">
              <img src="https://trade.newchoudhary.com/flight/images/airlines/WY.png" alt="Oman Air Icon" className="h-8 md:h-10 object-contain shadow-sm" onError={e => e.target.style.display = 'none'} />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-8 md:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-8 gap-4 max-w-5xl mx-auto">
            <div className="pr-24 sm:pr-0">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Latest from the Blog</h2>
              <p className="text-sm text-slate-500 mt-1">Travel tips, guides, and spiritual insights.</p>
            </div>
            <button onClick={() => {
              setCurrentView('blogs');
            }} className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto p-2 -mr-1 sm:p-0 sm:m-0 flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors group cursor-pointer z-20">
              View all <span className="hidden sm:inline">&nbsp;articles</span> <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
            {blogs.map((blog, idx) => <div key={idx} onClick={() => {
              setCurrentView('blogview');
              window.scrollTo(0, 0);
            }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col hover:-translate-y-1">
              <div className="h-40 lg:h-48 overflow-hidden relative">
                <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="p-4 lg:p-5 flex flex-col flex-grow">
                <span className="text-slate-400 text-[10px] font-medium mb-1.5 block">{blog.date}</span>
                <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                  {blog.title}
                </h3>
                <div className="flex items-center text-blue-600 font-semibold text-xs lg:text-sm mt-auto w-fit">
                  Read article <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>)}
          </div>
          <div className="md:hidden relative w-full h-[360px] overflow-hidden">
            {blogs.map((blog, idx) => {
              let position = 'translate-x-full opacity-0';
              if (idx === currentBlogIndex) {
                position = 'translate-x-0 opacity-100 z-10';
              } else if (idx === (currentBlogIndex - 1 + blogs.length) % blogs.length) {
                position = '-translate-x-full opacity-0 z-0';
              }
              return <div key={idx} className={`absolute inset-0 transition-all duration-700 ease-in-out ${position} pb-8`}>
                <div onClick={() => {
                  setCurrentView('blogview');
                  window.scrollTo(0, 0);
                }} className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer w-full">
                  <div className="h-48 overflow-hidden relative flex-shrink-0">
                    <img src={blog.img} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col relative flex-grow">
                    <span className="text-slate-400 text-[10px] font-medium mb-1.5 block">{blog.date}</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center text-blue-600 font-semibold text-sm mt-auto w-fit">
                      Read article <ChevronRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
              </div>;
            })}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {blogs.map((_, idx) => <button key={idx} onClick={() => setCurrentBlogIndex(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentBlogIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300'}`} />)}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Compact Left/Right Layout) */}
      <section className="py-10 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start max-w-5xl mx-auto">
            <div className="w-full lg:w-1/3 text-center lg:text-left lg:sticky lg:top-28">
              <span className="text-blue-600 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-2 block">Support</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3 md:mb-4">Frequently Asked Questions</h2>
              <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 max-w-md mx-auto lg:mx-0">
                Everything you need to know about booking with Saer.pk. Can't find what you're looking for?
              </p>
              <button className="hidden lg:inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-full">
                Contact Support <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="w-full lg:w-2/3 space-y-3 md:space-y-4">
              {faqs.map((faq, index) => <div key={index} className="border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 bg-white hover:border-blue-100 hover:shadow-md">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full px-5 md:px-6 py-4 md:py-5 text-left flex justify-between items-center transition-colors focus:outline-none">
                  <span className={`font-semibold text-sm md:text-base pr-4 md:pr-8 transition-colors ${openFaq === index ? 'text-blue-700' : 'text-slate-900'}`}>
                    {faq.question}
                  </span>
                  <div className={`transition-all duration-300 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${openFaq === index ? 'rotate-180 bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <div className={`px-5 md:px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-4 md:pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                    {faq.answer}
                  </p>
                </div>
              </div>)}
            </div>
          </div>
        </div>
      </section>
    </> : currentView === 'results' ? (/* ========================================================= */
      /* FLIGHT RESULTS SCREEN                                     */
      /* ========================================================= */
      <div className="bg-[#f0f2f5] min-h-screen pb-16 animate-in fade-in duration-500">

        {/* Top Summary / Modify Search Bar */}
        <div className="bg-[#0B1A28] text-white py-4 shadow-md sticky top-[64px] md:top-[80px] z-40 border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <ArrowLeft size={20} className="text-white hover:text-slate-300 transition-colors cursor-pointer mr-2 md:mr-3 shrink-0" onClick={() => setCurrentView('home')} />
                <h2 className="text-lg md:text-xl font-bold tracking-tight">
                  {flightType === 'Multi City' ? 'Multi-City Itinerary' : `${departLoc?.city} to ${arriveLoc?.city}`}
                </h2>
                {flightType === 'Return' && <ArrowRightLeft size={16} className="text-blue-400 ml-2" />}
              </div>
              <p className="text-[13px] md:text-sm text-slate-300 font-medium md:pl-8">
                {flightType === 'Multi City' ? `${multiCityFlights.length} Flights` : formatDate(departDate)}
                {flightType === 'Return' && returnDate ? ` - ${formatDate(returnDate)}` : ''}
                <span className="mx-2 text-slate-500">|</span> {totalTravelers} Traveler{totalTravelers > 1 ? 's' : ''}
                <span className="mx-2 text-slate-500">|</span> {flightClass}
              </p>
            </div>
            <button onClick={() => setIsModifyingSearch(!isModifyingSearch)} className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isModifyingSearch ? 'bg-white/20 text-white' : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'}`}>
              <Search size={16} /> Modify Search <ChevronDown size={18} className={`transition-transform duration-300 ml-1 ${isModifyingSearch ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expandable Modify Search Area (Inline) */}
        {isModifyingSearch && <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative z-30 border-b border-slate-200 animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
            {flightSearchForm}
          </div>
        </div>}

        {/* Main Results Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT SIDEBAR: FILTERS */}
          <div className="hidden lg:block col-span-1 space-y-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Filter size={18} className="text-[#1a4484]" /> Filters</h3>
              <button onClick={clearAllFilters} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Clear All</button>
            </div>

            {filtersContentDesktop}
          </div>

          {/* RIGHT MAIN CONTENT: RESULTS */}
          <div className="col-span-1 lg:col-span-3 space-y-5">

            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 text-lg">
                {activeFilteredFlights.length} Flights Found
              </h3>
              <div className="lg:hidden flex gap-2">
                <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 shadow-sm active:bg-slate-50">
                  <Filter size={16} /> Filters
                </button>
              </div>
            </div>

            {/* Interactive Sorting Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden">
              <button onClick={() => setActiveSortTab('Recommended')} className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-colors ${activeSortTab === 'Recommended' ? 'border-[#1a4484] bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}>
                <span className={`block text-sm font-bold ${activeSortTab === 'Recommended' ? 'text-[#1a4484]' : 'text-slate-700'}`}>Recommended</span>
                <span className="block text-xs text-slate-500 font-medium">PKR 116,619 • 10h 50m</span>
              </button>
              <button onClick={() => setActiveSortTab('Cheapest')} className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-colors ${activeSortTab === 'Cheapest' ? 'border-[#1a4484] bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}>
                <span className={`block text-sm font-bold ${activeSortTab === 'Cheapest' ? 'text-[#1a4484]' : 'text-slate-700'}`}>Cheapest</span>
                <span className="block text-xs text-slate-500 font-medium">PKR 95,966 • 9h 00m</span>
              </button>
              <button onClick={() => setActiveSortTab('Quickest')} className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-colors ${activeSortTab === 'Quickest' ? 'border-[#1a4484] bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}>
                <span className={`block text-sm font-bold ${activeSortTab === 'Quickest' ? 'text-[#1a4484]' : 'text-slate-700'}`}>Quickest</span>
                <span className="block text-xs text-slate-500 font-medium">PKR 268,725 • 8h 20m</span>
              </button>
            </div>

            {/* Flight Cards List */}
            <div className="flex flex-col gap-4">
              {activeFilteredFlights.map(flight => {
                const legs = getSearchLegs();
                const isExpanded = expandedFlightId === flight.id;

                // Calculate the displayed price for this specific card
                let cardDisplayPrice = flight.price * totalTravelers;
                if (isExpanded) {
                  cardDisplayPrice = calculateTotalPriceForFlight(flight, selectedFares);
                }
                return <div key={flight.id} className={`bg-white rounded-xl border ${isExpanded ? 'border-[#1a4484] shadow-lg ring-1 ring-[#1a4484]' : 'border-slate-200 hover:shadow-md hover:border-blue-400'} overflow-hidden transition-all duration-300 flex flex-col group`}>
                  {/* --- Main Flight Info Row (Clickable to Toggle Expansion) --- */}
                  <div onClick={() => toggleFlightExpansion(flight, legs)} className="flex flex-col md:flex-row cursor-pointer items-stretch relative">
                    {/* Legs Container */}
                    <div className="flex-1 flex flex-col p-4 md:p-6 justify-center">
                      {legs.map((leg, legIdx) => <div key={legIdx} className={`flex flex-col sm:flex-row sm:items-center w-full gap-4 md:gap-6 ${legIdx > 0 ? 'pt-5 mt-5 border-t border-dashed border-slate-200' : ''}`}>

                        {/* Airline Info (Logo without background) */}
                        <div className="flex items-center gap-3 sm:w-[130px] shrink-0">
                          <img src={flight.airline.logo} className="w-10 h-10 object-contain" alt={flight.airline.name} />
                          <div className="flex flex-col">
                            <span className="font-bold text-[14px] text-slate-800 leading-tight">{flight.airline.name}</span>
                            <span className="text-[11px] text-slate-500 font-medium tracking-wide">{flight.airline.code}-{100 + flight.id + legIdx}</span>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center justify-between flex-1 gap-3 md:gap-4">
                          {/* Depart */}
                          <div className="flex flex-col items-end sm:min-w-[65px]">
                            <span className="text-[17px] md:text-[20px] font-bold text-slate-900">{legIdx === 0 ? flight.depTime : '06:30 AM'}</span>
                            <span className="text-xs font-medium text-slate-500">{leg.from?.city || 'LHE'}</span>
                          </div>

                          {/* Visual Line */}
                          <div className="flex-1 flex flex-col items-center relative px-2 md:px-6">
                            <span className="text-[10px] text-slate-500 font-medium mb-1.5">{flight.duration}</span>
                            <div className="w-full flex items-center relative">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                              <div className="flex-1 border-t-[1.5px] border-solid border-slate-200"></div>
                              <div className={`text-[10px] font-semibold px-2 bg-white z-10 ${flight.stops === 'Non-stop' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                {flight.stops}
                              </div>
                              <div className="flex-1 border-t-[1.5px] border-solid border-slate-200"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            </div>
                          </div>

                          {/* Arrive */}
                          <div className="flex flex-col items-start sm:min-w-[65px]">
                            <span className="text-[17px] md:text-[20px] font-bold text-slate-900 flex items-start gap-0.5">
                              {legIdx === 0 ? flight.arrTime : '04:15 PM'}
                              {flight.id % 2 === 0 && <span className="text-[9px] text-red-500 font-bold leading-none mt-0.5">+1</span>}
                            </span>
                            <span className="text-xs font-medium text-slate-500">{leg.to?.city || 'JED'}</span>
                          </div>
                        </div>
                      </div>)}
                    </div>

                    {/* Right Price Section */}
                    <div className={`w-full md:w-[230px] p-5 md:p-6 flex flex-row md:flex-col justify-between md:justify-end shrink-0 transition-colors relative border-t md:border-t-0 group/price ${isExpanded ? 'bg-[#1a4484] text-white' : 'bg-[#1252a8] text-white'}`}>
                      <div className="flex flex-col items-start md:items-end w-full">
                        <span className="text-[10px] lg:text-[11px] text-blue-100 font-semibold mb-1 uppercase tracking-[0.1em]">Total Payable</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[14px] font-bold text-white">PKR</span>
                          <span className="text-[26px] lg:text-[32px] font-extrabold tracking-tight leading-none" style={{
                            fontFamily: "'Montserrat', sans-serif"
                          }}>{cardDisplayPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-end w-full mt-2 hidden md:flex">
                        {isExpanded ? <ChevronDown size={22} className="text-white transition-all rotate-180" strokeWidth={2.5} /> : <ChevronDown size={22} className="text-white/70 group-hover/price:text-white transition-all group-hover/price:translate-y-1" strokeWidth={2.5} />}
                      </div>
                      {isExpanded ? <ChevronDown className="md:hidden text-white shrink-0 ml-4 rotate-180" size={22} strokeWidth={2.5} /> : <ChevronRight className="md:hidden text-white shrink-0 ml-4" size={22} strokeWidth={2.5} />}
                    </div>
                  </div>

                  {/* --- Expanded Inline Fare Selection Row --- */}
                  {isExpanded && <div className="border-t border-slate-200 bg-slate-50/60 p-4 md:p-6 w-full animate-in slide-in-from-top-4 duration-300 overflow-hidden" onClick={e => e.stopPropagation()}>

                    {/* Stepper for Return/Multi-City */}
                    {legs.length > 1 && <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                      {legs.map((l, i) => <button key={i} onClick={() => setActiveFareLeg(i)} className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 ${activeFareLeg === i ? 'bg-[#1a4484] text-white shadow-md' : selectedFares[i] ? 'bg-blue-100 text-[#1a4484] hover:bg-blue-200' : 'bg-white border border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
                        {selectedFares[i] && activeFareLeg !== i ? <Check size={14} /> : <span>{i + 1}.</span>}
                        {l.from?.code} <ArrowRight size={12} className="opacity-50" /> {l.to?.code}
                      </button>)}
                    </div>}

                    <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-2">
                      <h4 className="text-lg font-bold text-slate-800">Select a fare option</h4>
                      <span className="text-[13px] font-bold text-[#1a4484] bg-blue-100 px-3.5 py-1.5 rounded-lg flex items-center shadow-sm">
                        {legs[activeFareLeg]?.from?.city} <ArrowRight size={14} className="inline opacity-70 mx-1.5" /> {legs[activeFareLeg]?.to?.city}
                      </span>
                    </div>

                    {/* Responsive Card Container: Horizontally scrollable on mobile, grid on desktop */}
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 pb-4 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {fareTiers.map(tier => {
                        const isSelected = selectedFares[activeFareLeg] === tier.id;
                        const legBasePrice = Math.floor(flight.price / Math.max(1, legs.length));
                        const currentTierPrice = (legBasePrice + tier.addPrice) * totalTravelers;
                        return <div key={tier.id} onClick={() => handleFareSelect(tier.id, legs.length)} className={`min-w-[85%] sm:min-w-[300px] md:min-w-0 snap-center shrink-0 bg-white rounded-2xl p-5 flex flex-col relative transition-all cursor-pointer border-2 mt-3 ${isSelected ? 'border-[#1a4484] shadow-lg bg-blue-50/10 z-10' : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}>
                          {/* Overlapping Tag */}
                          {tier.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex justify-center">
                            <span className={`text-[10px] font-bold px-3.5 py-1 rounded-full border uppercase tracking-widest whitespace-nowrap shadow-sm ${isSelected ? 'bg-[#1a4484] text-white border-[#1a4484]' : 'bg-slate-100 text-emerald-600 border-slate-200'}`}>
                              {tier.tag}
                            </span>
                          </div>}

                          <h5 className="text-base font-bold text-slate-800 text-center mt-2 mb-4">{tier.name}</h5>

                          <div className="space-y-3 mb-5 flex-1">
                            {tier.features.map((f, fi) => <div key={fi} className="flex items-center gap-3 text-[12px] md:text-[13px]">
                              <f.icon size={16} className={`shrink-0 ${f.cross ? 'text-slate-300' : 'text-[#1a4484]'}`} />
                              <span className={`leading-snug truncate ${f.cross ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{f.text}</span>
                            </div>)}
                          </div>

                          <div className={`w-full py-3 rounded-xl font-bold transition-all text-sm md:text-[15px] text-center flex items-center justify-center gap-2 ${isSelected ? 'bg-[#1a4484] text-white shadow-md' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'}`}>
                            {isSelected && <CheckCircle2 size={18} />}
                            <span style={{
                              fontFamily: "'Montserrat', sans-serif"
                            }}>PKR {currentTierPrice.toLocaleString()}</span>
                          </div>
                        </div>;
                      })}
                    </div>
                  </div>}
                </div>;
              })}
            </div>

          </div>
        </div>
      </div>) : currentView === 'booking' ? <BookingView onBack={() => setCurrentView(bookingType === 'umrah' ? 'umrah_packages' : 'results')} bookingType={bookingType} selectedFlightForBooking={selectedFlightForBooking} selectedUmrahPackage={selectedUmrahPackage} selectedUmrahRoom={selectedUmrahRoom} totalTravelers={totalTravelers} calculateTotalPriceForFlight={calculateTotalPriceForFlight} selectedFares={selectedFares} setCurrentView={setCurrentView} onSignIn={() => setIsSignInOpen(true)} /> : currentView === 'branches' ? <BranchesView setCurrentView={setCurrentView} /> : currentView === 'contact' ? <ContactView setCurrentView={setCurrentView} /> : currentView === 'about' ? <AboutView setCurrentView={setCurrentView} /> : currentView === 'register_agent' ? <RegistrationView type="Agent" onBack={() => setCurrentView('home')} /> : currentView === 'register_branch' ? <RegistrationView type="Branch" onBack={() => setCurrentView('home')} /> : currentView === 'privacy' ? <PrivacyView setCurrentView={setCurrentView} /> : currentView === 'terms' ? <TermsView setCurrentView={setCurrentView} /> : currentView === 'reviews' ? <ReviewsView onBack={() => {
        setCurrentView('home');
        window.scrollTo(0, 0);
      }} /> : currentView === 'blogs' ? <BlogPage setCurrentView={setCurrentView} onBack={() => {
        setCurrentView('home');
        window.scrollTo(0, 0);
      }} /> : currentView === 'blogview' ? <BlogView setCurrentView={setCurrentView} onBack={() => {
        setCurrentView('blogs');
        window.scrollTo(0, 0);
      }} /> : currentView === 'umrah_packages' ? <UmrahPackagesPage modifySearchForm={umrahSearchForm} onBack={() => {
        setCurrentView('home');
        window.scrollTo(0, 0);
      }} onBook={(pkg, room) => {
        setSelectedUmrahPackage(pkg);
        setSelectedUmrahRoom(room);
        setBookingType('umrah');
        setCurrentView('booking');
        window.scrollTo(0, 0);
      }} searchState={{
        umrahDepartLoc,
        umrahMonth,
        umrahDays,
        totalUmrahTravelers
      }} /> : currentView === 'manage_bookings' ? <ManageBookingPage onBack={() => {
        setCurrentView('home');
        window.scrollTo(0, 0);
      }} onLogin={() => {
        setCurrentView('userdashboard');
        window.scrollTo(0, 0);
      }} onFindBooking={() => {
        setCurrentView('see_booking_dashboard');
        window.scrollTo(0, 0);
      }} onContactSupport={() => setShowSupportPopup(true)} /> : currentView === 'userdashboard' ? <UserDashboard onSignOut={() => {
        setCurrentView('home');
        window.scrollTo(0, 0);
      }} /> : currentView === 'see_booking_dashboard' ? <SeeBookingDashboard onBack={() => {
        setCurrentView('manage_bookings');
        window.scrollTo(0, 0);
      }} /> : currentView === 'profile' ? <ProfilePage onBack={() => {
        setCurrentView('home');
        window.scrollTo(0, 0);
      }} /> : <div>Page Not Found</div>}

    {/* 7. Footer */}
    <footer className="relative bg-[#0B1A28] text-slate-300 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        {/* Brand Column */}
        <div className="sm:col-span-2 lg:col-span-4 lg:pr-8">
          <div className="flex flex-col mb-6">
            <BrandLogo dark={true} showSubtitle={true} showLicense={true} />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-md">
            Saer.pk streamlines Umrah booking with ease, local expertise, and exclusive deals for a hassle-free spiritual journey in Pakistan.
          </p>
          <div className="flex gap-3">
            {['Fb', 'Tw', 'Ig', 'In'].map((social, i) => <a key={i} href="#/" className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm backdrop-blur-sm">
              <span className="text-xs font-semibold">{social}</span>
            </a>)}
          </div>
        </div>

        {/* Links & Services Columns */}
        <div className="sm:col-span-2 lg:col-span-4 lg:col-start-5 grid grid-cols-2 gap-4 sm:gap-8">
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Useful Links</h4>
            <ul className="space-y-4 text-sm">
              {['Privacy policy', 'Term & Conditions', 'Contact Us', 'About Us', 'Our Branches', 'Register as Agent', 'Register as Branch'].map(link => <li key={link}>
                <button onClick={e => {
                  e.preventDefault();
                  if (link === 'Our Branches') {
                    setCurrentView('branches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (link === 'Contact Us') {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (link === 'About Us') {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (link === 'Register as Agent') {
                    setCurrentView('register_agent');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (link === 'Register as Branch') {
                    setCurrentView('register_branch');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (link === 'Privacy policy') {
                    setCurrentView('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (link === 'Term & Conditions') {
                    setCurrentView('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }} className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  {link}
                </button>
              </li>)}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-4 text-sm">
              {['Flights', 'Umrah Packages', 'AI Planner', 'Hotels', 'Insurance', 'Visa', 'Trips'].map(link => <li key={link}>
                <button onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(link);
                  navigate('/#' + link.replace(/\s+/g, ''));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all text-left">
                  {link}
                </button>
              </li>)}
            </ul>
          </div>
        </div>

        {/* Contact/Support Column */}
        <div className="sm:col-span-2 lg:col-span-4 lg:pl-8 border-t sm:border-t-0 lg:border-l border-slate-700/50 pt-8 sm:pt-0 lg:pl-8 lg:pt-0">
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact Support</h4>
          <div className="space-y-5">
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-[#152535] border border-slate-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-colors">
                <MapPin className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Office Location</p>
                <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">123 Business Avenue, Block 4,<br />Lahore, Pakistan</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-[#152535] border border-slate-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-colors">
                <Phone className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Direct Helpline</p>
                <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors" style={{
                  fontFamily: "'Montserrat', sans-serif"
                }}>0300-0701506</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-[#152535] border border-slate-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 group-hover:border-green-500/30 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-500 group-hover:text-green-400 transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">WhatsApp Chat</p>
                <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors" style={{
                  fontFamily: "'Montserrat', sans-serif"
                }}>0300-0701506</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className="relative z-10 bg-[#061018] py-6 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row justify-between items-center gap-6">
          <p className="text-[11px] md:text-xs text-slate-500 text-center xl:text-left order-2 xl:order-1 font-medium tracking-wide">
            © 2026 Saer.pk, All rights reserved. Designed for spiritual journeys.
          </p>

          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center order-1 xl:order-2 bg-[#0B1A28]/80 backdrop-blur-md p-1.5 md:p-2.5 rounded-2xl border border-slate-800/80 shadow-inner">
            <span className="text-[10px] md:text-xs text-slate-400 font-semibold px-2 uppercase tracking-widest hidden sm:block">Secure Payments</span>

            <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-center h-8 shadow-sm hover:scale-105 transition-transform cursor-pointer">
              <span className="text-orange-500 font-black text-sm italic tracking-tighter">1<span className="text-blue-900">BILL</span></span>
            </div>

            <div className="bg-[#152535] border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-xl flex items-center gap-1.5 h-8 shadow-sm hover:scale-105 transition-all cursor-pointer">
              <Building2 size={14} className="text-slate-300" />
              <span className="text-slate-300 font-semibold text-[10px] uppercase tracking-wider">Bank Transfer</span>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-center h-8 shadow-sm hover:scale-105 transition-transform cursor-pointer">
              <span className="text-blue-800 font-bold text-xs italic">VISA</span>
            </div>

            <div className="bg-white px-2 py-1.5 rounded-xl flex items-center justify-center h-8 gap-0.5 shadow-sm hover:scale-105 transition-transform cursor-pointer">
              <div className="w-3 h-3 bg-red-500 rounded-full mix-blend-multiply"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mix-blend-multiply -ml-1.5"></div>
              <span className="text-slate-800 font-bold text-[10px] ml-1">mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>

    {/* --- MOBILE FULL-SCREEN MODALS --- */}

    {/* Mobile Location Picker Modal */}
    {locModal.isOpen && <div className="md:hidden fixed inset-0 z-[9999] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
      <div className="flex flex-col border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center p-4">
          <button onClick={() => setLocModal(prev => ({
            ...prev,
            isOpen: false
          }))} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-[18px] font-bold text-slate-900">
            {locModal.type === 'depart' ? 'Select Origin' : 'Select Destination'}
          </h2>
        </div>
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search city or airport code..." value={locSearch} onChange={e => setLocSearch(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-slate-100 border-transparent rounded-xl text-[15px] outline-none focus:border-[#24529a] focus:bg-white focus:ring-1 focus:ring-[#24529a] transition-all" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {filteredAirports.length > 0 ? filteredAirports.map(airport => <div key={airport.code} onClick={() => handleLocationSelect(airport)} className="px-5 py-4 cursor-pointer flex items-center justify-between border-b border-slate-100 active:bg-slate-50 transition-colors">
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
        </div>) : <div className="p-8 text-center text-slate-500 text-[15px]">
          No airports found matching "{locSearch}"
        </div>}
      </div>
    </div>}

    {/* Mobile Passenger Modal */}
    {isPassengerModalOpen && <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
      <div className="flex items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <button onClick={() => setIsPassengerModalOpen(false)} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[18px] font-bold text-slate-900">Travelers</h2>
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
              <button onClick={handleDecreaseAdults} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${adults <= 1 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
                <Minus size={16} />
              </button>
              <span className="w-4 text-center font-bold text-slate-900 text-[16px]">{adults}</span>
              <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-[#1a4484] text-[#1a4484] flex items-center justify-center hover:bg-blue-50 transition-colors">
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
              <button onClick={() => setChildren(Math.max(0, children - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${children <= 0 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
                <Minus size={16} />
              </button>
              <span className="w-4 text-center font-bold text-slate-900 text-[16px]">{children}</span>
              <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-[#1a4484] text-[#1a4484] flex items-center justify-center hover:bg-blue-50 transition-colors">
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
                <p className="text-[13px] text-slate-500 mt-1.5">7 days to 23 months</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setInfants(Math.max(0, infants - 1))} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${infants <= 0 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
                <Minus size={16} />
              </button>
              <span className="w-4 text-center font-bold text-slate-900 text-[16px]">{infants}</span>
              <button onClick={handleAddInfant} className={`w-8 h-8 rounded-full border border-[#1a4484] text-[#1a4484] flex items-center justify-center hover:bg-blue-50 transition-colors ${infants >= adults ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 z-20 pb-8">
        <button onClick={() => setIsPassengerModalOpen(false)} className="w-full bg-[#1252a8] text-white font-medium py-3.5 rounded-lg active:scale-[0.98] transition-transform text-[17px]">
          Done
        </button>
      </div>
    </div>}

    {/* Mobile Class Modal */}
    {isClassModalOpen && <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
      <div className="flex items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <button onClick={() => setIsClassModalOpen(false)} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[18px] font-bold text-slate-900">Cabin Class</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="pt-4 px-5">
          <div className="flex flex-col gap-4">
            {['Economy', 'Premium Economy', 'Business', 'First'].map(cls => <label key={cls} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${flightClass === cls ? 'border-[#1a4484] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`} onClick={() => setFlightClass(cls)}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${flightClass === cls ? 'border-[#1a4484]' : 'border-slate-300'}`}>
                {flightClass === cls && <div className="w-3 h-3 bg-[#1a4484] rounded-full"></div>}
              </div>
              <span className={`text-[16px] ${flightClass === cls ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium'}`}>{cls}</span>
            </label>)}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 z-20 pb-8">
        <button onClick={() => setIsClassModalOpen(false)} className="w-full bg-[#1252a8] text-white font-medium py-3.5 rounded-lg active:scale-[0.98] transition-transform text-[17px]">
          Done
        </button>
      </div>
    </div>}

    {/* Mobile Date Picker Modal */}
    {dateConfig.isOpen && <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
      <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => setDateConfig({
            ...dateConfig,
            isOpen: false
          })} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-[18px] font-bold text-slate-900">Select Date</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 relative">
        <div className="grid grid-cols-7 text-center text-[13px] font-semibold py-3 sticky top-0 bg-white z-10 border-b border-slate-100 shadow-sm">
          <div className="text-slate-500">Mon</div><div className="text-slate-500">Tue</div><div className="text-slate-500">Wed</div>
          <div className="text-slate-500">Thu</div><div className="text-slate-500">Fri</div><div className="text-[#1a4484]">Sat</div>
          <div className="text-[#1a4484]">Sun</div>
        </div>

        {calendarMonths.map((month, mIndex) => <div key={mIndex} className="px-4 py-5 border-b border-slate-50">
          <h4 className="font-bold text-slate-900 mb-5 text-[16px] pl-2">{month.name}</h4>
          <div className="grid grid-cols-7 gap-y-4 gap-x-1 justify-items-center">
            {month.days.map((date, dIndex) => {
              if (!date) return <div key={`empty-${dIndex}`} className="w-10 h-10"></div>;
              const isDepart = isDateSelected(date, 'depart');
              const isReturn = flightType === 'Return' && isDateSelected(date, 'return');
              const isSelected = isDepart || isReturn;
              let isDisabled = false;
              if (flightType === 'Return' && dateConfig.type === 'return' && departDate) {
                isDisabled = date < departDate;
              }
              return <div key={dIndex} className="relative flex justify-center w-full">
                <button disabled={isDisabled} onClick={() => handleDateSelect(date)} className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all text-[15px] ${isSelected ? 'bg-[#1a4484] text-white font-bold shadow-md' : isDisabled ? 'text-slate-300 cursor-not-allowed opacity-50' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>
                  {isSelected && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-[2px] rounded-md whitespace-nowrap shadow-sm pointer-events-none z-10 border border-white">
                    {flightType === 'Multi City' ? `Flight ${dateConfig.activeMultiIndex + 1}` : isDepart ? 'Depart' : 'Return'}
                  </div>}
                  {date.getDate()}
                </button>
              </div>;
            })}
          </div>
        </div>)}
      </div>

      {/* Sticky Bottom Context for Return Flights */}
      {flightType === 'Return' && <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 flex gap-3 z-20 pb-8 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <div onClick={() => setDateConfig({
          ...dateConfig,
          type: 'depart'
        })} className={`flex-1 border rounded-xl p-3 flex items-center gap-2 transition-colors ${dateConfig.type === 'depart' ? 'border-[#1a4484] bg-[#f0f6ff]' : 'border-slate-200'}`}>
          <Calendar size={18} className={dateConfig.type === 'depart' ? 'text-[#1a4484]' : 'text-slate-400'} />
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Depart</span>
            <span className={`text-[14px] font-bold whitespace-nowrap overflow-hidden text-ellipsis ${departDate ? 'text-slate-900' : 'text-slate-400'}`}>
              {formatDate(departDate) || 'Select'}
            </span>
          </div>
        </div>
        <div onClick={() => setDateConfig({
          ...dateConfig,
          type: 'return'
        })} className={`flex-1 border rounded-xl p-3 flex items-center gap-2 transition-colors ${dateConfig.type === 'return' ? 'border-[#1a4484] bg-[#f0f6ff]' : 'border-slate-200'}`}>
          <Calendar size={18} className={dateConfig.type === 'return' ? 'text-[#1a4484]' : 'text-slate-400'} />
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Return</span>
            <span className={`text-[14px] font-bold whitespace-nowrap overflow-hidden text-ellipsis ${returnDate ? 'text-slate-900' : 'text-slate-400'}`}>
              {formatDate(returnDate) || 'Select'}
            </span>
          </div>
        </div>
      </div>}
    </div>}

    {/* Mobile Umrah Passenger Modal */}
    {isUmrahPaxModalOpen && <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
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
    </div>}

    {/* Mobile Umrah Room Modal */}
    {isUmrahRoomModalOpen && <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
      <div className="flex items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <button onClick={() => setIsUmrahRoomModalOpen(false)} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[18px] font-bold text-slate-900">Room Type</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="pt-4 px-5">
          <div className="flex flex-col gap-4">
            {['Quad', 'Triple', 'Double', 'Single'].map(room => <label key={room} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${umrahRoomType === room ? 'border-[#1a4484] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`} onClick={() => setUmrahRoomType(room)}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${umrahRoomType === room ? 'border-[#1a4484]' : 'border-slate-300'}`}>
                {umrahRoomType === room && <div className="w-3 h-3 bg-[#1a4484] rounded-full"></div>}
              </div>
              <span className={`text-[16px] ${umrahRoomType === room ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium'}`}>{room} Sharing</span>
            </label>)}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 z-20 pb-8">
        <button onClick={() => setIsUmrahRoomModalOpen(false)} className="w-full bg-[#1252a8] text-white font-medium py-3.5 rounded-lg active:scale-[0.98] transition-transform text-[17px]">
          Done
        </button>
      </div>
    </div>}

    {/* Mobile Umrah Duration Modal */}
    {isUmrahDaysModalOpen && <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
      <div className="flex items-center p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <button onClick={() => setIsUmrahDaysModalOpen(false)} className="p-2 mr-2 text-[#1a4484] hover:bg-slate-100 rounded-full transition-colors -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[18px] font-bold text-slate-900">Duration</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="pt-4 px-5">
          <div className="flex flex-col gap-4">
            {['7 Days', '10 Days', '14 Days', '15 Days', '21 Days', '28 Days', 'Custom'].map(day => <div key={day} onClick={() => {
              setUmrahDays(day);
              setIsUmrahDaysModalOpen(false);
            }} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${umrahDays === day ? 'border-[#1a4484] bg-blue-50/50 text-[#1a4484] font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'}`}>
              <span className="text-[16px]">{day}</span>
              {umrahDays === day && <Check size={20} className="text-[#1a4484]" />}
            </div>)}
          </div>
        </div>
      </div>
    </div>}

    {/* Mobile Umrah Month Modal */}
    {isUmrahMonthModalOpen && <div className="md:hidden fixed inset-0 z-[9999] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-200 mobile-modal">
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
            <input type="text" placeholder="Search month..." value={umrahMonthSearch} onChange={e => setUmrahMonthSearch(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-slate-100 border-transparent rounded-xl text-[15px] outline-none focus:border-[#24529a] focus:bg-white focus:ring-1 focus:ring-[#24529a] transition-all" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white pb-24">
        {filteredUmrahMonths.length > 0 ? filteredUmrahMonths.map(month => <div key={month} onClick={() => {
          setUmrahMonth(month);
          setIsUmrahMonthModalOpen(false);
          setUmrahMonthSearch('');
        }} className={`px-5 py-4 cursor-pointer flex items-center justify-between border-b border-slate-100 active:bg-slate-50 transition-colors ${umrahMonth === month ? 'bg-blue-50/50' : ''}`}>
          <div className="flex items-center gap-4 overflow-hidden">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${umrahMonth === month ? 'bg-blue-100 text-[#1a4484]' : 'bg-slate-100 text-slate-500'}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className={`text-[16px] leading-tight truncate ${umrahMonth === month ? 'font-bold text-[#1a4484]' : 'font-medium text-slate-800'}`}>{month}</p>
            </div>
          </div>
          {umrahMonth === month && <Check size={20} className="text-[#1a4484] flex-shrink-0 ml-3" />}
        </div>) : <div className="p-8 text-center text-slate-500 text-[15px]">
          No matching months found
        </div>}
      </div>
    </div>}

    {/* Mobile Filters Modal - UPDATED: Shows filters but hides support widget */}
    {isMobileFiltersOpen && <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col lg:hidden animate-in slide-in-from-bottom-2 mobile-modal">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-[#1a4484]" />
          <h2 className="text-[18px] font-bold text-slate-900">Filters</h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={clearAllFilters} className="text-sm font-semibold text-blue-600">Clear All</button>
          <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors -mr-2">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {filtersCore}
      </div>

      <div className="p-4 bg-white border-t border-slate-200 pb-8">
        <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-[#1252a8] text-white font-medium py-3.5 rounded-lg active:scale-[0.98] transition-transform text-[17px]">
          Show {activeFilteredFlights.length} Flights
        </button>
      </div>
    </div>}

    {/* --- SUPPORT CONTACT POPUP MODAL (UPGRADED) --- */}
    {showSupportPopup && <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSupportPopup(false)}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[360px] relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Top Decorative Graphic */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button onClick={e => {
          e.stopPropagation();
          setShowSupportPopup(false);
        }} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all z-50 active:scale-90">
          <X size={16} />
        </button>

        <div className="px-6 pt-10 pb-8 flex flex-col items-center relative z-10">
          {/* Avatar / Icon */}
          <div className="relative mb-5">
            <div className="w-16 h-16 bg-white border border-slate-100 shadow-[0_8px_20px_rgba(26,68,132,0.12)] rounded-2xl flex items-center justify-center rotate-3">
              <Headset size={28} className="text-[#1a4484] -rotate-3" strokeWidth={2} />
            </div>
            {/* Online Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[2.5px] border-white rounded-full">
              <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
            </div>
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1.5 text-center">
            How can we help?
          </h3>
          <p className="text-[13px] text-slate-500 text-center font-medium mb-6 leading-relaxed px-1">
            Our support team is online <span className="text-emerald-600 font-bold">24/7</span>. Choose your preferred way to connect.
          </p>

          {/* Contact Action Cards */}
          <div className="flex flex-col gap-3 w-full">

            {/* WhatsApp - Primary */}
            <a href="https://wa.me/923000701506" target="_blank" rel="noreferrer" className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-white border border-[#25D366]/30 hover:border-[#25D366] shadow-sm hover:shadow-[0_8px_25px_rgba(37,211,102,0.15)] transition-all duration-300 overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] transition-transform group-hover:scale-110">
                  <MessageCircle size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-bold text-slate-900 group-hover:text-[#25D366] transition-colors">WhatsApp Chat</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-0.5">Replies instantly</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all relative z-10" />
            </a>

            {/* Phone Call - Secondary */}
            <a href="tel:+923000701506" className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#1a4484]/40 shadow-sm hover:shadow-[0_8px_25px_rgba(26,68,132,0.12)] transition-all duration-300 overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a4484]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#1a4484]/10 flex items-center justify-center text-slate-500 group-hover:text-[#1a4484] transition-all group-hover:scale-110">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-bold text-slate-900 group-hover:text-[#1a4484] transition-colors">Phone Call</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-0.5">Speak to an agent</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-[#1a4484] group-hover:translate-x-1 transition-all relative z-10" />
            </a>

          </div>
        </div>
      </div>
    </div>}

    {/* --- SIGN IN POPUP --- */}
    <SignInPopup isOpen={isSignInOpen} onClose={redirectDest => {
      setIsSignInOpen(false);
      if (redirectDest === 'profile') {
        navigate('/dashboard/profile');
        window.scrollTo(0, 0);
      }
    }} />

  </div>;
};
export default App;