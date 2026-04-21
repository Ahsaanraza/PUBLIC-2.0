import React, { useState, useEffect, useRef } from 'react';
import {
    User, Users, Wallet, HelpCircle, LogOut, ChevronDown, Search,
    Plane, Globe, Menu, X, ArrowRight, Compass,
    Edit2, Trash2, Plus, Save, Calendar, Mail, CreditCard, ArrowLeft,
    ArrowUpRight, ArrowDownLeft, Receipt, MessageCircle, FileQuestion, PhoneCall,
    Briefcase, Luggage, Bus, FileText, Building2, Coffee, Gift, CheckCircle
} from 'lucide-react';

// --- MOCKS & HELPERS FOR STANDALONE PREVIEW ---
const useNavigate = () => (path) => console.log('Navigated to:', path);
const useLocation = () => ({ pathname: '/dashboard/flight_bookings' });

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS_DOB = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const YEARS_PASS = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - 10 + i);

const formatDateDisplay = (dateObj, placeholder = '') => {
    if (dateObj?.day && dateObj?.month && dateObj?.year) {
        return `${dateObj.day} ${dateObj.month} ${dateObj.year}`;
    }
    return placeholder;
};

const DesktopDateSelectBox = ({ type, placeholder, options, value, onSelect, isActive, onOpen }) => {
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isActive) setSearch(value ? value.toString() : '');
    }, [value, isActive]);

    const filteredOptions = options.filter(o =>
        o.toString().toLowerCase().includes(String(search).toLowerCase())
    );

    return (
        <div className={`relative flex flex-col ${type === 'day' ? 'flex-[1] min-w-[70px]' : type === 'month' ? 'flex-[2.2] min-w-[110px]' : 'flex-[1.5] min-w-[90px]'}`}>
            <div className={`relative w-full h-11 bg-white border ${isActive ? 'border-[#1a4484] ring-1 ring-[#1a4484]' : 'border-slate-300 hover:border-[#1a4484]'} rounded-lg flex items-center transition-all shadow-sm`}>
                <input
                    type="text"
                    value={isActive ? search : (value || '')}
                    onChange={(e) => { setSearch(e.target.value); onOpen(type); }}
                    onFocus={() => onOpen(type)}
                    placeholder={placeholder}
                    className="w-full h-full pl-2.5 pr-7 outline-none text-[12px] sm:text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium text-ellipsis bg-transparent"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white pointer-events-none">
                    {isActive ? <Search size={13} className="text-slate-300" /> : null}
                    {!isActive && !value ? <ChevronDown size={13} className="text-slate-400" /> : null}
                    {value ? <CheckCircle size={13} className="text-emerald-500" /> : null}
                </div>
            </div>

            {isActive && (
                <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-[200] max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

const DesktopSmartDatePicker = ({ value, onChange, yearList }) => {
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
        <div className="hidden sm:flex relative gap-2 w-full mt-2" ref={ref}>
            <DesktopDateSelectBox type="day" placeholder="Day" options={DAYS} value={value.day} onSelect={handleSelect} isActive={activeDropdown === 'day'} onOpen={setActiveDropdown} />
            <DesktopDateSelectBox type="month" placeholder="Month" options={MONTHS} value={value.month} onSelect={handleSelect} isActive={activeDropdown === 'month'} onOpen={setActiveDropdown} />
            <DesktopDateSelectBox type="year" placeholder="Year" options={yearList} value={value.year} onSelect={handleSelect} isActive={activeDropdown === 'year'} onOpen={setActiveDropdown} />
        </div>
    );
};

const SmartDatePickerModal = ({ isOpen, onClose, onComplete, title, yearList }) => {
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
        <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200 sm:hidden">
            <div className="bg-white w-full h-[75vh] rounded-t-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-300">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-2xl">
                    <h3 className="font-heading font-black text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors"><X size={18} /></button>
                </div>
                <div className="flex border-b border-slate-100 bg-slate-50/50 p-2">
                    <button onClick={() => setStep('day')} className={`flex-1 py-2 text-center text-[12px] font-bold rounded-md transition-colors ${step === 'day' ? 'bg-white shadow-sm text-[#1a4484] border border-slate-200' : 'text-slate-500'}`}>
                        {selectedDate.day || 'Day'}
                    </button>
                    <div className="flex items-center text-slate-300 px-1"><ChevronDown size={14} className="-rotate-90" /></div>
                    <button onClick={() => selectedDate.day && setStep('month')} className={`flex-1 py-2 text-center text-[12px] font-bold rounded-md transition-colors ${step === 'month' ? 'bg-white shadow-sm text-[#1a4484] border border-slate-200' : 'text-slate-500'}`}>
                        {selectedDate.month || 'Month'}
                    </button>
                    <div className="flex items-center text-slate-300 px-1"><ChevronDown size={14} className="-rotate-90" /></div>
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


// --- MOCK DATA ---
const USER_DATA = {
    name: "Ahsan Raza Butt",
    email: "ahsaan.raza.butt@gmail.com",
    phone: "+92 300 0709017",
    dob: "1995-08-15",
    nationality: "Pakistan",
    gender: "Male",
    initials: "AB",
    profileProgress: 80,
    tier: "Gold Member"
};

const MOCK_TRAVELLERS = [
    { id: 1, title: 'Mr', firstName: 'Shamshaid', lastName: 'Abbas', type: 'Adult', dob: '1980-05-10', passport: 'AB1234567', expiry: '2030-05-09' },
    { id: 2, title: 'Mrs', firstName: 'Ayesha', lastName: 'Ali', type: 'Adult', dob: '1985-11-22', passport: 'CD9876543', expiry: '2028-11-21' },
    { id: 3, title: 'Mstr', firstName: 'Zain', lastName: 'Abbas', type: 'Child', dob: '2018-02-14', passport: 'EF4561239', expiry: '2025-02-13' }
];

const MOCK_BOOKINGS = {
    flights: {
        upcoming: [
            {
                id: 'AQV9P2X8L1T', status: 'Issued', route: 'Faisalabad → Abu Dhabi',
                departDate: '20 Apr', departDateFull: '20 Apr (Saturday)', departTime: '11:00', departAirport: 'Faisalabad (LYP)', departCode: 'LYP', departTerminal: 'Terminal - NA',
                arrDate: '20 Apr', arrTime: '13:15', arrAirport: 'Abu Dhabi (AUH)', arrCode: 'AUH', arrTerminal: 'Terminal A',
                bookedOn: '10 Apr 2026', airline: 'Air Arabia', flightNo: '3L-316', flightClass: 'Economy (E)', pnr: '10FS24', eTicket: 'Pending issuance', checkInBag: '20KG', handCarry: '7KG', duration: '2h 15m'
            }
        ],
        past: [
            {
                id: 'WFZ5ZF4TE7U26', status: 'Expired', route: 'Riyadh → Sialkot',
                departDate: '05 Mar 2026', departDateFull: '05 Mar (Thursday)', departTime: '04:20 AM', departAirport: 'King Khalid Int.', departCode: 'RUH', departTerminal: 'Terminal 1',
                arrDate: '05 Mar 2026', arrTime: '10:25 AM', arrAirport: 'Sialkot Int.', arrCode: 'SKT', arrTerminal: 'Terminal A',
                bookedOn: '03 Mar 2026', airline: 'Saudia', flightNo: 'SV-718', flightClass: 'Economy (Q)', pnr: '8H92K1', eTicket: '77521098231', checkInBag: '30KG', handCarry: '7KG', duration: '6h 05m'
            }
        ],
        cancelled: []
    },
    umrah: {
        upcoming: [
            {
                id: 'UMR-992817462', status: 'Issued',
                bookedOn: '10 Feb 2026',
                departDateFull: '12 RAMADAN 2026',
                airline: 'Saudia Airlines',
                title: '21 Days Premium Umrah Package',
                route: 'Jeddah → Makkah → Madinah → Makkah → Jeddah',
                makkahHotel: 'Swissôtel Al Maqam',
                madinahHotel: 'Pullman Zamzam Madina',
                sharingType: 'QUAD SHARING FROM',
                price: '285,000',
                priceDetails: 'PER PERSON - TAXES INCLUDED'
            }
        ],
        past: [
            {
                id: 'UMR-441298371', status: 'Expired',
                bookedOn: '05 Nov 2025',
                departDateFull: '01 RAJAB 2026',
                airline: 'PIA Flights',
                title: '15 Days Economy Umrah Package',
                route: 'Jeddah → Makkah → Madinah → Jeddah',
                makkahHotel: 'Emaar Al Khalil',
                madinahHotel: 'Al Eiman Taibah',
                sharingType: 'QUAD SHARING FROM',
                price: '195,000',
                priceDetails: 'PER PERSON - TAXES INCLUDED'
            }
        ],
        cancelled: []
    }
};

const MOCK_WALLET = {
    balance: "4,500.00",
    currency: "PKR",
    cards: [
        { id: 1, type: "Visa", last4: "4242", expiry: "12/28", bg: "from-[#1a4484] to-blue-600" },
        { id: 2, type: "Mastercard", last4: "8899", expiry: "08/26", bg: "from-slate-700 to-[#0B1A28]" }
    ],
    transactions: [
        { id: "TXN-001", date: "03 Mar 2026", time: "14:30", desc: "Flight Riyadh → Sialkot", amount: -1250.00, type: "debit" },
        { id: "TXN-002", date: "01 Mar 2026", time: "09:15", desc: "Wallet Top-up via Visa", amount: 2000.00, type: "credit" },
        { id: "TXN-003", date: "10 Feb 2026", time: "11:20", desc: "Umrah Package Premium", amount: -3000.00, type: "debit" },
        { id: "TXN-004", date: "05 Feb 2026", time: "16:45", desc: "Refund (Cancelled Flight)", amount: 850.00, type: "credit" },
    ]
};

const MOCK_FAQS = [
    { id: 1, question: "Main apni flight booking kaise cancel kar sakta hoon?", answer: "Aap 'Flight Bookings' section mein ja kar apni upcoming flight select karein aur 'Manage Booking' par click karein. Wahan cancellation ka option mil jayega. Cancellation charges apply ho sakte hain." },
    { id: 2, question: "Umrah package ka refund process kya hai?", answer: "Umrah package cancel karne ke baad refund process hone mein 7-14 working days lagte hain. Amount aapke original payment method ya wallet mein credit kar di jayegi." },
    { id: 3, question: "Wallet mein paise kaise add karein?", answer: "'My Wallet' page par jayein aur 'Top Up' button par click karein. Aap apne saved cards use kar ke instantly funds add kar sakte hain." },
    { id: 4, question: "Kya booking ke baad passport details update ki ja sakti hain?", answer: "Haan, aap 'Travellers List' se details update kar sakte hain. Lekin agar ticket pehle hi book ho chuka hai, toh kripya turant support team se sampark karein." }
];

// --- COMPOSITE COMPONENTS ---

const TitleAndFirstNameInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState('Mr');
    const [firstName, setFirstName] = useState('');
    const dropdownRef = useRef(null);
    const titles = ['Mr', 'Mrs', 'Ms', 'Miss', 'Mstr'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex w-full bg-slate-50 border border-slate-200 rounded-lg focus-within:border-[#1a4484] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1a4484]/20 transition-all relative">
            {/* Custom Title Dropdown Trigger */}
            <div ref={dropdownRef} className="relative shrink-0 flex items-stretch">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-[85px] sm:w-[96px] flex items-center justify-between pl-3 sm:pl-4 pr-2 sm:pr-3 text-[14px] font-semibold text-[#0B1A28] outline-none hover:bg-slate-100/50 rounded-l-lg transition-colors"
                >
                    <span>{selectedTitle}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1a4484]' : ''}`} />
                </button>

                {/* Animated Custom Menu */}
                {isOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 w-[120px] bg-white border border-slate-200 rounded-xl shadow-xl z-[100] py-1.5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        {titles.map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => { setSelectedTitle(t); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold transition-colors ${selectedTitle === t ? 'bg-blue-50 text-[#1a4484]' : 'text-[#0B1A28] hover:bg-slate-50'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Subtle Divider */}
            <div className="w-px bg-slate-200 my-2.5"></div>

            {/* Borderless First Name Input */}
            <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Given Name (as on passport)"
                className="w-full min-w-0 bg-transparent border-none outline-none focus:ring-0 py-3 px-3 sm:px-4 text-[14px] font-semibold text-[#0B1A28] placeholder:text-slate-300 placeholder:font-medium"
                style={{ boxShadow: 'none' }}
            />
        </div>
    );
};

const ModernSelect = ({ label, icon: Icon, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-1.5 w-full relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-bold text-slate-800 cursor-pointer hover:border-[#1a4484] transition-all group shadow-sm"
            >
                {Icon && <Icon size={18} className="text-slate-400 group-hover:text-[#1a4484] transition-colors" />}
                <span className="flex-1 truncate">{value}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-2xl z-[150] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-t-0">
                    <div className="max-h-[240px] overflow-y-auto">
                        {options.map((opt) => (
                            <div
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className={`px-4 py-3 text-[13px] font-bold cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${value === opt ? 'bg-blue-50 text-[#1a4484]' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SUB-VIEWS (NEW PAGES) ---

const ProfileView = () => {
    const [profileData, setProfileData] = useState({
        nickname: '',
        type: 'Adult',
        title: 'Mr',
        firstName: '',
        lastName: '',
        passport: '',
        nationality: 'Pakistan',
        dob: { day: '', month: '', year: '' },
        expiry: { day: '', month: '', year: '' },
        phone: '',
        email: '',
        deals: true
    });

    const [activePopup, setActivePopup] = useState(null);
    const pickerButtonClass = "w-full h-11 px-3 bg-white border border-slate-200 rounded-lg outline-none font-bold text-slate-800 transition-all text-[14px] flex items-center justify-between cursor-pointer hover:border-[#1a4484] text-left sm:hidden shadow-sm";
    const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5";

    const updateField = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* --- Left Column: Main Forms --- */}
                <div className="lg:col-span-8 space-y-8">

                    {/* 1. Contact Information Card */}
                    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="p-5 sm:p-7">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                                    <Mail size={18} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 leading-tight">Contact Information</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">FOR TICKETS & ALERTS</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                    <div className="space-y-1.5 w-full">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Phone Number</label>
                                        <div className="flex w-full bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#1a4484] focus-within:ring-2 focus-within:ring-[#1a4484]/10 transition-all h-[44px]">
                                            <div className="flex items-center gap-1.5 pl-3 pr-2 border-r border-slate-100 bg-slate-50/50">
                                                <span className="text-[12px] font-extrabold text-slate-900">PK</span>
                                                <span className="text-[11px] font-semibold text-slate-400">+92</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => updateField('phone', e.target.value)}
                                                placeholder="e.g. 300 1234567"
                                                className="flex-1 w-full px-4 outline-none text-slate-900 text-[14px] font-bold tracking-wider placeholder:text-slate-300 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 w-full">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Email Address</label>
                                        <div className="flex w-full bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#1a4484] focus-within:ring-2 focus-within:ring-[#1a4484]/10 transition-all h-[44px]">
                                            <div className="flex items-center justify-center pl-3.5 pr-2 text-slate-400">
                                                <Mail size={16} />
                                            </div>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => updateField('email', e.target.value)}
                                                placeholder="yourname@example.com"
                                                className="flex-1 w-full px-3 outline-none text-slate-900 text-[14px] font-bold placeholder:text-slate-300 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={profileData.deals}
                                            onChange={(e) => updateField('deals', e.target.checked)}
                                            className="peer appearance-none w-5 h-5 rounded border border-slate-300 bg-white checked:bg-[#1a4484] checked:border-[#1a4484] transition-all cursor-pointer"
                                        />
                                        <svg className="absolute text-white stroke-[4px] opacity-0 peer-checked:opacity-100 transition-opacity w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Send me special spiritual deals & package alerts</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 2. My Details Card */}
                    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="p-5 sm:p-7">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                                    <User size={18} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 leading-tight">My Details</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">IDENTITY & TRAVEL DOCUMENTS</p>
                                </div>
                            </div>

                            <div className="p-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 w-full">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Profile Nickname</label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"><User size={16} /></div>
                                            <input
                                                type="text"
                                                value={profileData.nickname}
                                                onChange={(e) => updateField('nickname', e.target.value)}
                                                placeholder="e.g. Personal, Business"
                                                className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-[14px] font-bold text-slate-800 outline-none focus:border-[#1a4484] transition-all placeholder:text-slate-300 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 w-full">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Traveler Type</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-[14px] font-extrabold text-slate-400 outline-none appearance-none cursor-not-allowed"
                                                value={profileData.type}
                                                disabled
                                            >
                                                <option>Adult</option>
                                                <option>Child</option>
                                                <option>Infant</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"><ChevronDown size={16} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 w-full">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">FULL NAME (As per Passport)</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr_1fr] gap-3">
                                        <div className="relative">
                                            <select
                                                value={profileData.title}
                                                onChange={(e) => updateField('title', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 text-[14px] font-bold text-slate-800 outline-none appearance-none hover:border-[#1a4484] transition-all"
                                            >
                                                <option>Mr</option><option>Mrs</option><option>Ms</option><option>Miss</option><option>Mstr</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={14} /></div>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Given Name (as on passport)"
                                            value={profileData.firstName}
                                            onChange={(e) => updateField('firstName', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-bold text-slate-800 outline-none hover:border-[#1a4484] transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Surname (as on passport)"
                                            value={profileData.lastName}
                                            onChange={(e) => updateField('lastName', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-bold text-slate-800 outline-none hover:border-[#1a4484] transition-all shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 w-full">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Passport Number</label>
                                        <div className="flex w-full bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#1a4484] transition-all h-[46px] shadow-sm">
                                            <div className="flex items-center justify-center pl-3 pr-2 text-slate-300">
                                                <CreditCard size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={profileData.passport}
                                                onChange={(e) => updateField('passport', e.target.value)}
                                                placeholder="e.g. AB1234567"
                                                className="flex-1 w-full px-3 outline-none text-slate-900 text-[14px] font-black tracking-widest font-mono uppercase placeholder:text-slate-300 placeholder:font-medium placeholder:tracking-normal placeholder:font-sans"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 w-full">
                                        <ModernSelect 
                                            label="Nationality" 
                                            icon={Globe} 
                                            value={profileData.nationality} 
                                            options={['Pakistan', 'Saudi Arabia', 'United Kingdom', 'United States', 'UAE', 'Turkey', 'Qatar', 'Oman']}
                                            onChange={(val) => updateField('nationality', val)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 w-full">
                                        <label className={labelClass}>Date of Birth</label>
                                        <button type="button" onClick={() => setActivePopup('dob')} className={pickerButtonClass}>
                                            <span className={profileData.dob.year ? "text-slate-800" : "text-slate-400 font-medium"}>{formatDateDisplay(profileData.dob, "Select Date of Birth")}</span>
                                            <Calendar size={16} className="text-slate-400" />
                                        </button>
                                        <DesktopSmartDatePicker value={profileData.dob} onChange={(v) => updateField('dob', v)} yearList={YEARS_DOB} />
                                    </div>
                                    <div className="space-y-1.5 w-full">
                                        <label className={labelClass}>Passport Expiry</label>
                                        <button type="button" onClick={() => setActivePopup('expiry')} className={pickerButtonClass}>
                                            <span className={profileData.expiry.year ? "text-slate-800" : "text-slate-400 font-medium"}>{formatDateDisplay(profileData.expiry, "Select Expiry Date")}</span>
                                            <Calendar size={16} className="text-slate-400" />
                                        </button>
                                        <DesktopSmartDatePicker value={profileData.expiry} onChange={(v) => updateField('expiry', v)} yearList={YEARS_PASS} />
                                    </div>

                                    {/* Mobile Date Modals */}
                                    <SmartDatePickerModal 
                                        isOpen={activePopup === 'dob'} 
                                        onClose={() => setActivePopup(null)} 
                                        onComplete={(v) => updateField('dob', v)} 
                                        title="Date of Birth" 
                                        yearList={YEARS_DOB} 
                                    />
                                    <SmartDatePickerModal 
                                        isOpen={activePopup === 'expiry'} 
                                        onClose={() => setActivePopup(null)} 
                                        onComplete={(v) => updateField('expiry', v)} 
                                        title="Passport Expiry" 
                                        yearList={YEARS_PASS} 
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        className="bg-[#1a4484] hover:bg-blue-800 text-white px-10 py-3.5 rounded-xl font-black text-[14px] shadow-lg transition-all active:scale-[0.98]"
                                        onClick={() => alert('Profile Updated Successfully!')}
                                    >
                                        Done Editing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Status & Sidebar --- */}
                <div className="lg:col-span-4 space-y-6">

                    {/* 3. Promo Code Card */}
                    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                                    <Gift size={18} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 leading-tight">Promo Code</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">APPLY FOR DISCOUNTS</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                <input type="text" placeholder="e.g. SAVE10" className="flex-1 min-w-0 bg-slate-50 border-transparent rounded-lg px-4 py-3 text-[12px] font-extrabold text-slate-900 placeholder:text-slate-300 outline-none focus:bg-white focus:border-slate-200 transition-all tracking-wider" />
                                <button className="w-full sm:w-auto bg-slate-200 text-slate-400 px-6 py-3 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-300 transition-colors whitespace-nowrap">Apply</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


const TravellersView = () => {
    const [view, setView] = useState('list');
    const [travellers] = [MOCK_TRAVELLERS];
    const [travellerForm, setTravellerForm] = useState({
        type: 'Adult',
        title: 'Mr',
        firstName: '',
        lastName: '',
        nationality: 'Pakistan',
        passport: '',
        dob: { day: '', month: '', year: '' },
        expiry: { day: '', month: '', year: '' }
    });
    const [activePopup, setActivePopup] = useState(null);

    const updateTravellerField = (field, value) => {
        setTravellerForm(prev => ({ ...prev, [field]: value }));
    };

    const pickerButtonClass = "w-full h-11 px-3 bg-white border border-slate-200 rounded-lg outline-none font-bold text-slate-800 transition-all text-[14px] flex items-center justify-between cursor-pointer hover:border-[#1a4484] text-left sm:hidden shadow-sm";
    const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-widest";

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [view]);

    if (view === 'form') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-heading text-[#0B1A28]">Add New Traveller</h2>
                    <button onClick={() => setView('list')} className="w-full sm:w-auto justify-center text-[#0B1A28] hover:text-[#1a4484] text-[13px] font-bold flex items-center gap-1 bg-white border border-slate-200 px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95">
                        <ArrowLeft size={14} /> Back to List
                    </button>
                </div>

                <div className="bg-[#ffffff] rounded-[2rem] border border-slate-200 shadow-xl p-5 sm:p-6 md:p-8 w-full box-border">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
                        <div className="space-y-1.5 md:col-span-2 w-full">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Traveller Type</label>
                            <div className="flex flex-wrap gap-2 sm:gap-4 w-full">
                                <label className="flex flex-1 sm:flex-none justify-center items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-2 py-3 sm:px-4 sm:py-2.5 rounded-lg font-bold text-[12px] sm:text-[13px] text-[#0B1A28] hover:border-[#1a4484] has-[:checked]:border-[#1a4484] has-[:checked]:bg-blue-50 has-[:checked]:text-[#1a4484] transition-all whitespace-nowrap">
                                    <input type="radio" name="type" defaultChecked className="hidden" /> Adult (12+ yrs)
                                </label>
                                <label className="flex flex-1 sm:flex-none justify-center items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-2 py-3 sm:px-4 sm:py-2.5 rounded-lg font-bold text-[12px] sm:text-[13px] text-[#0B1A28] hover:border-[#1a4484] has-[:checked]:border-[#1a4484] has-[:checked]:bg-blue-50 has-[:checked]:text-[#1a4484] transition-all whitespace-nowrap">
                                    <input type="radio" name="type" className="hidden" /> Child (2-11 yrs)
                                </label>
                                <label className="flex flex-1 sm:flex-none justify-center items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-2 py-3 sm:px-4 sm:py-2.5 rounded-lg font-bold text-[12px] sm:text-[13px] text-[#0B1A28] hover:border-[#1a4484] has-[:checked]:border-[#1a4484] has-[:checked]:bg-blue-50 has-[:checked]:text-[#1a4484] transition-all whitespace-nowrap">
                                    <input type="radio" name="type" className="hidden" /> Infant (0-2 yrs)
                                </label>
                            </div>
                        </div>

                        <div className="space-y-1.5 w-full">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Title & First Name</label>
                            <TitleAndFirstNameInput />
                        </div>

                        <div className="space-y-1.5 w-full">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Last Name</label>
                            <input type="text" placeholder="Last Name (Surname)" className="w-full min-w-0 bg-slate-50 border border-slate-200 focus:border-[#1a4484] focus:bg-white focus:ring-2 focus:ring-[#1a4484]/20 rounded-lg py-3 px-3 sm:px-4 text-[14px] font-semibold text-[#0B1A28] outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5 w-full">
                            <label className={labelClass}>Date of Birth</label>
                            <button type="button" onClick={() => setActivePopup('dob')} className={pickerButtonClass}>
                                <span className={travellerForm.dob.year ? "text-slate-800" : "text-slate-400 font-medium"}>{formatDateDisplay(travellerForm.dob, "Select DOB")}</span>
                                <Calendar size={16} className="text-slate-400" />
                            </button>
                            <DesktopSmartDatePicker value={travellerForm.dob} onChange={(v) => updateTravellerField('dob', v)} yearList={YEARS_DOB} />
                        </div>

                        <div className="space-y-1.5 w-full">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nationality</label>
                            <div className="relative w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={16} strokeWidth={2} /></div>
                                <select className="w-full min-w-0 bg-slate-50 border border-slate-200 focus:border-[#1a4484] focus:bg-white focus:ring-2 focus:ring-[#1a4484]/20 rounded-lg py-3 pl-10 pr-3 sm:pr-4 text-[14px] font-semibold text-[#0B1A28] outline-none appearance-none transition-all">
                                    <option>Pakistan</option><option>Saudi Arabia</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={16} /></div>
                            </div>
                        </div>

                        <h3 className="text-[14px] font-heading text-[#0B1A28] uppercase tracking-widest mt-4 mb-2 md:col-span-2 border-b border-slate-100 pb-3">Travel Document (Passport)</h3>

                        <div className="space-y-1.5 w-full">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Passport Number</label>
                            <div className="relative w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><CreditCard size={16} strokeWidth={2} /></div>
                                <input type="text" placeholder="e.g. AB1234567" className="w-full min-w-0 bg-slate-50 border border-slate-200 focus:border-[#1a4484] focus:bg-white focus:ring-2 focus:ring-[#1a4484]/20 rounded-lg py-3 pl-10 pr-3 sm:pr-4 text-[14px] font-semibold text-[#0B1A28] outline-none uppercase font-mono transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5 w-full">
                            <label className={labelClass}>Expiry Date</label>
                            <button type="button" onClick={() => setActivePopup('expiry')} className={pickerButtonClass}>
                                <span className={travellerForm.expiry.year ? "text-slate-800" : "text-slate-400 font-medium"}>{formatDateDisplay(travellerForm.expiry, "Select Expiry")}</span>
                                <Calendar size={16} className="text-slate-400" />
                            </button>
                            <DesktopSmartDatePicker value={travellerForm.expiry} onChange={(v) => updateTravellerField('expiry', v)} yearList={YEARS_PASS} />
                        </div>

                        {/* Modals */}
                        <SmartDatePickerModal 
                            isOpen={activePopup === 'dob'} 
                            onClose={() => setActivePopup(null)} 
                            onComplete={(v) => updateTravellerField('dob', v)} 
                            title="Date of Birth" 
                            yearList={YEARS_DOB} 
                        />
                        <SmartDatePickerModal 
                            isOpen={activePopup === 'expiry'} 
                            onClose={() => setActivePopup(null)} 
                            onComplete={(v) => updateTravellerField('expiry', v)} 
                            title="Passport Expiry" 
                            yearList={YEARS_PASS} 
                        />

                        <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setView('list')} className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-[13px] text-slate-600 hover:bg-slate-100 uppercase tracking-widest transition-colors active:scale-95 text-center">
                                Cancel
                            </button>
                            <button type="button" onClick={() => { alert("Traveller Saved!"); setView('list'); }} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1a4484] hover:bg-blue-800 text-white px-8 py-3.5 rounded-full font-bold text-[13px] uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(26,68,132,0.3)] transition-all active:scale-95">
                                <Save size={16} strokeWidth={2.5} /> Save Traveller
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-[14px] text-slate-500 font-medium">Save co-traveller details to book flights and packages faster.</p>
                <button onClick={() => setView('form')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1a4484] hover:bg-blue-800 text-white px-6 py-3 rounded-full font-bold text-[12px] uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(26,68,132,0.3)] transition-all active:scale-95 whitespace-nowrap">
                    <Plus size={16} strokeWidth={2.5} /> Add Traveller
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {travellers.map((t) => (
                    <div key={t.id} className="bg-[#ffffff] border border-slate-200 rounded-2xl p-5 shadow-xl transition-shadow relative group">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1a4484] flex items-center justify-center font-heading font-black text-lg shrink-0">
                                {t.firstName[0]}{t.lastName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${t.type === 'Adult' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100/60 text-[#10b981]'}`}>{t.type}</span>
                                </div>
                                <h3 className="text-[16px] font-heading text-[#0B1A28] truncate leading-tight">{t.title}. {t.firstName} {t.lastName}</h3>
                            </div>
                        </div>

                        <div className="space-y-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-semibold text-slate-500">DOB</span>
                                <span className="text-[12px] font-bold text-[#0B1A28]">{t.dob}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-semibold text-slate-500">Passport</span>
                                <span className="text-[12px] font-bold text-[#0B1A28] font-mono tracking-wider">••••{t.passport.slice(-4)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                            <button onClick={() => setView('form')} className="p-2 text-slate-400 hover:text-[#1a4484] hover:bg-blue-50 rounded-lg transition-all active:scale-95" title="Edit">
                                <Edit2 size={16} strokeWidth={2} />
                            </button>
                            <button onClick={() => alert("Delete Traveller?")} className="p-2 text-slate-400 hover:text-[#f97316] hover:bg-orange-50 rounded-lg transition-all active:scale-95" title="Delete">
                                <Trash2 size={16} strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- BOOKINGS SUB-VIEW ---

const StatusBadge = ({ status }) => {
    const isGood = status === 'Completed' || status === 'Confirmed' || status === 'Issued';
    const isBad = status === 'Error' || status === 'Cancelled' || status === 'Expired';

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest w-fit border ${isGood ? 'bg-[#f0fdf4] text-[#10b981] border-[#bbf7d0]' :
            isBad ? 'bg-slate-100 text-slate-500 border-slate-200' :
                'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isGood ? 'bg-[#10b981]' : 'bg-slate-400'}`}></span>
            {status}
        </div>
    );
};

const BookingCard = ({ data, category }) => {
    const isExpired = data.status.toLowerCase() === 'expired' || data.status.toLowerCase() === 'cancelled';

    return (
        <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm w-full p-4 sm:p-5 mb-5 flex flex-col gap-4">
            
            {/* Outer Header (Status, Booked Date, Booking Ref) */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 sm:gap-4">
                    <StatusBadge status={data.status} />
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                        Booked {data.bookedOn}
                    </span>
                </div>
                <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Booking No</span>
                    <span className="text-[13px] sm:text-[14px] font-black text-[#1a4484] font-mono leading-none tracking-wide">{data.id}</span>
                </div>
            </div>

            {category === 'flights' ? (
                /* Flights Inner Ticket Box */
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Segment Header */}
                    <div className="bg-[#f8fafc] px-4 sm:px-5 py-2.5 border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center gap-2.5 font-semibold text-[#0B1A28] text-[13px]">
                            <Calendar size={16} className="text-slate-500" strokeWidth={2}/>
                            {data.departDateFull || data.departDate}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Departure Flight (Direct)
                        </div>
                    </div>

                    {/* Segment Body */}
                    <div className="px-4 sm:px-5 py-4 flex flex-col md:flex-row items-start md:items-center gap-6 bg-white">
                        <div className="w-full md:w-[28%] flex items-center gap-3">
                            <div className="w-[44px] h-[44px] bg-[#d71921] text-white rounded-lg flex items-center justify-center font-heading font-black text-[16px] shrink-0 shadow-sm">
                                {data.airline ? data.airline.substring(0, 2).toUpperCase() : 'AA'}
                            </div>
                            <div className="min-w-0">
                                <p className="font-heading font-bold text-[#0B1A28] text-[15px] leading-tight mb-0.5 truncate">{data.airline || 'Air Arabia'}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-slate-500 font-medium">{data.flightNo || '3L-316'}</span>
                                    <span className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-medium">{data.flightClass || 'Economy (E)'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full flex items-center justify-between px-0 sm:px-2">
                            <div className="text-center w-[30%] min-w-0">
                                <p className="font-heading font-black text-[24px] sm:text-[26px] text-[#0B1A28] leading-none tracking-tight mb-2">{data.departTime.split(' ')[0]}</p>
                                <p className="text-[12px] font-semibold text-[#0B1A28] truncate leading-tight">{data.departAirport || data.departCode}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{data.departTerminal || 'Terminal - NA'}</p>
                            </div>
                            
                            <div className="w-[40%] flex flex-col items-center justify-center relative px-2">
                                <span className="text-[10px] text-slate-500 font-medium bg-white px-2 relative z-10 mb-1 leading-none">{data.duration || '2h 15m'}</span>
                                <div className="w-full border-t border-dashed border-slate-300 absolute top-1/2 -translate-y-1/2"></div>
                                <span className="text-[10px] font-bold text-[#1a4484] mt-1.5 bg-white px-2 relative z-10 leading-none">Non-Stop</span>
                            </div>
                            
                            <div className="text-center w-[30%] min-w-0">
                                <p className="font-heading font-black text-[24px] sm:text-[26px] text-[#0B1A28] leading-none tracking-tight mb-2">{data.arrTime.split(' ')[0]}</p>
                                <p className="text-[12px] font-semibold text-[#0B1A28] truncate leading-tight">{data.arrAirport || data.arrCode}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{data.arrTerminal || 'Terminal A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Segment Footer */}
                    <div className="bg-[#f8fafc] px-4 sm:px-5 py-2.5 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center text-[11px] gap-3">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <p className="text-slate-500">Airline PNR: <span className="text-[#0B1A28] font-bold ml-0.5">{data.pnr || '10FS24'}</span></p>
                            <p className="text-slate-500">E-Ticket No: <span className="text-[#0B1A28] font-bold ml-0.5">{data.eTicket || 'Pending issuance'}</span></p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <p className="flex items-center gap-1.5 text-slate-500">
                                <span className="text-slate-400 bg-slate-200/50 p-0.5 rounded"><Luggage size={12} strokeWidth={2.5}/></span> Check-in: <span className="text-[#0B1A28] font-bold">{data.checkInBag || '20KG'}</span>
                            </p>
                            <p className="flex items-center gap-1.5 text-slate-500">
                                <span className="text-slate-400 bg-slate-200/50 p-0.5 rounded"><Briefcase size={12} strokeWidth={2.5}/></span> Hand Carry: <span className="text-[#0B1A28] font-bold">{data.handCarry || '7KG'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Umrah Inner Ticket Box */
                <div className="border border-slate-200 rounded-[1.25rem] p-5 sm:p-6 bg-white shadow-sm">
                    {/* Top Pills */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <div className="bg-[#f0f4f8] text-[#1a4484] px-3.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm border border-[#e2e8f0]">
                            {data.departDateFull}
                        </div>
                        <div className="border border-slate-200 bg-white text-slate-600 px-3.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 shadow-sm">
                            <Plane size={13} className="text-slate-400 transform -rotate-45" /> {data.airline}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[22px] sm:text-[26px] font-heading font-black text-[#0B1A28] mb-5 tracking-tight leading-none">
                        {data.title}
                    </h3>

                    {/* Route & Hotels */}
                    <div className="flex flex-wrap gap-2.5 mb-6">
                        <div className="border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-[11.5px] font-semibold flex items-center gap-2 bg-white">
                            <Bus size={14} className="text-[#1a4484]" strokeWidth={2.5}/> {data.route}
                        </div>
                        <div className="border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-[11.5px] font-semibold flex items-center gap-2 bg-white">
                            <div className="w-3.5 h-3.5 bg-[#0B1A28] flex flex-col justify-center overflow-hidden rounded-sm"><div className="w-full h-1 bg-[#fbbf24]"></div></div>
                            Makkah: {data.makkahHotel}
                        </div>
                        <div className="border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-[11.5px] font-semibold flex items-center gap-2 bg-white">
                            <div className="w-3.5 h-3.5 bg-[#10b981] rounded-t-full rounded-b-[2px]"></div>
                            Madinah: {data.madinahHotel}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[#0B1A28] text-[12px] font-bold mb-1">
                        <div className="flex items-center gap-2"><FileText size={15} className="text-[#0B1A28]" strokeWidth={2.5}/> Visa</div>
                        <div className="flex items-center gap-2"><Plane size={15} className="text-[#0B1A28]" strokeWidth={2.5}/> Flights</div>
                        <div className="flex items-center gap-2"><Building2 size={15} className="text-[#0B1A28]" strokeWidth={2.5}/> Hotels</div>
                        <div className="flex items-center gap-2"><Bus size={15} className="text-[#0B1A28]" strokeWidth={2.5}/> Transport</div>
                        <div className="flex items-center gap-2"><Compass size={15} className="text-[#0B1A28]" strokeWidth={2.5}/> Ziyarat</div>
                        <div className="flex items-center gap-2"><Coffee size={15} className="text-[#0B1A28]" strokeWidth={2.5}/> Food</div>
                    </div>
                </div>
            )}

            {/* Manage Booking Action Button */}
            {!isExpired && (
                <div className="flex justify-end pt-1">
                    <button className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-[#1a4484] border border-slate-200 px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 group/btn">
                        Manage Booking <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

const EmptyState = ({ category }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center w-full bg-[#ffffff] rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

            <div className="relative z-10 w-full">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                    {category === 'flights' ? <Plane size={32} className="sm:w-9 sm:h-9 text-[#1a4484]" strokeWidth={2} /> : <Compass size={32} className="sm:w-9 sm:h-9 text-[#1a4484]" strokeWidth={2} />}
                </div>
                <h3 className="text-xl sm:text-2xl font-heading text-[#0B1A28] mb-3 tracking-tight px-2">Your itinerary is clear</h3>
                <p className="text-[13px] sm:text-[14px] text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed px-4">
                    Looks like you haven't planned any {category === 'flights' ? 'flights' : 'packages'} yet. The world is waiting for you to explore it.
                </p>
                <button className="w-full sm:w-auto justify-center bg-[#1a4484] hover:bg-blue-800 text-white px-8 py-3.5 rounded-full text-[12px] font-extrabold uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(26,68,132,0.3)] transition-all active:scale-95 inline-flex items-center gap-2">
                    Start Planning <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

const BookingsView = ({ activeCategory }) => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = [
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'past', label: 'Completed / Past' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    const currentBookings = MOCK_BOOKINGS[activeCategory][activeTab].filter(booking => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            booking.id.toLowerCase().includes(query) ||
            booking.route?.toLowerCase().includes(query) ||
            (booking.departAirport && booking.departAirport.toLowerCase().includes(query)) ||
            (booking.arrAirport && booking.arrAirport.toLowerCase().includes(query)) ||
            (booking.title && booking.title.toLowerCase().includes(query))
        );
    });

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10 w-full">
                <div className="w-full sm:w-auto">
                    <div className="w-12 h-12 bg-blue-50 text-[#1a4484] rounded-full flex items-center justify-center mb-4">
                        {activeCategory === 'flights' ? <Plane size={24} strokeWidth={2} /> : <Globe size={24} strokeWidth={2} />}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#0B1A28] tracking-tight leading-none mb-2">
                        {activeCategory === 'flights' ? 'Flight Itineraries' : 'Umrah Packages'}
                    </h1>
                    <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium">Manage, view, and track your travel plans seamlessly.</p>
                </div>

                <div className="flex w-full sm:w-auto shadow-sm">
                    <input
                        type="text"
                        placeholder="Search Booking Ref..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 bg-white border border-slate-200 focus:border-[#1a4484] focus:ring-2 focus:ring-[#1a4484]/20 rounded-l-lg py-3 px-4 text-[13px] font-semibold text-[#0B1A28] outline-none transition-all min-w-0"
                    />
                    <button className="flex items-center justify-center bg-[#1a4484] hover:bg-blue-800 text-white px-4 sm:px-5 py-3 rounded-r-lg transition-all active:scale-95 shrink-0">
                        <Search size={18} strokeWidth={2} />
                    </button>
                </div>
            </div>

            <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full snap-x">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`snap-start px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all active:scale-95 shrink-0 ${activeTab === tab.id
                            ? 'bg-[#0B1A28] text-white shadow-xl'
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-[#1a4484] hover:text-[#0B1A28]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                {currentBookings.length > 0 ? (
                    <div className="flex flex-col gap-0 w-full">
                        {currentBookings.map((booking) => (
                            <BookingCard key={booking.id} data={booking} category={activeCategory} />
                        ))}
                    </div>
                ) : (
                    <EmptyState category={activeCategory} />
                )}
            </div>
        </>
    );
};

const WalletView = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            
            {/* Premium Centered Wallet Card */}
            <div className="mb-10 w-full flex justify-center px-2">
                <div className="w-full max-w-[500px] bg-gradient-to-br from-[#0B1A28] via-[#112948] to-[#1a4484] rounded-[2rem] p-7 sm:p-10 text-white shadow-[0_20px_50px_-12px_rgba(26,68,132,0.4)] relative overflow-hidden group border border-white/10">
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-12 -right-12 opacity-[0.04] transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                        <Wallet size={240} strokeWidth={1} />
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-8 sm:gap-10">
                        
                        {/* Balance Area */}
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-200/80 text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.2em] mb-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                Available Balance
                            </div>
                            <div className="flex items-baseline justify-center sm:justify-start gap-2">
                                <span className="text-[20px] sm:text-[24px] font-bold text-blue-100">{MOCK_WALLET.currency}</span>
                                <span className="text-[48px] sm:text-[56px] font-heading font-black tracking-tighter leading-none drop-shadow-md">{MOCK_WALLET.balance}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row items-center gap-3 sm:gap-4 w-full">
                            <button className="flex-1 bg-white hover:bg-slate-50 text-[#0B1A28] py-4 rounded-2xl font-black text-[12px] sm:text-[13px] uppercase tracking-wider transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
                                <Plus size={18} strokeWidth={3} className="text-[#1a4484] hidden sm:block" /> Deposit
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-2xl font-black text-[12px] sm:text-[13px] uppercase tracking-wider transition-all active:scale-95 backdrop-blur-md shadow-lg flex items-center justify-center gap-2">
                                <ArrowUpRight size={18} strokeWidth={3} className="text-white/80 hidden sm:block" /> Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Centered Transactions Container */}
            <div className="bg-[#ffffff] rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden max-w-[800px] mx-auto">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-[13px] sm:text-[14px] font-heading font-black text-[#0B1A28] uppercase tracking-widest">Recent Transactions</h3>
                    <button className="text-slate-400 hover:text-[#1a4484] transition-colors p-1 active:scale-95" title="Download Statement">
                        <Receipt size={18} strokeWidth={2} />
                    </button>
                </div>

                <div className="divide-y divide-slate-100">
                    {MOCK_WALLET.transactions.map((txn, idx) => (
                        <div key={txn.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors gap-3">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'credit' ? 'bg-emerald-100/60 text-[#10b981]' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {txn.type === 'credit' ? <ArrowDownLeft size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} /> : <ArrowUpRight size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[13px] sm:text-[15px] font-bold text-[#0B1A28] mb-0.5 truncate">{txn.desc}</h4>
                                    <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-semibold text-slate-500 flex-wrap">
                                        <span className="whitespace-nowrap">{txn.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                        <span className="whitespace-nowrap">{txn.time}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                        <span className="font-mono text-[#1a4484] truncate">{txn.id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`text-right font-heading tracking-tight text-[14px] sm:text-[16px] whitespace-nowrap shrink-0 ${txn.type === 'credit' ? 'text-[#10b981]' : 'text-[#0B1A28]'
                                }`}>
                                {txn.type === 'credit' ? '+' : ''}{txn.amount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button className="text-[11px] font-bold text-slate-500 hover:text-[#1a4484] uppercase tracking-widest transition-colors active:scale-95">
                        View All Transactions
                    </button>
                </div>
            </div>
        </div>
    );
};

const HelpCenterView = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    const filteredFaqs = MOCK_FAQS.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">

            <div className="bg-gradient-to-br from-[#0B1A28] to-[#1a4484] rounded-[2rem] p-6 sm:p-10 mb-8 relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(26,68,132,0.3)]">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-white/20">
                        <HelpCircle size={28} className="sm:w-8 sm:h-8 text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white tracking-tight mb-2 sm:mb-3 px-2">Hi Ahsan, how can we help?</h2>
                    <p className="text-blue-100 text-[13px] sm:text-[14px] font-medium mb-6 sm:mb-8 px-4">Search for answers or contact our 24/7 support team.</p>

                    <div className="relative max-w-xl mx-auto shadow-xl">
                        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} className="sm:w-5 sm:h-5" strokeWidth={2} /></div>
                        <input
                            type="text"
                            placeholder="Search for questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white rounded-lg py-3.5 sm:py-4 pl-10 sm:pl-12 pr-4 text-[13px] sm:text-[14px] font-semibold text-[#0B1A28] outline-none focus:ring-4 focus:ring-blue-500/30 transition-all min-w-0"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-10">
                <div className="bg-[#ffffff] rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col items-center text-center shadow-xl hover:border-[#1a4484] group cursor-pointer transition-all active:scale-95">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#1a4484] transition-colors">
                        <PhoneCall size={20} className="text-[#1a4484] group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-heading text-[#0B1A28] mb-1">Call Support</h3>
                    <p className="text-[12px] font-medium text-slate-500 mb-4">+92 300 1234567</p>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-[#1a4484]">Call Now</button>
                </div>

                <div className="bg-[#ffffff] rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col items-center text-center shadow-xl hover:border-[#1a4484] group cursor-pointer transition-all active:scale-95">
                    <div className="w-12 h-12 bg-emerald-100/60 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#10b981] transition-colors">
                        <MessageCircle size={20} className="text-[#10b981] group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-heading text-[#0B1A28] mb-1">Live Chat</h3>
                    <p className="text-[12px] font-medium text-slate-500 mb-4">Reply within 5 mins</p>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-[#10b981]">Start Chat</button>
                </div>

                <div className="bg-[#ffffff] rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col items-center text-center shadow-xl hover:border-[#1a4484] group cursor-pointer transition-all active:scale-95">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#0B1A28] transition-colors">
                        <Mail size={20} className="text-slate-600 group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <h3 className="text-[15px] font-heading text-[#0B1A28] mb-1">Email Us</h3>
                    <p className="text-[12px] font-medium text-slate-500 mb-4">support@saer.pk</p>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-[#0B1A28]">Send Email</button>
                </div>
            </div>

            <div className="bg-[#ffffff] rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-5 sm:p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                        <FileQuestion size={20} className="text-[#1a4484]" strokeWidth={2} />
                    </div>
                    <h3 className="text-[16px] sm:text-lg font-heading text-[#0B1A28]">Frequently Asked Questions</h3>
                </div>

                <div className="divide-y divide-slate-100">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <div key={faq.id} className="group">
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full flex items-center justify-between p-5 sm:p-6 md:px-8 text-left hover:bg-slate-50 transition-colors outline-none"
                                >
                                    <span className={`text-[13px] sm:text-[14px] md:text-[15px] font-bold pr-4 transition-colors ${activeFaq === faq.id ? 'text-[#1a4484]' : 'text-[#0B1A28]'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeFaq === faq.id ? 'bg-[#1a4484] text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                                        <ChevronDown size={16} strokeWidth={2} />
                                    </div>
                                </button>
                                <div
                                    className={`px-5 sm:px-6 md:px-8 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === faq.id ? 'max-h-[500px] opacity-100 pb-5 sm:pb-6' : 'max-h-0 opacity-0 pb-0'}`}
                                >
                                    <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed border-l-2 border-[#1a4484] pl-3 sm:pl-4 py-1 bg-slate-50 rounded-r-lg">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 sm:p-10 text-center text-[13px] sm:text-[14px] text-slate-500 font-medium">
                            No questions found matching your search.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};


// --- SIDEBAR CONTENT COMPONENT (Moved outside to prevent unmounting) ---
const SidebarContent = ({ activeMenu, handleMenuClick, onSignOut }) => (
    <div className="flex flex-col h-full bg-[#f0f2f5]">
        {/* User Profile Card */}
        <div className="px-5 pt-8 pb-4">
            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-11 h-11 rounded-full bg-[#1a4484] text-white flex items-center justify-center font-heading font-black text-lg shadow-sm shrink-0">
                    {USER_DATA.initials}
                </div>
                <div className="overflow-hidden">
                    <h2 className="text-[14px] font-heading font-bold text-[#0B1A28] leading-tight truncate">{USER_DATA.name}</h2>
                    <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{USER_DATA.email}</p>
                </div>
            </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3.5 pb-6 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 mt-4">
            <button onClick={() => handleMenuClick('profile')} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all active:scale-95 ${activeMenu === 'profile' ? 'bg-white shadow-md text-[#0B1A28] font-bold border border-slate-200' : 'text-slate-500 hover:bg-slate-100 font-medium'}`}>
                <User size={18} className={activeMenu === 'profile' ? 'text-[#1a4484]' : 'text-slate-400'} strokeWidth={2.5} />
                <span className="text-[13px]">My Profile</span>
            </button>

            <button onClick={() => handleMenuClick('travellers')} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all active:scale-95 ${activeMenu === 'travellers' ? 'bg-white shadow-md text-[#0B1A28] font-bold border border-slate-200' : 'text-slate-500 hover:bg-slate-100 font-medium'}`}>
                <Users size={18} className={activeMenu === 'travellers' ? 'text-[#1a4484]' : 'text-slate-400'} strokeWidth={2.5} />
                <span className="text-[13px]">Travellers List</span>
            </button>

            <div className="pt-6 pb-2">
                <span className="px-4 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400 block mb-2.5">Booking Management</span>
                <div className="space-y-1.5">
                    <button
                        onClick={() => handleMenuClick('flight_bookings')}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all active:scale-95 ${activeMenu === 'flight_bookings' ? 'bg-white shadow-md text-[#0B1A28] font-bold border border-slate-200' : 'text-slate-500 hover:bg-slate-100 font-medium'}`}
                    >
                        <Plane size={18} className={activeMenu === 'flight_bookings' ? 'text-[#1a4484]' : 'text-slate-400'} strokeWidth={2.5} />
                        <span className="text-[13px]">Flight Bookings</span>
                    </button>
                    <button
                        onClick={() => handleMenuClick('umrah_bookings')}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all active:scale-95 ${activeMenu === 'umrah_bookings' ? 'bg-white shadow-md text-[#0B1A28] font-bold border border-slate-200' : 'text-slate-500 hover:bg-slate-100 font-medium'}`}
                    >
                        <Globe size={18} className={activeMenu === 'umrah_bookings' ? 'text-[#1a4484]' : 'text-slate-400'} strokeWidth={2.5} />
                        <span className="text-[13px]">Umrah Packages</span>
                    </button>
                </div>
            </div>

            <div className="pt-4 pb-2">
                <span className="px-4 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400 block mb-2.5">Account</span>
                <button onClick={() => handleMenuClick('wallet')} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all active:scale-95 ${activeMenu === 'wallet' ? 'bg-white shadow-md text-[#0B1A28] font-bold border border-slate-200' : 'text-slate-500 hover:bg-slate-100 font-medium'}`}>
                    <Wallet size={18} className={activeMenu === 'wallet' ? 'text-[#1a4484]' : 'text-slate-400'} strokeWidth={2.5} />
                    <span className="text-[13px]">My Wallet</span>
                </button>

                <button onClick={() => handleMenuClick('help')} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all active:scale-95 ${activeMenu === 'help' ? 'bg-white shadow-md text-[#0B1A28] font-bold border border-slate-200' : 'text-slate-500 hover:bg-slate-100 font-medium'}`}>
                    <HelpCircle size={18} className={activeMenu === 'help' ? 'text-[#1a4484]' : 'text-slate-400'} strokeWidth={2.5} />
                    <span className="text-[13px]">Support Center</span>
                </button>
            </div>
        </nav>

        {/* Redesigned Sign Out Button */}
        <div className="px-5 pb-8 pt-4">
            <button
                onClick={onSignOut}
                className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-all active:scale-[0.98] font-heading font-black text-[11px] uppercase tracking-[0.15em] shadow-sm"
            >
                <LogOut size={16} strokeWidth={3} /> SIGN OUT
            </button>
        </div>
    </div>
);

// --- MAIN DASHBOARD PAGE ---

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('flight_bookings');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const onSignOut = () => alert("Signed Out!");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [activeMenu]);

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        const validMenus = ['profile', 'travellers', 'flight_bookings', 'umrah_bookings', 'wallet', 'help'];

        if (validMenus.includes(lastPart)) {
            setActiveMenu(lastPart);
        } else if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
            setActiveMenu('flight_bookings');
        }
    }, [location.pathname]);

    const handleMenuClick = (menuId) => {
        navigate('/dashboard/' + menuId);
        setActiveMenu(menuId);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const renderMainContent = () => {
        switch (activeMenu) {
            case 'profile':
                return (
                    <>
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#0B1A28] tracking-tight leading-none mb-2">My Profile</h1>
                            <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium">Manage your personal details and account settings.</p>
                        </div>
                        <ProfileView />
                    </>
                );
            case 'travellers':
                return (
                    <>
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#0B1A28] tracking-tight leading-none mb-2">Travellers List</h1>
                            <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium">Add or edit passengers to make booking faster.</p>
                        </div>
                        <TravellersView />
                    </>
                );
            case 'wallet':
                return (
                    <>
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#0B1A28] tracking-tight leading-none mb-2">My Wallet</h1>
                            <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium">Manage your balance, saved payment methods, and transactions.</p>
                        </div>
                        <WalletView />
                    </>
                );
            case 'help':
                return <HelpCenterView />;
            case 'umrah_bookings':
                return <BookingsView activeCategory="umrah" />;
            case 'flight_bookings':
            default:
                return <BookingsView activeCategory="flights" />;
        }
    };

    return (
        <div className="bg-[#f0f2f5] min-h-screen font-body flex flex-col lg:flex-row w-full relative text-[#0B1A28]">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@900&family=Inter:wght@400;500;600;700&family=Montserrat:wght@800;900&family=Roboto+Slab:wght@800&display=swap');
        
        .font-body { font-family: 'Inter', sans-serif; }
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-brand-saer { font-family: 'Eczar', serif; letter-spacing: -0.06em; }
        .font-brand-pk { font-family: 'Roboto Slab', serif; letter-spacing: -0.02em; }
      `}</style>

            {/* Sticky Sidebar on Desktop */}
            <aside className="hidden lg:block w-[320px] border-r border-slate-200 bg-[#f0f2f5] h-screen sticky top-0 shrink-0 z-10">
                <SidebarContent activeMenu={activeMenu} handleMenuClick={handleMenuClick} onSignOut={onSignOut} />
            </aside>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-[150] lg:hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-[#0B1A28]/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
                <aside className={`absolute top-0 left-0 w-[280px] h-full bg-[#f0f2f5] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-200 rounded-full text-slate-600 hover:bg-slate-300 z-20 active:scale-95 transition-all">
                        <X size={18} strokeWidth={2} />
                    </button>
                    <SidebarContent activeMenu={activeMenu} handleMenuClick={handleMenuClick} onSignOut={onSignOut} />
                </aside>
            </div>

            <main className="flex-1 w-full relative">
                {/* Mobile Header Toolbar */}
                <div className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-[#0B1A28] p-2 -ml-2 hover:bg-slate-100 rounded-xl active:scale-90 transition-all">
                            <Menu size={24} strokeWidth={2.5} />
                        </button>
                        <h1 className="text-[16px] font-heading font-black text-[#0B1A28] tracking-tight uppercase">
                            {activeMenu.replace('_', ' ')}
                        </h1>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1a4484] text-white flex items-center justify-center font-heading font-black text-xs">
                        {USER_DATA.initials}
                    </div>
                </div>

                {/* Dashboard Content Container */}
                <div className="max-w-[1000px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 w-full">
                    {renderMainContent()}
                </div>
            </main>
        </div>
    );
}