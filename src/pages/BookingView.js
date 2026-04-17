import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, CreditCard, Plane, 
  User, Users, Calendar, ArrowRight, Lock, FileText, 
  Download, CheckCircle, AlertCircle, Info, ArrowLeft,
  ChevronDown, Ticket, Mail, Globe, Smartphone, UploadCloud, Clock, Search, X,
  Eye, Trash2, Building, Banknote, Landmark, Pencil, Copy
} from 'lucide-react';
import { generateReceiptPDF } from '../utils/receiptGenerator';

// --- MOCK DATA FALLBACKS ---
const FLIGHT_DETAILS_MOCK = {
  airline: 'Saudia',
  logo: 'https://trade.newchoudhary.com/flight/images/airlines/SV.png',
  flightNo: 'SV-701',
  date: '15 Feb 2026',
  depart: { time: '10:30', city: 'Lahore', code: 'LHE' },
  arrive: { time: '13:15', city: 'Jeddah', code: 'JED' },
  duration: '5h 45m',
  class: 'Economy Premium',
  baggage: '30kg + 7kg Cabin'
};

const PRICE_DETAILS_MOCK = {
  total: 230400,
  minDepositUmrah: 50000 
};

// --- HELPER ARRAYS ---
export const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const YEARS_DOB = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
export const YEARS_PASS = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - 10 + i);

const COUNTRIES = [
  "Pakistan", "Saudi Arabia", "United Arab Emirates", "United Kingdom", "United States", 
  "Canada", "Australia", "India", "Bangladesh", "Qatar", "Oman", "Kuwait", "Bahrain"
];

const PAK_BANKS = [
  "Allied Bank (ABL)", "Askari Bank (ASK)", "Bank Al Habib (BAHL)", "Bank Alfalah (BAFL)",
  "Dubai Islamic Bank (DIB)", "Faysal Bank (FBL)", "First Women Bank (FWB)", "Habib Bank Limited (HBL)", 
  "Habib Metro Bank (HMB)", "JS Bank (JSB)", "Meezan Bank (MBL)", "Mobilink Microfinance Bank (MMBL)", 
  "National Bank of Pakistan (NBP)", "NRSP Microfinance Bank", "Samba Bank (SAM)", "Silk Bank (SLK)", 
  "Standard Chartered (SCB)", "Summit Bank (SUM)", "United Bank Limited (UBL)"
];

const DIGITAL_WALLETS = [
  "JazzCash", "EasyPaisa", "HBL Konnect", "NayaPay", "SadaPay"
];

const CONSUMER_ID = "1000291480708961";

export const formatDateDisplay = (dateObj, placeholder = '') => {
  if (dateObj.day && dateObj.month && dateObj.year) {
    return `${dateObj.day} ${dateObj.month} ${dateObj.year}`;
  }
  return placeholder;
};

// --- CUSTOM COMPONENTS ---

// Inline Copy Button Component
const InlineCopy = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      const textField = document.createElement('textarea');
      textField.innerText = text;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="inline-flex items-center justify-center p-1 hover:bg-blue-50 rounded text-[#1a4484] transition-colors relative group ml-1"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />} 
      {copied && <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-50">Copied!</span>}
    </button>
  );
};

// Integrated "Worthy" Searchable Dropdown (Combobox)
const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSearch(value ? value.toString() : '');
    }
  }, [value, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => 
    o.toString().toLowerCase().includes(String(search).toLowerCase())
  );

  return (
    <div className="relative w-full" ref={ref}>
      <div className={`relative w-full h-11 bg-white border ${isOpen ? 'border-[#1a4484] ring-1 ring-[#1a4484]' : 'border-slate-300 hover:border-[#1a4484]'} rounded-lg flex items-center overflow-hidden transition-all`}>
        <input
          type="text"
          value={isOpen ? search : (value || '')}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-full pl-3 pr-10 outline-none text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
        />
        {isOpen ? (
          <Search size={16} className="absolute right-3 text-slate-400 pointer-events-none" />
        ) : (
          <ChevronDown size={16} className="absolute right-3 text-slate-400 pointer-events-none" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-56 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filteredOptions.length > 0 ? filteredOptions.map(opt => (
            <div 
              key={opt} 
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="px-4 py-3 text-[13px] font-bold text-slate-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
            >
              {opt}
            </div>
          )) : (
            <div className="px-4 py-3 text-[12px] text-slate-400 text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

// 1. Country Picker Modal (Mobile)
const CountryPickerModal = ({ isOpen, onClose, onSelect, title }) => {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;
  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full sm:w-[400px] h-[80vh] sm:h-[60vh] sm:rounded-2xl rounded-t-2xl flex flex-col animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-2xl">
          <h3 className="font-black text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full"><X size={18} /></button>
        </div>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search country..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-9 pr-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#1a4484] text-[16px] sm:text-[14px] font-semibold text-slate-800"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filteredCountries.map(country => (
            <button 
              key={country}
              onClick={() => { onSelect(country); onClose(); }}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-0 font-semibold text-slate-700 text-[15px] sm:text-[14px] transition-colors"
            >
              {country}
            </button>
          ))}
          {filteredCountries.length === 0 && (
            <p className="text-center text-slate-400 mt-10 text-sm">No country found</p>
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Smart Date Picker Modal (Mobile Only)
export const SmartDatePickerModal = ({ isOpen, onClose, onComplete, title, yearList }) => {
  const [step, setStep] = useState('day');
  const [selectedDate, setSelectedDate] = useState({ day: '', month: '', year: '' });

  useEffect(() => {
    if (isOpen) {
      setStep('day');
      setSelectedDate({ day: '', month: '', year: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectDay = (day) => {
    setSelectedDate(prev => ({ ...prev, day }));
    setStep('month');
  };

  const handleSelectMonth = (month) => {
    setSelectedDate(prev => ({ ...prev, month }));
    setStep('year');
  };

  const handleSelectYear = (year) => {
    const finalDate = { ...selectedDate, year };
    setSelectedDate(finalDate);
    onComplete(finalDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200 md:hidden">
      <div className="bg-white w-full h-[75vh] rounded-t-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-300">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-2xl">
          <h3 className="font-black text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full"><X size={18} /></button>
        </div>
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2">
          <button onClick={() => setStep('day')} className={`flex-1 py-2 text-center text-[12px] font-bold rounded-md transition-colors ${step === 'day' ? 'bg-white shadow-sm text-[#1a4484] border border-slate-200' : 'text-slate-500'}`}>
            {selectedDate.day || 'Day'}
          </button>
          <div className="flex items-center text-slate-300 px-1"><ChevronDown size={14} className="-rotate-90"/></div>
          <button onClick={() => selectedDate.day && setStep('month')} className={`flex-1 py-2 text-center text-[12px] font-bold rounded-md transition-colors ${step === 'month' ? 'bg-white shadow-sm text-[#1a4484] border border-slate-200' : 'text-slate-500'}`}>
            {selectedDate.month || 'Month'}
          </button>
          <div className="flex items-center text-slate-300 px-1"><ChevronDown size={14} className="-rotate-90"/></div>
          <button onClick={() => selectedDate.month && setStep('year')} className={`flex-1 py-2 text-center text-[12px] font-bold rounded-md transition-colors ${step === 'year' ? 'bg-white shadow-sm text-[#1a4484] border border-slate-200' : 'text-slate-500'}`}>
            {selectedDate.year || 'Year'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {step === 'day' && (
            <div className="flex flex-col">
              {DAYS.map(day => (
                <button key={day} onClick={() => handleSelectDay(day)} className="w-full text-left py-3 px-4 border-b border-slate-100 last:border-0 hover:bg-blue-50 text-slate-800 font-bold text-[15px] transition-colors">
                  {day}
                </button>
              ))}
            </div>
          )}
          {step === 'month' && (
            <div className="flex flex-col">
              {MONTHS.map(month => (
                <button key={month} onClick={() => handleSelectMonth(month)} className="w-full text-left py-3 px-4 border-b border-slate-100 last:border-0 hover:bg-blue-50 text-slate-800 font-bold text-[15px] transition-colors">
                  {month}
                </button>
              ))}
            </div>
          )}
          {step === 'year' && (
            <div className="flex flex-col">
              {yearList.map(year => (
                <button key={year} onClick={() => handleSelectYear(year)} className="w-full text-left py-3 px-4 border-b border-slate-100 last:border-0 hover:bg-blue-50 text-slate-800 font-bold text-[15px] transition-colors">
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Desktop Inline Smart Date Picker
const DesktopDateSelectBox = ({ type, placeholder, options, value, onSelect, isActive, onOpen }) => {
  const [search, setSearch] = useState('');
  
  useEffect(() => { 
    if (!isActive) setSearch(value ? value.toString() : ''); 
  }, [value, isActive]);

  const filteredOptions = options.filter(o => 
    o.toString().toLowerCase().includes(String(search).toLowerCase())
  );

  return (
    <div className="relative flex-1 flex flex-col">
       <div className={`relative w-full h-11 bg-white border ${isActive ? 'border-[#1a4484] ring-1 ring-[#1a4484]' : 'border-slate-300 hover:border-[#1a4484]'} rounded-lg flex items-center overflow-hidden transition-all`}>
         <input
           type="text"
           value={isActive ? search : (value || '')}
           onChange={(e) => { setSearch(e.target.value); onOpen(type); }}
           onFocus={() => onOpen(type)}
           placeholder={placeholder}
           className="w-full h-full pl-2 sm:pl-3 pr-7 outline-none text-[12px] sm:text-[13px] font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium text-ellipsis"
         />
         <div className="absolute right-1 sm:right-2 flex items-center gap-1 bg-white pointer-events-none shrink-0">
            {isActive ? <Search size={14} className="text-slate-300" /> : null}
            {!isActive && !value ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : null}
            {value ? <CheckCircle size={14} className="text-emerald-500 shrink-0" /> : null}
         </div>
       </div>
       
       {isActive && (
         <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
           {filteredOptions.length > 0 ? filteredOptions.map(opt => (
             <div 
               key={opt} 
               onClick={(e) => { e.stopPropagation(); onSelect(type, opt); }}
               className={`px-3 py-2.5 text-[13px] font-bold cursor-pointer transition-colors ${value === opt.toString() ? 'bg-blue-50 text-[#1a4484]' : 'text-slate-700 hover:bg-slate-50'}`}
             >
               {opt}
             </div>
           )) : (
             <div className="px-3 py-2.5 text-[12px] text-slate-400 text-center">No results</div>
           )}
         </div>
       )}
    </div>
  );
};

export const DesktopSmartDatePicker = ({ value, onChange, yearList }) => {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'day', 'month', 'year'
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type, val) => {
    const newValue = { ...value, [type]: val.toString() };
    onChange(newValue);
    
    // Auto-advance logic
    if (type === 'day') setActiveDropdown('month');
    else if (type === 'month') setActiveDropdown('year');
    else setActiveDropdown(null);
  };

  return (
    <div className="hidden md:flex relative gap-2 w-full" ref={ref}>
      <DesktopDateSelectBox type="day" placeholder="Day" options={DAYS} value={value.day} onSelect={handleSelect} isActive={activeDropdown === 'day'} onOpen={setActiveDropdown} />
      <DesktopDateSelectBox type="month" placeholder="Month" options={MONTHS} value={value.month} onSelect={handleSelect} isActive={activeDropdown === 'month'} onOpen={setActiveDropdown} />
      <DesktopDateSelectBox type="year" placeholder="Year" options={yearList} value={value.year} onSelect={handleSelect} isActive={activeDropdown === 'year'} onOpen={setActiveDropdown} />
    </div>
  );
};

// 4. Image Preview Lightbox
const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;
  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
        <X size={24} />
      </button>
      <img src={imageUrl} alt="Passport Preview" className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()} />
    </div>
  );
};

// --- MAIN BOOKING COMPONENT ---

const Stepper = ({ currentStep, onBack, bookingType }) => {
  const lastStepName = bookingType === 'umrah' ? 'Confirmation' : 'E-Ticket';
  
  const steps = [
    { id: 1, name: 'Travelers', icon: Users },
    { id: 2, name: 'Review', icon: FileText },
    { id: 3, name: 'Payment', icon: CreditCard },
    { id: 4, name: lastStepName, icon: CheckCircle }
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[65px] md:h-[70px]">
          <div className="w-1/4 flex items-center">
             <button 
                onClick={onBack}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 transition-colors"
             >
               <ArrowLeft size={16} strokeWidth={2} />
             </button>
          </div>
          <div className="flex-1 flex justify-center items-center">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon; 

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-1.5 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 bg-white ${
                      isActive ? 'border-2 border-[#1a4484] text-[#1a4484]' : 
                      isCompleted ? 'border border-[#1a4484] text-[#1a4484]' : 
                      'border border-slate-200 text-slate-300'
                    }`}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />}
                    </div>
                    <span className={`absolute -bottom-4 text-[8px] font-extrabold uppercase tracking-widest whitespace-nowrap ${
                      isActive ? 'text-[#1a4484]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 md:w-20 h-px mb-4 transition-colors duration-500 ${
                      isCompleted ? 'bg-[#1a4484]' : 'bg-slate-200'
                    }`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="w-1/4 flex justify-end"></div>
        </div>
      </div>
    </div>
  );
};

// --- SHIMMER / LOADING COMPONENT ---
const BookingShimmer = () => {
    return (
        <div className="bg-[#fafcff] min-h-screen font-sans pb-28">
            {/* Stepper Shimmer */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-100 p-4 shadow-sm">
                <div className="max-w-[1000px] mx-auto flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
                    <div className="flex gap-4">
                        <div className="w-24 h-2 bg-slate-100 rounded-full animate-pulse"></div>
                        <div className="w-24 h-2 bg-slate-100 rounded-full animate-pulse"></div>
                        <div className="w-24 h-2 bg-slate-100 rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
                </div>
            </div>

            <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                    {/* Left Content Shimmer */}
                    <div className="w-full lg:w-[65%] space-y-6">
                        <div className="h-64 bg-white rounded-xl border border-slate-100 p-6 space-y-4">
                            <div className="w-1/3 h-6 bg-slate-50 rounded animate-pulse"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-12 bg-slate-50 rounded animate-pulse"></div>
                                <div className="h-12 bg-slate-50 rounded animate-pulse"></div>
                            </div>
                            <div className="h-24 bg-slate-50 rounded animate-pulse"></div>
                        </div>
                        <div className="h-48 bg-white rounded-xl border border-slate-100 p-6 space-y-4">
                            <div className="w-1/4 h-6 bg-slate-50 rounded animate-pulse"></div>
                            <div className="h-12 bg-slate-50 rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Right Content Shimmer */}
                    <div className="w-full lg:w-[35%] space-y-4">
                        <div className="h-80 bg-white rounded-xl border border-slate-100 p-6 space-y-6">
                            <div className="w-1/2 h-6 bg-slate-50 rounded animate-pulse"></div>
                            <div className="space-y-3">
                                <div className="flex justify-between"><div className="w-1/3 h-3 bg-slate-50 rounded animate-pulse"></div><div className="w-1/4 h-3 bg-slate-50 rounded animate-pulse"></div></div>
                                <div className="flex justify-between"><div className="w-1/3 h-3 bg-slate-50 rounded animate-pulse"></div><div className="w-1/4 h-3 bg-slate-50 rounded animate-pulse"></div></div>
                            </div>
                            <div className="h-12 bg-slate-50 rounded animate-pulse mt-10"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export const BookingView = ({
  bookingType = 'ticket',
  selectedFlightForBooking,
  selectedUmrahPackage,
  selectedUmrahRoom,
  totalTravelers = 1,
  calculateTotalPriceForFlight,
  selectedFares,
  onBack,
  setCurrentView,
  onSignIn
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const FLIGHT_DETAILS = bookingType === 'umrah' ? {
    airline: selectedUmrahPackage?.airline?.name || FLIGHT_DETAILS_MOCK.airline,
    logo: selectedUmrahPackage?.airline?.logo || FLIGHT_DETAILS_MOCK.logo,
    flightNo: selectedUmrahPackage?.flights?.depart?.no || FLIGHT_DETAILS_MOCK.flightNo,
    date: selectedUmrahPackage?.travelDate || FLIGHT_DETAILS_MOCK.date,
    depart: {
      time: selectedUmrahPackage?.flights?.depart?.time || FLIGHT_DETAILS_MOCK.depart.time,
      city: selectedUmrahPackage?.flights?.depart?.from || FLIGHT_DETAILS_MOCK.depart.city,
      code: selectedUmrahPackage?.flights?.depart?.from || 'LHE'
    },
    arrive: {
      time: selectedUmrahPackage?.flights?.depart?.arrTime || FLIGHT_DETAILS_MOCK.arrive.time,
      city: selectedUmrahPackage?.flights?.depart?.to || FLIGHT_DETAILS_MOCK.arrive.city,
      code: selectedUmrahPackage?.flights?.depart?.to || 'JED'
    },
    duration: selectedUmrahPackage?.flights?.depart?.duration || FLIGHT_DETAILS_MOCK.duration,
    class: 'Premium',
    baggage: '30kg + 7kg Cabin'
  } : {
    airline: selectedFlightForBooking?.airline?.name || FLIGHT_DETAILS_MOCK.airline,
    logo: selectedFlightForBooking?.airline?.logo || FLIGHT_DETAILS_MOCK.logo,
    flightNo: selectedFlightForBooking?.id || FLIGHT_DETAILS_MOCK.flightNo,
    date: '15 Feb 2026', // Mock date
    depart: {
      time: selectedFlightForBooking?.depTime || FLIGHT_DETAILS_MOCK.depart.time,
      city: 'Origin',
      code: 'LHE'
    },
    arrive: {
      time: selectedFlightForBooking?.arrTime || FLIGHT_DETAILS_MOCK.arrive.time,
      city: 'Destination',
      code: 'JED'
    },
    duration: selectedFlightForBooking?.duration || FLIGHT_DETAILS_MOCK.duration,
    class: 'Economy',
    baggage: '30kg + 7kg Cabin'
  };

  const dynamicTotal = bookingType === 'umrah'
    ? ((selectedUmrahPackage?.rates?.[selectedUmrahRoom?.toLowerCase()] || 215000) * totalTravelers)
    : (calculateTotalPriceForFlight ? calculateTotalPriceForFlight(selectedFlightForBooking, selectedFares) : PRICE_DETAILS_MOCK.total);

  const PRICE_DETAILS = {
    baseFare: Math.floor(dynamicTotal * 0.9),
    taxes: dynamicTotal - Math.floor(dynamicTotal * 0.9),
    discount: 0,
    total: dynamicTotal,
    minDepositUmrah: PRICE_DETAILS_MOCK.minDepositUmrah
  };

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentAmount, setPaymentAmount] = useState(PRICE_DETAILS.total);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedAtmBank, setSelectedAtmBank] = useState('');

  // Timers State
  const [bookingTimer, setBookingTimer] = useState(15 * 60); // 15 mins
  const [paymentTimer, setPaymentTimer] = useState(60 * 60 + 52 * 60 + 42); // Exact time: 01h 52m 42s

  // Traveler State
  const [traveler, setTraveler] = useState({
    title: 'Mr',
    givenName: '',
    surname: '',
    passportNo: '',
    nationality: 'Pakistan',
    issuingAuth: 'Pakistan',
    dob: { day: '', month: '', year: '' },
    passIssue: { day: '', month: '', year: '' },
    passExpiry: { day: '', month: '', year: '' },
    passportImage: null
  });

  const [contactInfo, setContactInfo] = useState({
    email: 'ahsaan.razabutt@gmail.com',
    phone: '+923000000000'
  });

  // Popup States
  const [activePopup, setActivePopup] = useState(null); 
  const [previewImage, setPreviewImage] = useState(false);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const fileInputRef = useRef(null);

  const nextStep = () => {
    if (currentStep === 2) {
      setIsGeneratingPayment(true);
      setCurrentStep(3);
      setTimeout(() => {
        setIsGeneratingPayment(false);
      }, 1500);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };
  
  const prevStep = () => {
    if (currentStep === 1) onBack();
    else setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (bookingType !== 'umrah') {
      setPaymentAmount(PRICE_DETAILS.total);
    }
  }, [bookingType, paymentMethod, PRICE_DETAILS.total]);

  // Handle Timers
  useEffect(() => {
    let timerId;
    if (bookingType && currentStep < 3 && bookingTimer > 0) {
      timerId = setTimeout(() => setBookingTimer(prev => prev - 1), 1000);
    } else if (bookingType && currentStep === 3 && paymentTimer > 0) {
      timerId = setTimeout(() => setPaymentTimer(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timerId);
  }, [currentStep, bookingTimer, paymentTimer, bookingType]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}m ${s}s`;
  };

  const formatDateProp = (dateObj, placeholder = '') => {
    if (dateObj.day && dateObj.month && dateObj.year) {
      return `${dateObj.day} ${dateObj.month} ${dateObj.year}`;
    }
    return placeholder;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTraveler({...traveler, passportImage: imageUrl});
    }
  };

  const removePassportImage = () => {
    setTraveler({...traveler, passportImage: null});
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const inputClass = "w-full h-11 px-3 bg-transparent border border-slate-300 rounded-lg focus:border-[#1a4484] outline-none font-semibold text-slate-800 transition-colors text-[16px] sm:text-[13px] placeholder:font-medium placeholder:text-slate-400";
  const labelClass = "text-[10px] font-bold text-slate-800 mb-1.5 block uppercase tracking-wider";
  const pickerButtonClass = "w-full h-11 px-3 bg-transparent border border-slate-300 rounded-lg outline-none font-semibold text-slate-800 transition-colors text-[16px] sm:text-[13px] flex items-center justify-between cursor-pointer hover:border-slate-400 text-left md:hidden";


  // --- STEP 1: TRAVELERS VIEW ---
  const renderTravelersStep = () => (
    <div className="animate-in fade-in duration-300 space-y-4">
      <div className="flex items-end justify-between mb-2">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">Passenger Details</h2>
          <p className="text-slate-500 font-medium text-[13px] sm:text-[12px] mt-1.5">Enter details exactly as they appear on your passport.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200">
        <h3 className="text-[13px] font-black text-[#1a4484] mb-4 flex items-center gap-2">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className={`${inputClass} pl-10 sm:pl-9`} 
                value={contactInfo.email}
                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              />
            </div>
          </div>
          <div className="relative">
            <label className={labelClass}>Phone Number</label>
            <div className="flex h-11 w-full border border-slate-300 rounded-lg overflow-hidden focus-within:border-[#1a4484] transition-colors bg-transparent">
              <div className="flex items-center px-3 border-r border-slate-300 font-bold text-slate-600 text-[16px] sm:text-[12px]">PK <span className="text-slate-400 ml-1">+92</span></div>
              <input 
                type="tel" 
                placeholder="300 0000000" 
                className="flex-1 px-3 outline-none font-semibold text-slate-800 bg-transparent text-[16px] sm:text-[13px]" 
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200">
        <h3 className="text-[14px] font-black text-[#1a4484] mb-4">Traveler Details for Adult 1</h3>
        
        <div className="mb-5">
          <label className={labelClass}>Saved Travelers</label>
          <div className="relative mb-3">
            <select className={`${inputClass} appearance-none pr-8 text-slate-500 font-medium cursor-pointer`}>
              <option>+ Add a new traveler</option>
              <option>Ahmed Khan (Self)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 flex items-center">
            <span className="text-[13px] sm:text-[12px] font-medium text-slate-700">
              <a 
                href="#/signin" 
                onClick={(e) => { e.preventDefault(); if(onSignIn) onSignIn(); }} 
                className="font-bold text-[#1a4484] hover:underline"
              >
                Sign in
              </a> to view your Saved Travelers List.
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Select Title</label>
          <div className="grid grid-cols-3 gap-3">
            {['Mr', 'Mrs', 'Ms'].map(t => (
              <label key={t} className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${traveler.title === t ? 'border-[#1a4484] shadow-sm bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="title" className="hidden" checked={traveler.title === t} onChange={() => setTraveler({...traveler, title: t})} />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${traveler.title === t ? 'border-[#1a4484]' : 'border-slate-300'}`}>
                  {traveler.title === t && <div className="w-2 h-2 rounded-full bg-[#1a4484]"></div>}
                </div>
                <span className={`text-[14px] sm:text-[13px] ${traveler.title === t ? 'font-bold text-[#1a4484]' : 'font-semibold text-slate-700'}`}>{t}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Given Name</label>
            <input type="text" placeholder="As per passport" value={traveler.givenName} onChange={e => setTraveler({...traveler, givenName: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Surname</label>
            <input type="text" placeholder="As per passport" value={traveler.surname} onChange={e => setTraveler({...traveler, surname: e.target.value})} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Date of Birth</label>
            <button type="button" onClick={() => setActivePopup('dob')} className={pickerButtonClass}>
              <span className={traveler.dob.year ? "text-slate-800" : "text-slate-400 font-medium"}>{formatDateDisplay(traveler.dob, "Select Date of Birth")}</span>
              <Calendar size={16} className="text-slate-400" />
            </button>
            <DesktopSmartDatePicker value={traveler.dob} onChange={(v) => setTraveler({...traveler, dob: v})} yearList={YEARS_DOB} />
          </div>
          <div>
            <label className={labelClass}>Passport Number</label>
            <div className="relative group">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4484] transition-colors" size={16} />
              <input type="text" placeholder="e.g. PK123456" value={traveler.passportNo} onChange={e => setTraveler({...traveler, passportNo: e.target.value})} className={`${inputClass} pl-10 sm:pl-9 uppercase`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Passport Issue Date</label>
            <button type="button" onClick={() => setActivePopup('passIssue')} className={pickerButtonClass}>
              <span className={traveler.passIssue.year ? "text-slate-800" : "text-slate-400 font-medium"}>{formatDateDisplay(traveler.passIssue, "Select Issue Date")}</span>
              <Calendar size={16} className="text-slate-400" />
            </button>
            <DesktopSmartDatePicker value={traveler.passIssue} onChange={(v) => setTraveler({...traveler, passIssue: v})} yearList={YEARS_PASS} />
          </div>
          <div>
            <label className={labelClass}>Issuing Authority / Nationality</label>
            <button type="button" onClick={() => setActivePopup('nationality')} className={pickerButtonClass}>
              <div className="flex items-center gap-2">
                 <Globe size={16} className="text-slate-400" />
                 <span className={traveler.nationality ? "text-slate-800" : "text-slate-400 font-medium"}>{traveler.nationality || 'Select Country'}</span>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            <div className="hidden md:block">
              <CustomSelect 
                options={COUNTRIES} 
                value={traveler.nationality} 
                onChange={(v) => setTraveler({...traveler, nationality: v})} 
                placeholder="Search country..." 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className={labelClass}>Passport Expiry Date</label>
            <button type="button" onClick={() => setActivePopup('passExpiry')} className={pickerButtonClass}>
              <span className={traveler.passExpiry.year ? "text-slate-800" : "text-slate-400 font-medium"}>{formatDateDisplay(traveler.passExpiry, "Select Expiry Date")}</span>
              <Calendar size={16} className="text-slate-400" />
            </button>
            <DesktopSmartDatePicker value={traveler.passExpiry} onChange={(v) => setTraveler({...traveler, passExpiry: v})} yearList={YEARS_PASS} />
          </div>
        </div>

        {bookingType === 'umrah' && (
          <div className="border-t border-slate-100 pt-4 mt-2">
            <input type="file" id="passport-upload" className="hidden" accept="image/*" onChange={handleFileUpload} ref={fileInputRef}/>
            
            {!traveler.passportImage ? (
              <>
                <button onClick={() => fileInputRef.current.click()} className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-[#1a4484]/5 hover:bg-[#1a4484]/10 text-[#1a4484] font-bold text-[14px] sm:text-[13px] rounded-lg transition-colors border border-[#1a4484]/20">
                  <UploadCloud size={18} /> Upload Passport Image
                </button>
                <p className="text-[11px] sm:text-[10px] text-slate-400 mt-2 font-medium">Mandatory for Umrah Visas: Upload a clear image of your passport data page.</p>
              </>
            ) : (
              <div className="flex items-center justify-between p-3 border border-[#1a4484]/20 bg-[#1a4484]/5 rounded-lg w-full sm:w-80">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded border border-[#1a4484]/20 overflow-hidden flex items-center justify-center cursor-pointer relative group" onClick={() => setPreviewImage(true)}>
                       <img src={traveler.passportImage} alt="Passport" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Eye size={14} className="text-white" />
                       </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-800 block">Passport Uploaded</span>
                      <span className="text-[9px] text-[#1a4484] font-bold uppercase tracking-widest flex items-center gap-1"><Check size={10}/> Success</span>
                    </div>
                 </div>
                 <button onClick={removePassportImage} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 size={14} />
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // --- STEP 2: REVIEW VIEW ---
  const renderReviewStep = () => (
    <div className="animate-in fade-in duration-300 space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Review Itinerary</h2>
        <p className="text-slate-500 font-medium text-[13px] sm:text-[12px] mt-1.5">Please verify your flight details and passenger information.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
         <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src={FLIGHT_DETAILS.logo} alt="Airline" className="h-5 object-contain" />
              <div>
                <h3 className="font-bold text-slate-900 text-[13px] sm:text-[12px]">{FLIGHT_DETAILS.airline}</h3>
                <p className="text-[10px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest">{FLIGHT_DETAILS.flightNo} • {FLIGHT_DETAILS.class}</p>
              </div>
            </div>
            <span className="text-[10px] sm:text-[9px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">{FLIGHT_DETAILS.date}</span>
         </div>
         <div className="flex items-center justify-between w-full relative mb-5 px-1">
            <div className="flex flex-col items-start w-1/3">
               <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{FLIGHT_DETAILS.depart.code}</span>
               <span className="text-[15px] sm:text-[14px] font-black text-[#1a4484] mt-1">{FLIGHT_DETAILS.depart.time}</span>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 px-3 relative">
               <span className="text-[10px] sm:text-[9px] font-bold text-slate-400 mb-1">{FLIGHT_DETAILS.duration}</span>
               <div className="w-full flex items-center">
                 <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                 <div className="flex-1 border-t border-slate-200"></div>
                 <Plane className="text-slate-400 shrink-0 mx-2" size={14} />
                 <div className="flex-1 border-t border-slate-200"></div>
                 <div className="w-1 h-1 rounded-full bg-slate-300"></div>
               </div>
            </div>
            <div className="flex flex-col items-end w-1/3 text-right">
               <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{FLIGHT_DETAILS.arrive.code}</span>
               <span className="text-[15px] sm:text-[14px] font-black text-[#1a4484] mt-1">{FLIGHT_DETAILS.arrive.time}</span>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <User size={14} className="text-slate-500" />
               <span className="text-[12px] font-black text-[#1a4484] uppercase tracking-widest">Traveler Details</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-bold text-slate-500 border border-slate-200 bg-white px-1.5 py-0.5 rounded capitalize">{bookingType} Booking</span>
               <button onClick={prevStep} className="text-[9px] font-bold text-[#1a4484] uppercase tracking-widest hover:underline px-2">Edit</button>
            </div>
         </div>
         
         <div className="p-5 flex flex-col md:flex-row justify-between gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 flex-1">
               <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Full Name</p>
                 <p className="text-[13px] font-bold text-slate-800">{traveler.title} {traveler.givenName || 'Ahmed'} {traveler.surname || 'Khan'}</p>
               </div>
               <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Passport Number</p>
                 <p className="text-[13px] font-bold text-slate-800 uppercase">{traveler.passportNo || 'PK123456'}</p>
               </div>
               <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nationality</p>
                 <p className="text-[13px] font-bold text-slate-800">{traveler.nationality || 'Pakistan'}</p>
               </div>
               <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date of Birth</p>
                 <p className="text-[12px] font-bold text-slate-800">{traveler.dob.year ? formatDateDisplay(traveler.dob) : '10 Mar 1990'}</p>
               </div>
               <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Issue Date</p>
                 <p className="text-[12px] font-bold text-slate-800">{traveler.passIssue.year ? formatDateDisplay(traveler.passIssue) : '05 Jan 2020'}</p>
               </div>
               <div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Expiry Date</p>
                 <p className="text-[12px] font-bold text-slate-800">{traveler.passExpiry.year ? formatDateDisplay(traveler.passExpiry) : '05 Jan 2030'}</p>
               </div>
            </div>

            {traveler.passportImage && (
              <div className="w-full md:w-32 flex flex-col items-center justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 w-full text-left md:text-center">Passport Scan</p>
                 <button 
                   onClick={() => setPreviewImage(true)}
                   className="w-full h-24 border border-slate-200 rounded-lg overflow-hidden relative group"
                 >
                    <img src={traveler.passportImage} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Passport Scan" />
                    <div className="absolute inset-0 bg-[#1a4484]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white text-[#1a4484] p-1.5 rounded-full shadow-sm">
                        <Eye size={14} />
                      </div>
                    </div>
                 </button>
              </div>
            )}
         </div>
      </div>
    </div>
  );

  // --- STEP 3: PAYMENT VIEW ---
  const renderPaymentStep = () => {
    if (isGeneratingPayment) {
      return (
        <div className="animate-in fade-in duration-300 space-y-4">
          <div className="mb-6 space-y-4">
            <div className="h-8 bg-slate-200 rounded-md w-48 animate-pulse"></div>
            <div className="bg-slate-200 rounded-xl h-32 md:h-36 w-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 mt-4 space-y-4">
             <div className="h-4 bg-slate-200 rounded w-32 animate-pulse mb-6"></div>
             <div className="h-11 bg-slate-100 rounded-lg w-full animate-pulse"></div>
             <div className="h-11 bg-slate-100 rounded-lg w-full animate-pulse"></div>
             <div className="grid grid-cols-2 gap-4">
                <div className="h-11 bg-slate-100 rounded-lg animate-pulse"></div>
                <div className="h-11 bg-slate-100 rounded-lg animate-pulse"></div>
             </div>
          </div>
        </div>
      );
    }

    const isSplitAllowed = bookingType === 'umrah' && ['bank', 'wallet', 'atm', '1bill'].includes(paymentMethod);

    const handleAmountChange = (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) val = PRICE_DETAILS.minDepositUmrah;
      if (val > PRICE_DETAILS.total) val = PRICE_DETAILS.total;
      setPaymentAmount(val);
    };

    const handleAmountBlur = () => {
      if (paymentAmount < PRICE_DETAILS.minDepositUmrah) {
        setPaymentAmount(PRICE_DETAILS.minDepositUmrah);
      }
    };

    return (
      <div className="animate-in fade-in duration-300 space-y-4">
        
        <div className="mb-6 space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Secure Payment</h2>
          </div>

          <div className="bg-[#1a4484] text-white rounded-xl p-5 md:p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 w-full sm:w-auto text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-2 py-1 rounded text-[9px] font-bold text-blue-100 uppercase tracking-widest mb-3">
                 <Ticket size={12} /> Booking Ref: Y7B9Q2
              </div>
              <h3 className="text-[16px] md:text-lg font-black mb-1 leading-snug">
                Dear {traveler.title} {traveler.givenName || 'Ahmed'} {traveler.surname || 'Khan'},
              </h3>
              <p className="text-[12px] text-blue-200 font-medium">
                Your {bookingType === 'umrah' ? 'Umrah Package' : 'Flight Ticket'} is currently on hold. Please complete the payment to confirm your reservation.
              </p>
            </div>

            <div className="relative z-10 shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3.5 flex items-center gap-3.5 w-full sm:w-auto justify-center sm:justify-start shadow-inner">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1a4484] shadow-sm shrink-0">
                 {bookingType === 'umrah' ? <Globe size={20} /> : <Plane size={20} />}
               </div>
               <div className="text-left min-w-0">
                 <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest leading-none mb-1">
                   {bookingType === 'umrah' ? 'Package Summary' : 'Flight Summary'}
                 </p>
                 <p className="text-[13px] md:text-[14px] font-black text-white leading-tight truncate">
                   {bookingType === 'umrah' ? '15 Days Premium Umrah' : `${FLIGHT_DETAILS.depart.code} to ${FLIGHT_DETAILS.arrive.code}`}
                 </p>
                 <p className="text-[10px] font-medium text-blue-100 mt-0.5">
                   {bookingType === 'umrah' ? 'Makkah & Madinah' : FLIGHT_DETAILS.airline}
                 </p>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: 'card', label: 'Credit Card', icon: CreditCard },
            { id: 'bank', label: '1 BILL / Bank Transfer', icon: Building },
            { id: 'atm', label: '1 BILL / ATM', icon: Landmark }, 
            { id: 'wallet', label: '1 BILL / Digital Wallets', icon: Smartphone },
            { id: '1bill', label: 'OVER THE COUNTER / 1BILL', icon: Banknote } 
          ].map(method => {
            const Icon = method.icon; 
            return (
              <label key={method.id} className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all ${paymentMethod === method.id ? 'border-[#1a4484] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e)=>setPaymentMethod(e.target.value)} className="hidden"/>
                  <Icon size={18} className={paymentMethod === method.id ? 'text-[#1a4484]' : 'text-slate-400'} />
                  <span className={`text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-center ${paymentMethod === method.id ? 'text-[#1a4484]' : 'text-slate-500'}`}>
                    {method.label}
                  </span>
              </label>
            );
          })}
        </div>

        {isSplitAllowed && (
          <div className="bg-white rounded-xl p-4 md:p-5 border border-[#1a4484]/30 shadow-sm animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1a4484]"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-[#1a4484] text-[13px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <AlertCircle size={14} /> Partial Payment Available
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">For Umrah packages, you can secure your booking by paying a minimum deposit today.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full flex-1">
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                   <span>Min: PKR {PRICE_DETAILS.minDepositUmrah.toLocaleString()}</span>
                   <span>Max: PKR {PRICE_DETAILS.total.toLocaleString()}</span>
                 </div>
                 <input 
                   type="range" 
                   min={PRICE_DETAILS.minDepositUmrah} 
                   max={PRICE_DETAILS.total} 
                   step="1000"
                   value={paymentAmount}
                   onChange={handleAmountChange}
                   className="w-full accent-[#1a4484] h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                 />
              </div>
              <div className="w-full sm:w-40 shrink-0 relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[13px]">PKR</span>
                <input 
                  type="number" 
                  value={paymentAmount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  className="w-full h-11 pl-12 pr-3 bg-white border border-slate-300 rounded-lg focus:border-[#1a4484] outline-none font-black text-slate-800 transition-colors text-[14px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Forms based on Payment Method */}
        {paymentMethod === 'card' && (
          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 animate-in fade-in">
             <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-800 text-[12px] sm:text-[11px] uppercase tracking-widest">Card Details</h3>
              <div className="flex gap-2">
                <div className="w-7 h-4 bg-white rounded border border-slate-200 flex items-center justify-center text-[7px] font-black text-blue-800 italic">VISA</div>
                <div className="w-7 h-4 bg-white rounded border border-slate-200 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mix-blend-multiply"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mix-blend-multiply -ml-1"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Cardholder Name</label>
                <input type="text" placeholder="AHMED KHAN" className={`${inputClass} uppercase`} />
              </div>
              
              <div>
                <label className={labelClass}>Card Number</label>
                <div className="relative group">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a4484] transition-colors" size={16} />
                  <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" className={`${inputClass} pl-10 sm:pl-9 font-mono tracking-widest text-[14px] sm:text-[12px]`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" maxLength="5" className={inputClass} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between pl-0.5">
                    CVC/CVV <Info size={12} className="text-slate-300" />
                  </label>
                  <div className="relative group">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a4484] transition-colors" size={14} />
                    <input type="password" placeholder="•••" maxLength="4" className={`${inputClass} pr-10 sm:pr-9 font-mono tracking-widest text-[14px] sm:text-[12px]`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'bank' && (
          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 animate-in fade-in">
             <label className={labelClass}>Select Transfer Method</label>
             <div className="relative mb-5 flex items-center justify-between border border-slate-300 rounded-lg h-11 px-3 bg-slate-50">
               <span className="font-bold text-slate-800 text-[13px]">1 BILL / Bank Transfer</span>
               <Pencil size={14} className="text-[#1a4484]" />
             </div>

             <label className={labelClass}>Select Bank</label>
             <CustomSelect 
                options={PAK_BANKS} 
                value={selectedBank} 
                onChange={setSelectedBank} 
                placeholder="Enter Bank Name" 
             />
             {selectedBank && (
               <div className="mt-5 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                 <h3 className="font-bold text-slate-800 text-[14px] mb-3">Steps to Pay</h3>
                 <ol className="space-y-3 text-[12px] text-slate-600 font-medium mb-5">
                   <li className="flex gap-2"><span>1-</span> Log in to your Bank/Wallet app.</li>
                   <li className="flex gap-2"><span>2-</span> Select Bill Payments or 1Bill Invoice payment.</li>
                   <li className="flex gap-2"><span>3-</span> Enter the Consumer ID provided below.</li>
                   <li className="flex gap-2"><span>4-</span> Verify the amount and complete payment.</li>
                   <li className="flex gap-2"><span>5-</span> You will instantly be notified upon confirmation.</li>
                 </ol>
                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Consumer ID</p>
                      <p className="text-lg font-black text-[#1a4484] tracking-widest font-mono">{CONSUMER_ID}</p>
                    </div>
                    <InlineCopy text={CONSUMER_ID} />
                 </div>
               </div>
             )}
          </div>
        )}

        {paymentMethod === 'atm' && (
          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 animate-in fade-in">
             <label className={labelClass}>Select Transfer Method</label>
             <div className="relative mb-5 flex items-center justify-between border border-slate-300 rounded-lg h-11 px-3 bg-slate-50">
               <span className="font-bold text-slate-800 text-[13px]">1 BILL / ATM</span>
               <Pencil size={14} className="text-[#1a4484]" />
             </div>

             <label className={labelClass}>Select Bank</label>
             <CustomSelect 
                options={PAK_BANKS} 
                value={selectedAtmBank} 
                onChange={setSelectedAtmBank} 
                placeholder="Enter Bank Name" 
             />
             {selectedAtmBank && (
               <div className="mt-5 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                 <h3 className="font-bold text-slate-800 text-[14px] mb-3">Steps to Pay</h3>
                 <ol className="space-y-3 text-[12px] text-slate-600 font-medium mb-5">
                   <li className="flex gap-2"><span>1-</span> Visit your nearest ATM.</li>
                   <li className="flex gap-2"><span>2-</span> Select Bill Payments or 1Bill Invoice payment.</li>
                   <li className="flex gap-2"><span>3-</span> Enter the Consumer ID provided below.</li>
                   <li className="flex gap-2"><span>4-</span> Verify the amount and complete payment.</li>
                   <li className="flex gap-2"><span>5-</span> You will instantly be notified upon confirmation.</li>
                 </ol>
                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Consumer ID</p>
                      <p className="text-lg font-black text-[#1a4484] tracking-widest font-mono">{CONSUMER_ID}</p>
                    </div>
                    <InlineCopy text={CONSUMER_ID} />
                 </div>
               </div>
             )}
          </div>
        )}

        {paymentMethod === 'wallet' && (
          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 animate-in fade-in">
             <label className={labelClass}>Select Transfer Method</label>
             <div className="relative mb-5 flex items-center justify-between border border-slate-300 rounded-lg h-11 px-3 bg-slate-50">
               <span className="font-bold text-slate-800 text-[13px]">1 BILL / Digital Wallets</span>
               <Pencil size={14} className="text-[#1a4484]" />
             </div>

             <label className={labelClass}>Select Wallet</label>
             <CustomSelect 
                options={DIGITAL_WALLETS} 
                value={selectedWallet} 
                onChange={setSelectedWallet} 
                placeholder="Select Wallet" 
             />
             {selectedWallet && (
               <div className="mt-5 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                 <h3 className="font-bold text-slate-800 text-[14px] mb-3">Steps to Pay</h3>
                 <ol className="space-y-3 text-[12px] text-slate-600 font-medium mb-5">
                   <li className="flex gap-2"><span>1-</span> Log in to your Bank/Wallet app.</li>
                   <li className="flex gap-2"><span>2-</span> Select Bill Payments or 1Bill Invoice payment.</li>
                   <li className="flex gap-2"><span>3-</span> Enter the Consumer ID provided below.</li>
                   <li className="flex gap-2"><span>4-</span> Verify the amount and complete payment.</li>
                   <li className="flex gap-2"><span>5-</span> You will instantly be notified upon confirmation.</li>
                 </ol>
                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Consumer ID</p>
                      <p className="text-lg font-black text-[#1a4484] tracking-widest font-mono">{CONSUMER_ID}</p>
                    </div>
                    <InlineCopy text={CONSUMER_ID} />
                 </div>
               </div>
             )}
          </div>
        )}

        {paymentMethod === '1bill' && (
          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 animate-in fade-in">
             <label className={labelClass}>Select Transfer Method</label>
             <div className="relative mb-6 flex items-center justify-between border border-slate-300 rounded-lg h-11 px-3 bg-slate-50 cursor-pointer">
               <span className="font-bold text-slate-800 text-[13px]">OVER THE COUNTER / 1BILL</span>
               <Pencil size={14} className="text-[#1a4484]" />
             </div>

             <h3 className="font-bold text-slate-800 text-[14px] mb-3">Steps to Pay via OTC</h3>
             <ol className="space-y-3 text-[12px] text-slate-600 font-medium">
               <li className="flex gap-2"><span>1-</span> Take a hardcopy of your bill/challan to a bank/TCS branch.</li>
               <li className="flex gap-2"><span>2-</span> Present the bill to the teller and tell him that it's a 1Bill Invoice payment.</li>
               <li className="flex gap-2"><span>3-</span> Teller will pay the bill and collect cash from you.</li>
               <li className="flex gap-2"><span>4-</span> Take a paid receipt from teller.</li>
               <li className="flex gap-2"><span>5-</span> You will be instantly notified on the payment confirmation.</li>
             </ol>

             <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-[11px] text-slate-500 font-bold">
                  <span className="block mb-0.5">Payment Partners:</span>
                  <span className="text-[#1a4484] uppercase tracking-widest">TCS, HBL, Meezan, Faysal</span>
                </div>
                <button 
                  onClick={() => alert('Voucher will be downloaded automatically after you click Verify Payment Now.')}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#1a4484] border border-slate-200 py-2.5 px-4 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-colors w-full sm:w-auto shadow-sm"
                >
                  <Download size={14} /> Download Voucher
                </button>
             </div>
          </div>
        )}

      </div>
    );
  };

  // --- STEP 4: SUCCESS VIEW ---
  const renderSuccessStep = () => {
    const isUmrah = bookingType === 'umrah';
    const amountPaid = (isUmrah && ['bank', 'wallet', 'atm', '1bill'].includes(paymentMethod)) ? paymentAmount : PRICE_DETAILS.total;

    const handleDownloadReceipt = async () => {
      const orderId = "5657725";
      const paymentMethodLabels = {
        card: 'Credit / Debit Card',
        bank: 'Bank Transfer - 1BILL',
        atm: 'ATM - 1BILL',
        wallet: 'Digital Wallet - 1BILL',
        '1bill': 'Over the Counter - 1BILL'
      };

      const now = new Date();
      const dayName = now.toLocaleDateString('en-PK', { weekday: 'long' });
      const formattedDate = now.toLocaleString('en-PK', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });

      const receiptData = {
        bookingType: bookingType,
        customerName: `${traveler.title} ${traveler.givenName || 'Ahsan'} ${traveler.surname || 'Raza'}`.trim(),
        customerEmail: contactInfo.email,
        customerPhone: contactInfo.phone,
        orderId: orderId,
        paymentMethod: paymentMethodLabels[paymentMethod] || 'Online Payment',
        paymentStatus: 'Confirmed',
        flightDetails: {
          route: isUmrah
            ? `${FLIGHT_DETAILS.depart.code} → ${FLIGHT_DETAILS.arrive.code} (Umrah)`
            : `${FLIGHT_DETAILS.depart.code}-${FLIGHT_DETAILS.arrive.code}`,
          depart: `${FLIGHT_DETAILS.date} ${FLIGHT_DETAILS.depart.time}`,
          arrive: `${FLIGHT_DETAILS.date} ${FLIGHT_DETAILS.arrive.time}`,
          class: isUmrah ? 'Premium (Umrah)' : FLIGHT_DETAILS.class,
          flightNo: FLIGHT_DETAILS.flightNo
        },
        passengers: [
          {
            name: `${traveler.title} ${traveler.givenName || 'Ahsan'} ${traveler.surname || 'Raza'}`.trim(),
            ticketNo: isUmrah ? 'Pending Allocation' : '6734001601779',
            baggage: isUmrah ? 'Included in Package' : FLIGHT_DETAILS.baggage
          }
        ],
        orderTotal: PRICE_DETAILS.total.toLocaleString(),
        amountPaid: amountPaid.toLocaleString(),
        date: `${formattedDate} PKT (${dayName})`
      };

      await generateReceiptPDF(receiptData);
    };

    return (
      <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-6 md:py-10 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-100 rounded-full shadow-sm flex items-center justify-center mb-5">
           <Check size={32} className="text-emerald-500" strokeWidth={3} />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Thank you, {traveler.givenName || 'Ahsan'}!</h1>
        <p className="text-slate-600 font-medium text-[15px] sm:text-[14px] mb-8">
          {isUmrah 
            ? `Your payment was successful and your Umrah Package is confirmed!` 
            : `Your payment was successful and your E-Ticket has been issued!`} 
            <Plane className="inline -mt-1 ml-1 text-[#1a4484]" size={16}/>
        </p>

        {/* Main Order Box */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6 text-left">
           <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold text-[#1a4484] text-[14px]">Order ID # 5657725</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                 <CheckCircle size={12} strokeWidth={2.5} /> Payment Confirmed
              </span>
           </div>

           <div className="p-5 md:p-6">
              <h3 className="font-bold text-slate-800 text-[14px] mb-4">Booking Details & Next Steps</h3>
              
              <ul className="space-y-4 text-[13px] text-slate-600 font-medium list-disc list-inside pl-1 marker:text-slate-400">
                 <li>
                   <strong className="text-slate-800">Payment Status:</strong> Successfully received <span className="text-[#1a4484] font-black">PKR {amountPaid.toLocaleString()}</span>. Your transaction is complete.
                 </li>
                 <li>
                   <strong className="text-slate-800">Confirmation:</strong> An order confirmation and payment receipt have been sent to <span className="underline text-slate-800 cursor-pointer hover:text-[#1a4484]">ahsaan.razabutt@gmail.com</span> and via WhatsApp to <span className="underline text-slate-800 cursor-pointer hover:text-[#1a4484]">+923000000000</span>.
                 </li>
                 
                 {bookingType === 'ticket' ? (
                   <>
                     <li>
                       <strong className="text-slate-800">E-ticket Issued:</strong> Your E-ticket is ready! You can download it using the button below or access it anytime from <span className="text-[#1a4484] cursor-pointer hover:underline">Manage Bookings</span>.
                     </li>
                     <li>
                       <strong className="text-slate-800">Travel Instructions:</strong> Remember to carry a printout of your E-Ticket and your original NIC/Passport. Please reach the airport at least 3 hours prior to flight departure.
                     </li>
                   </>
                 ) : (
                   <li>
                     <strong className="text-slate-800">Package Confirmed:</strong> Your Umrah Package is fully confirmed. Our representative will contact you shortly to guide you through the visa processing and final itinerary steps.
                   </li>
                 )}
                 
                 <li>
                   <strong className="text-slate-800">Need Help?:</strong> To make any changes, visit <span className="text-[#1a4484] cursor-pointer hover:underline">Manage Bookings</span> or call us at <span className="text-[#1a4484] font-bold">+92 21-111-172-782</span> or WhatsApp <span className="text-[#1a4484] font-bold">+92 304 7772782</span>.
                 </li>
              </ul>
           </div>

           {/* Smart Download Actions Area */}
           <div className="bg-slate-50 p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button onClick={handleDownloadReceipt} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-3 sm:py-2.5 px-5 rounded-xl font-extrabold text-[11px] uppercase tracking-widest transition-colors shadow-sm active:scale-95">
                 <Download size={14} strokeWidth={2.5} className="text-[#1a4484]" /> Download Receipt
              </button>
              
              {bookingType === 'ticket' && (
                 <button onClick={() => alert('Downloading E-Ticket...')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1a4484] hover:bg-[#123060] text-white border border-[#1a4484] py-3 sm:py-2.5 px-6 rounded-xl font-extrabold text-[11px] uppercase tracking-widest transition-colors shadow-sm active:scale-95">
                    <Download size={14} strokeWidth={2.5} /> Download E-Ticket
                 </button>
              )}
           </div>
        </div>

        {/* Global Nav Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full mt-2">
            <button onClick={() => alert('Redirecting to Manage Booking...')} className="w-full sm:w-auto bg-[#1a4484] hover:bg-[#123060] text-white font-extrabold py-3.5 px-8 rounded-xl transition-all duration-300 text-[12px] uppercase tracking-widest flex justify-center items-center shadow-md hover:shadow-lg active:scale-95">
               Manage Booking
            </button>
            <button onClick={() => window.location.reload()} className="group w-full sm:w-auto bg-white hover:bg-blue-50 text-[#1a4484] border border-slate-200 hover:border-[#1a4484]/30 font-extrabold py-3.5 px-8 rounded-xl transition-all duration-300 text-[12px] uppercase tracking-widest flex justify-center items-center gap-2 shadow-sm hover:shadow-md active:scale-95">
               <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} /> Back to Home
            </button>
        </div>

      </div>
    );
  };

  if (isLoading) return <BookingShimmer />;

  return (
    <div className="bg-[#fafcff] min-h-screen font-sans pb-28 selection:bg-blue-100 relative animate-in fade-in slide-in-from-bottom-2 duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Eczar:wght@600;700;800&display=swap');
        body { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* Render Popups */}
      <CountryPickerModal isOpen={activePopup === 'nationality'} onClose={() => setActivePopup(null)} onSelect={(val) => setTraveler({...traveler, nationality: val})} title="Select Country" />
      <SmartDatePickerModal isOpen={activePopup === 'dob'} onClose={() => setActivePopup(null)} onComplete={(val) => setTraveler({...traveler, dob: val})} title="Date of Birth" yearList={YEARS_DOB} />
      <SmartDatePickerModal isOpen={activePopup === 'passIssue'} onClose={() => setActivePopup(null)} onComplete={(val) => setTraveler({...traveler, passIssue: val})} title="Passport Issue Date" yearList={YEARS_PASS} />
      <SmartDatePickerModal isOpen={activePopup === 'passExpiry'} onClose={() => setActivePopup(null)} onComplete={(val) => setTraveler({...traveler, passExpiry: val})} title="Passport Expiry Date" yearList={YEARS_PASS} />
      <ImagePreviewModal isOpen={previewImage} onClose={() => setPreviewImage(false)} imageUrl={traveler.passportImage} />

      {bookingType && (
        <div className="sticky top-0 z-50 flex flex-col w-full shadow-sm">
          {/* Stepper is now ALWAYS visible as requested! */}
          <Stepper currentStep={currentStep} bookingType={bookingType} onBack={() => {
            if(currentStep === 1) onBack();
            else if(currentStep < 4) prevStep();
            else window.location.reload();
          }} />

          {/* Global Top Timer Banner (Only shown in step 1-3) */}
          {currentStep < 4 && (
            <div className={`w-full ${currentStep === 3 ? 'bg-orange-50 border-orange-100' : 'bg-blue-50/50 border-blue-100'} border-b flex items-center justify-center p-2.5 gap-2 relative transition-colors`}>
              <Clock size={14} className={`${currentStep === 3 ? 'text-orange-500' : 'text-[#1a4484]'} animate-pulse`} />
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                {currentStep === 3 ? "Complete payment in: " : "Time remaining to complete booking: "}
                <span className={`${currentStep === 3 ? 'text-orange-600' : 'text-[#1a4484]'} font-black`}>
                  {formatTime(currentStep === 3 ? paymentTimer : bookingTimer)}
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8">
        {currentStep === 4 && bookingType ? (
          renderSuccessStep()
        ) : bookingType ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Left Content Area */}
            <div className="w-full lg:w-[65%]">
              {currentStep === 1 && renderTravelersStep()}
              {currentStep === 2 && renderReviewStep()}
              {currentStep === 3 && renderPaymentStep()}
            </div>

            {/* Right Content Area (Clean Price Summary) */}
            <div className="w-full lg:w-[35%] lg:sticky lg:top-[120px]">
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-black text-[14px] sm:text-[13px] text-slate-800 tracking-tight">Price Summary</h3>
                   <span className="text-slate-500 text-[10px] sm:text-[9px] font-bold uppercase tracking-widest border border-slate-200 px-1.5 py-0.5 rounded">1 Adult</span>
                 </div>
                 
                 <div className="p-4 space-y-3.5 flex-1">
                   <div className="flex justify-between items-center">
                     <span className="text-[12px] sm:text-[11px] font-bold text-slate-500">Base Fare</span>
                     <span className="text-[13px] sm:text-[12px] font-black text-slate-800">PKR {PRICE_DETAILS.baseFare.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[12px] sm:text-[11px] font-bold text-slate-500">Taxes & Fees</span>
                     <span className="text-[13px] sm:text-[12px] font-black text-slate-800">PKR {PRICE_DETAILS.taxes.toLocaleString()}</span>
                   </div>
                   
                   <div className="border-t border-slate-100 pt-3 mt-1">
                     <div className="flex justify-between items-end mb-2">
                       <span className="text-[10px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Flight/Package</span>
                       <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                         PKR {PRICE_DETAILS.total.toLocaleString()}
                       </span>
                     </div>

                     {/* Show Partial Payment Breakdown ONLY if split allowed */}
                     {currentStep === 3 && bookingType === 'umrah' && ['bank', 'wallet', 'atm', '1bill'].includes(paymentMethod) && paymentAmount < PRICE_DETAILS.total && (
                       <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-lg mt-3 space-y-2 animate-in fade-in">
                          <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-[#1a4484] uppercase tracking-widest">Paying Now</span>
                            <span className="text-xl font-black text-[#1a4484] tracking-tight leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              PKR {paymentAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-end border-t border-blue-100 pt-1.5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Remaining Balance</span>
                            <span className="text-[11px] font-black text-slate-600 tracking-tight leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              PKR {(PRICE_DETAILS.total - paymentAmount).toLocaleString()}
                            </span>
                          </div>
                       </div>
                     )}

                     {/* Default Total if not splitting */}
                     {!(currentStep === 3 && bookingType === 'umrah' && ['bank', 'wallet', 'atm', '1bill'].includes(paymentMethod) && paymentAmount < PRICE_DETAILS.total) && (
                       <div className="flex justify-between items-end mt-3">
                         <span className="text-[10px] sm:text-[9px] font-black text-[#1a4484] uppercase tracking-widest mb-0.5">Total Payable Now</span>
                         <span className="text-2xl font-black text-[#1a4484] tracking-tight leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                           PKR {PRICE_DETAILS.total.toLocaleString()}
                         </span>
                       </div>
                     )}

                   </div>
                 </div>
                 <div className="hidden lg:block p-4 pt-0 mt-1">
                   <button 
                     onClick={nextStep}
                     disabled={isGeneratingPayment}
                     className={`w-full ${isGeneratingPayment ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-[#1a4484] hover:bg-[#123060] text-white active:scale-[0.98]'} h-11 sm:h-10 rounded-md font-black text-[12px] sm:text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2`}
                   >
                     {currentStep === 1 ? 'Continue to Review' : currentStep === 2 ? 'Make Booking' : (paymentMethod === 'card' ? 'Pay Now' : 'Verify Payment Now')}
                     <ArrowRight size={14} strokeWidth={3} />
                   </button>
                 </div>
               </div>
            </div>

          </div>
        ) : null}
      </main>

      {/* Mobile Sticky Bottom Bar */}
      {bookingType && currentStep < 4 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-30 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
           <div className="flex flex-col">
             <span className="text-[10px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Paying Now</span>
             <span className="text-xl sm:text-lg font-black text-[#1a4484] leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
               PKR {currentStep === 3 && ['bank', 'wallet', 'atm', '1bill'].includes(paymentMethod) && bookingType === 'umrah' ? paymentAmount.toLocaleString() : PRICE_DETAILS.total.toLocaleString()}
             </span>
           </div>
           <button 
             onClick={nextStep}
             disabled={isGeneratingPayment}
             className={`${isGeneratingPayment ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-[#1a4484] hover:bg-[#123060] text-white active:scale-[0.98]'} h-11 sm:h-10 px-6 rounded-md font-black text-[12px] sm:text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5`}
           >
             {currentStep === 3 ? (paymentMethod === 'card' ? 'Pay Now' : 'Verify Payment Now') : (currentStep === 2 ? 'Make Booking' : 'Next')} <ArrowRight size={16} strokeWidth={2.5} />
           </button>
        </div>
      )}
    </div>
  );
}
