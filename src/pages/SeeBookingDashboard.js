import React, { useState, useEffect, useRef } from 'react';
import {
    Check, Plane, FileText, Download, AlertTriangle,
    ArrowLeft, ArrowRight, Copy, CheckSquare, Clock, MapPin,
    HelpCircle, Phone, MessageCircle, Mail, User,
    Building, Bus, ChevronDown, ChevronUp, Globe, Compass,
    Ticket, Info, CreditCard, Users, Wallet, LogOut,
    ArrowUpRight, ArrowDownLeft, Receipt
} from 'lucide-react';

// --- MOCK DATA ---

const TICKET_DATA = {
    orderId: 'WFZ5ZF4TE7U26',
    pnr: 'J3I9FY',
    status: 'Confirmed',
    email: 'ahsaan.raza.butt@gmail.com',
    phone: '+92 3000709017',
    travelers: [
        { type: 'Adult', title: 'Mr', firstName: 'Ahsaan Raza', lastName: 'Butt' }
    ],
    flights: [
        {
            id: 'outbound',
            direction: 'Departure',
            departDate: 'Thu, Mar 05, 2026',
            airline: 'Saudia Airlines SV-701',
            airlineName: 'Saudia',
            airlineLogo: 'https://trade.newchoudhary.com/flight/images/airlines/SV.png',
            class: 'Economy (Fly+)',
            duration: '04h 05m',
            type: 'Direct',
            from: { city: 'Riyadh', code: 'RUH', time: '04:20', airport: 'King Khalid International Airport, Riyadh', terminal: 'Terminal 1' },
            to: { city: 'Sialkot', code: 'SKT', time: '10:25', airport: 'Sialkot Airport, Sialkot', terminal: 'Terminal 1' },
            baggage: [{ type: 'Cabin Bag', desc: '1 × 7kg/adult' }, { type: 'Checked Bag', desc: '1 × 20kg/adult' }]
        },
        {
            id: 'inbound',
            direction: 'Return',
            departDate: 'Thu, Mar 15, 2026',
            airline: 'Saudia Airlines SV-702',
            airlineName: 'Saudia',
            airlineLogo: 'https://trade.newchoudhary.com/flight/images/airlines/SV.png',
            class: 'Economy (Fly+)',
            duration: '04h 25m',
            type: 'Direct',
            from: { city: 'Sialkot', code: 'SKT', time: '14:00', airport: 'Sialkot Airport, Sialkot', terminal: 'Terminal 1' },
            to: { city: 'Riyadh', code: 'RUH', time: '18:25', airport: 'King Khalid International Airport, Riyadh', terminal: 'Terminal 1' },
            baggage: [{ type: 'Cabin Bag', desc: '1 × 7kg/adult' }, { type: 'Checked Bag', desc: '1 × 20kg/adult' }]
        }
    ],
    price: {
        baseFare: 66906.94,
        taxes: 13415.88,
        bookingFee: 3956.94,
        processingFee: 0,
        total: 84279.27,
        paymentMethod: 'PayFast'
    }
};

const UMRAH_DATA = {
    orderId: 'UMR-992817462',
    pnr: 'UM-882A',
    status: 'Confirmed',
    email: 'ahsaan.raza.butt@gmail.com',
    phone: '+92 3000709017',
    travelers: [
        { type: 'Adult', title: 'Mr', firstName: 'ALI', lastName: 'RAZA' },
        { type: 'Adult', title: 'Mrs', firstName: 'Ayesha', lastName: 'ALI' }
    ],
    packageDetails: {
        name: '15 Days Premium Umrah Package',
        travelDate: '12 Ramadan 2026',
        returnDate: '27 Ramadan 2026',
        duration: '15 Days / 14 Nights',
        hotels: [
            { city: 'Makkah', name: 'Swissôtel Al Maqam', nights: 7, checkIn: '12 Ramadan', checkOut: '19 Ramadan', distance: '100m from Haram' },
            { city: 'Madinah', name: 'Pullman Zamzam Madina', nights: 7, checkIn: '19 Ramadan', checkOut: '27 Ramadan', distance: '150m from Masjid an-Nabawi' }
        ],
        transport: 'Jeddah ➔ Makkah ➔ Madinah ➔ Jeddah (VIP Bus)',
        ziyarat: {
            summary: 'Makkah & Madinah Guided Ziyarat Included',
            makkah: 'Jabal al-Noor (Cave of Hira), Jabal Thawr, Arafat, Mina, Muzdalifah.',
            madinah: 'Masjid Quba, Masjid Qiblatayn, Mount Uhud, Date Market.'
        },
        statusSteps: [
            { step: 'E-Visa', status: 'ISSUED', date: '2 days ago', isCompleted: true },
            { step: 'Flights', status: 'CONFIRMED', date: '2 days ago', isCompleted: true },
            { step: 'Hotels', status: 'VOUCHERS READY', date: 'Yesterday', isCompleted: true },
            { step: 'Transport', status: 'SCHEDULED', date: 'Pending', isCompleted: false },
        ],
        flights: [
            {
                id: 'outbound',
                direction: 'Departure',
                departDate: '12 Ramadan 2026',
                airline: 'Saudia Airlines SV-701',
                airlineName: 'Saudia',
                airlineLogo: 'https://trade.newchoudhary.com/flight/images/airlines/SV.png',
                class: 'Economy',
                duration: '05h 45m',
                type: '1 Stopover',
                from: { city: 'Lahore', code: 'LHE', time: '10:30', airport: 'Allama Iqbal Int.', terminal: 'Terminal M' },
                layover: { city: 'Riyadh', code: 'RUH', duration: '02h 15m' },
                to: { city: 'Jeddah', code: 'JED', time: '18:30', airport: 'King Abdulaziz Int.', terminal: 'Hajj Terminal' },
                baggage: [{ type: 'Cabin Bag', desc: '1 × 7kg/adult' }, { type: 'Checked Bag', desc: '1 × 20kg/adult' }]
            },
            {
                id: 'inbound',
                direction: 'Return',
                departDate: '27 Ramadan 2026',
                airline: 'Saudia Airlines SV-702',
                airlineName: 'Saudia',
                airlineLogo: 'https://trade.newchoudhary.com/flight/images/airlines/SV.png',
                class: 'Economy',
                duration: '04h 30m',
                type: 'Direct',
                from: { city: 'Jeddah', code: 'JED', time: '22:15', airport: 'King Abdulaziz Int.', terminal: 'Hajj Terminal' },
                to: { city: 'Lahore', code: 'LHE', time: '02:45', airport: 'Allama Iqbal Int.', terminal: 'Terminal M' },
                baggage: [{ type: 'Cabin Bag', desc: '1 × 7kg/adult' }, { type: 'Checked Bag', desc: '1 × 20kg/adult' }]
            }
        ]
    },
    price: {
        baseFare: 350000.00,
        taxes: 25000.00,
        bookingFee: 5000.00,
        processingFee: 0,
        total: 380000.00,
        paymentMethod: 'Bank Transfer (1BILL)'
    }
};

// --- CUSTOM COMPONENTS ---

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="inline-flex items-center justify-center p-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors relative group" title="Copy">
            {copied ? <CheckSquare size={16} className="text-blue-100" /> : <Copy size={16} className="text-white" />}
            {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">Copied!</span>}
        </button>
    );
};

const AdvisoryBanner = () => (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
        <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
        <div>
            <h4 className="text-[13px] font-extrabold text-orange-900 mb-1">Travel Advisory</h4>
            <p className="text-[12px] text-orange-800 leading-relaxed font-medium">
                Your booking is confirmed and your itinerary is currently scheduled as planned. As situations can evolve globally, we highly encourage you to stay updated with your airline/operator for any schedule changes prior to departure.
            </p>
        </div>
    </div>
);

const DashboardSkeleton = () => (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full animate-pulse">
        <div className="h-10 w-32 bg-slate-200 rounded-full mb-6"></div>
        <div className="h-24 w-full bg-slate-200 rounded-xl mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
            <div className="flex flex-col gap-6">
                <div className="h-64 w-full bg-slate-200 rounded-2xl"></div>
                <div className="h-80 w-full bg-slate-200 rounded-2xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-48 w-full bg-slate-200 rounded-2xl"></div>
                    <div className="h-48 w-full bg-slate-200 rounded-2xl"></div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="h-72 w-full bg-slate-200 rounded-2xl"></div>
                <div className="h-64 w-full bg-slate-200 rounded-2xl"></div>
            </div>
        </div>
    </div>
);

// --- MAIN PAGE VIEWS ---

const BookingDashboard = ({ type, onBack }) => {
    const isUmrah = type === 'umrah';
    const data = isUmrah ? UMRAH_DATA : TICKET_DATA;
    const flights = isUmrah ? data.packageDetails.flights : data.flights;

    const [showImportantInfo, setShowImportantInfo] = useState(false);
    const [flightDetailsOpen, setFlightDetailsOpen] = useState(false);
    const [ziyaratOpen, setZiyaratOpen] = useState(false);

    const toggleFlightDetails = (e) => {
        if (window.getSelection().toString().length > 0) return;
        setFlightDetailsOpen(!flightDetailsOpen);
    };

    const getStepIcon = (stepName) => {
        switch (stepName) {
            case 'E-Visa': return FileText;
            case 'Flights': return Plane;
            case 'Hotels': return Building;
            case 'Transport': return Bus;
            default: return Check;
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">

            <div className="flex items-center justify-between mb-5 animate-in fade-in">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[#1a4484] font-bold text-[13px] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 active:scale-95">
                    <ArrowLeft size={16} /> Back to Search
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Manage Booking</span>
                </div>
            </div>

            <AdvisoryBanner />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

                <div className="flex flex-col gap-5">

                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a4484] to-[#0B1A28] shadow-[0_10px_40px_-10px_rgba(26,68,132,0.4)] animate-in fade-in zoom-in-95 duration-500">
                        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        <div className="absolute -right-12 -bottom-16 opacity-10 pointer-events-none text-white">
                            {isUmrah ? <Globe size={240} strokeWidth={1} /> : <Plane size={240} strokeWidth={1} className="-rotate-45" />}
                        </div>

                        <div className="relative z-10 p-5 md:p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-3">
                                <Check size={24} className="text-[#1a4484]" strokeWidth={3.5} />
                            </div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2 drop-shadow-md">Booking Confirmed!</h1>

                            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 mb-4 shadow-sm">
                                <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Booking ID</span>
                                <div className="w-px h-3 bg-white/30"></div>
                                <span className="text-white font-mono font-bold text-[13px] md:text-[14px] tracking-wider">{data.orderId}</span>
                                <CopyButton text={data.orderId} />
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-4 max-w-2xl w-full shadow-sm">
                                <p className="text-white/90 text-[11px] md:text-[12px] font-medium leading-relaxed mb-4">
                                    You shall be receiving an email with the complete booking details & {isUmrah ? 'package vouchers' : 'ticket information'} at <strong className="text-white font-bold">{data.email}</strong>. Use the above Booking ID in all communications.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full">
                                    {isUmrah ? (
                                        <>
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white text-[#1a4484] hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                                                <Building size={14} strokeWidth={2.5} /> Hotel Vouchers
                                            </button>
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#0B1A28] text-white hover:bg-slate-800 border border-[#0B1A28] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                                                <Ticket size={14} strokeWidth={2.5} /> E-Ticket
                                            </button>
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white/20 text-white hover:bg-white/30 border border-white/30 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                                                <FileText size={14} strokeWidth={2.5} /> E-Receipt
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white text-[#1a4484] hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                                                <Download size={14} strokeWidth={2.5} /> Download E-Ticket
                                            </button>
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white/20 text-white hover:bg-white/30 border border-white/30 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                                                <FileText size={14} strokeWidth={2.5} /> E-Receipt
                                            </button>
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white/20 text-white hover:bg-white/30 border border-white/30 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                                                <Wallet size={14} strokeWidth={2.5} /> Refund Ticket
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isUmrah && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 md:p-4 flex flex-row justify-between items-start gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {data.packageDetails.statusSteps.map((step, idx) => {
                                const StepIcon = getStepIcon(step.step);
                                return (
                                    <div key={idx} className="flex flex-col items-center flex-1 min-w-[72px] sm:min-w-[80px]">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shrink-0 ${step.isCompleted ? 'bg-blue-100/60' : 'bg-slate-100'}`}>
                                            <StepIcon size={14} className={step.isCompleted ? 'text-[#1a4484]' : 'text-slate-400'} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-[12px] sm:text-[13px] font-extrabold text-slate-800 text-center leading-tight">{step.step}</span>
                                        <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider mt-0.5 text-center leading-snug ${step.isCompleted ? 'text-[#1a4484]' : 'text-slate-400'}`}>
                                            {step.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">

                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <h2 className="text-[14px] font-black text-slate-800 flex items-center gap-1.5">
                                {isUmrah ? <Globe className="text-[#1a4484]" size={16} /> : <Plane className="text-[#1a4484]" size={16} />}
                                {isUmrah ? 'Package Details' : 'Flight Itinerary'}
                            </h2>

                            {isUmrah && (
                                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-2 py-1 shadow-sm">
                                    <div className="text-right">
                                        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest block">Depart</span>
                                        <span className="text-[9px] font-black text-[#1a4484]">{data.packageDetails.travelDate}</span>
                                    </div>
                                    <ArrowRight size={10} className="text-slate-300" />
                                    <div className="text-left">
                                        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest block">Return</span>
                                        <span className="text-[9px] font-black text-[#1a4484]">{data.packageDetails.returnDate}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            className="flex flex-col cursor-pointer group hover:bg-slate-50/50 transition-colors"
                            onClick={toggleFlightDetails}
                        >
                            {flights.map((f, index) => {
                                return (
                                    <div key={index} className={`relative p-2.5 sm:p-3 ${index !== 0 ? 'border-t border-slate-100' : ''}`}>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <div className={`p-1.5 rounded-lg shrink-0 ${f.direction === 'Departure' ? 'bg-blue-50' : 'bg-slate-100'}`}>
                                                <Plane size={14} className={f.direction === 'Departure' ? 'text-[#1a4484]' : 'text-slate-600'} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${f.direction === 'Departure' ? 'bg-blue-100/60 text-[#1a4484]' : 'bg-slate-200/60 text-slate-700'}`}>
                                                    {f.direction}
                                                </span>
                                                <span className="text-[11px] font-black text-slate-800">{f.departDate}</span>
                                                <span className="text-[11px] text-slate-400 font-medium">|</span>
                                                <span className="text-[11px] font-bold text-slate-600">{f.airlineName} • {f.class}</span>
                                                <span className="text-[11px] font-bold text-[#1a4484] ml-auto sm:ml-0 bg-blue-50 px-1.5 rounded">{f.type}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center px-1 max-w-[550px] mx-auto w-full mt-3 mb-1">
                                            <div className="text-left w-24 sm:w-28">
                                                <div className="text-[11px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-0.5">{f.from.city}</div>
                                                <div className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{f.from.code}</div>
                                                <div className="text-[13px] font-bold text-[#1a4484] mt-0.5">{f.from.time}</div>
                                            </div>

                                            <div className="flex-1 px-4 sm:px-8 relative flex flex-col items-center justify-center">
                                                <div className="w-full absolute top-1/2 -translate-y-1/2 left-0 flex items-center justify-between z-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a4484] shrink-0"></div>
                                                    <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-1"></div>
                                                    {f.type.includes('Stop') && <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mx-1 shadow-[0_0_0_2px_#ffffff] z-20"></div>}
                                                    {f.type.includes('Stop') && <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-1"></div>}
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a4484] shrink-0"></div>
                                                </div>
                                                <div className="bg-white border border-slate-200 text-slate-500 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-sm uppercase tracking-wider">
                                                    {f.duration}
                                                </div>
                                            </div>

                                            <div className="text-right w-24 sm:w-28">
                                                <div className="text-[11px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-0.5">{f.to.city}</div>
                                                <div className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{f.to.code}</div>
                                                <div className="text-[13px] font-bold text-[#1a4484] mt-0.5">{f.to.time}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex items-center justify-center gap-1.5 py-2 border-t border-slate-100 text-[#1a4484] transition-colors group-hover:bg-slate-100/50">
                                <span className="text-[9px] font-black uppercase tracking-widest">{flightDetailsOpen ? 'Hide Full Details' : 'View Full Flight Details'}</span>
                                {flightDetailsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </div>
                        </div>

                        {flightDetailsOpen && (
                            <div className="p-3 bg-slate-50 border-t border-slate-200 animate-in slide-in-from-top-4 duration-300 flex flex-col gap-4">
                                {flights.map((f, idx) => (
                                    <div key={`detail-${idx}`} className={idx !== 0 ? 'pt-4 border-t border-slate-200' : ''}>
                                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${f.direction === 'Departure' ? 'bg-[#1a4484]' : 'bg-slate-600'}`}></span>
                                            {f.direction} Segment Details
                                        </h4>

                                        <div className="relative pl-4 border-l-2 border-dashed border-slate-300 ml-1.5 space-y-4">
                                            <div className="relative">
                                                <div className="absolute -left-[20px] top-1 w-2 h-2 rounded-full bg-white border-[1.5px] border-[#1a4484]"></div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[12px] font-black text-slate-900 leading-tight">{f.from.city} ({f.from.code})</p>
                                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{f.from.airport}, {f.from.terminal}</p>
                                                    </div>
                                                    <span className="text-[12px] font-black text-[#1a4484]">{f.from.time}</span>
                                                </div>
                                                <div className="mt-2 bg-white border border-slate-200 rounded-md p-1.5 flex items-center gap-2 w-fit shadow-sm">
                                                    {f.airlineLogo && <img src={f.airlineLogo} className="h-2.5 grayscale opacity-70" alt="logo" />}
                                                    <div className="text-[9px] text-slate-600 font-bold border-l border-slate-200 pl-2">
                                                        {f.airline} • {f.class}
                                                    </div>
                                                </div>
                                            </div>

                                            {f.layover && (
                                                <div className="relative bg-orange-50 border border-orange-100 rounded-md p-2 w-fit">
                                                    <div className="absolute -left-[23px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-[1.5px] border-orange-400"></div>
                                                    <p className="text-[9px] font-bold text-orange-800 flex items-center gap-1.5">
                                                        <Clock size={10} /> {f.layover.duration} Layover in {f.layover.city} ({f.layover.code})
                                                    </p>
                                                </div>
                                            )}

                                            <div className="relative">
                                                <div className="absolute -left-[20px] top-1 w-2 h-2 rounded-full bg-white border-[1.5px] border-[#1a4484]"></div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[12px] font-black text-slate-900 leading-tight">{f.to.city} ({f.to.code})</p>
                                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{f.to.airport}, {f.to.terminal}</p>
                                                    </div>
                                                    <span className="text-[12px] font-black text-[#1a4484]">{f.to.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Airline PNR:</span>
                                <span className="text-[12px] font-black text-slate-900 tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">{data.pnr}</span>
                            </div>
                        </div>

                        {isUmrah && (
                            <div className="p-4 space-y-4 border-t-[4px] border-slate-100 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5"><Building size={14} /> Accommodations</h4>
                                        <div className="space-y-2.5">
                                            {data.packageDetails.hotels.map((h, i) => (
                                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{h.city}</span>
                                                        <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">{h.nights} Nights</span>
                                                    </div>
                                                    <p className="text-[12px] font-bold text-slate-800 mb-1">{h.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><MapPin size={10} /> {h.distance}</p>
                                                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 text-[9px] font-semibold text-slate-600">
                                                        {h.checkIn} — {h.checkOut}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5"><Bus size={14} /> Transport & Extras</h4>
                                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <Bus size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                                    <span className="text-[11px] font-medium text-slate-700">{data.packageDetails.transport}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:border-blue-200 transition-colors">
                                            <div
                                                onClick={() => setZiyaratOpen(!ziyaratOpen)}
                                                className="flex justify-between items-center cursor-pointer p-2.5 bg-blue-50/30"
                                            >
                                                <div className="flex gap-2 items-center text-[#1a4484] font-extrabold text-[11px] uppercase tracking-wide">
                                                    <Compass size={14} /> Ziyarat Included
                                                </div>
                                                <ChevronDown size={14} className={`text-[#1a4484] transition-transform duration-300 ${ziyaratOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                            {ziyaratOpen && (
                                                <div className="p-3 border-t border-slate-100 bg-white animate-in slide-in-from-top-2 duration-200">
                                                    <p className="text-[10px] text-slate-500 font-bold mb-2.5 bg-slate-50 p-2 rounded">{data.packageDetails.ziyarat.summary}</p>
                                                    <div className="space-y-2.5">
                                                        <div>
                                                            <span className="text-[9px] font-black text-slate-800 uppercase block mb-0.5">Makkah Ziyarat:</span>
                                                            <p className="text-[10px] text-slate-600 leading-relaxed">{data.packageDetails.ziyarat.makkah}</p>
                                                        </div>
                                                        <div className="pt-2 border-t border-slate-100">
                                                            <span className="text-[9px] font-black text-slate-800 uppercase block mb-0.5">Madinah Ziyarat:</span>
                                                            <p className="text-[10px] text-slate-600 leading-relaxed">{data.packageDetails.ziyarat.madinah}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                            <h3 className="text-[13px] font-black text-slate-800 mb-3 flex items-center gap-2">
                                <Users size={16} className="text-[#1a4484]" /> Passenger Details
                            </h3>
                            <div className="space-y-2.5">
                                {data.travelers.map((t, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[#1a4484]"><User size={12} /></div>
                                        <div>
                                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.type}</span>
                                            <span className="block text-[12px] font-bold text-slate-800">{t.title} {t.firstName} {t.lastName}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                            <h3 className="text-[13px] font-black text-slate-800 mb-3 flex items-center gap-2">
                                <Mail size={16} className="text-[#1a4484]" /> Contact Details
                            </h3>
                            <div className="space-y-2.5">
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[#1a4484]"><Mail size={12} /></div>
                                    <div>
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                                        <span className="block text-[12px] font-bold text-slate-800 truncate">{data.email}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Phone size={12} /></div>
                                    <div>
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
                                        <span className="block text-[12px] font-bold text-slate-800 font-mono">{data.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300">
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => setShowImportantInfo(!showImportantInfo)}
                        >
                            <h3 className="text-[13px] font-black text-slate-800 flex items-center gap-2">
                                <Info size={16} className="text-slate-400" /> Important Information & Policies
                            </h3>
                            {showImportantInfo ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                        </div>

                        {showImportantInfo && (
                            <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                                <div className="space-y-4 mt-3">
                                    <div>
                                        <strong className="text-[11px] font-bold text-slate-800 block mb-1">Check-in Time</strong>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">We request all travelers to arrive at the airport at least 3 (three) hours prior to international departures and 2 (two) hours prior to domestic departures.</p>
                                    </div>
                                    <div>
                                        <strong className="text-[11px] font-bold text-slate-800 block mb-1">Travel Documents</strong>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">Please ensure to carry a valid government-issued photo ID for each traveler. For infants, proof of DOB is mandatory. Failure to produce valid proof matching the reservation may result in refusal to check-in without refund.</p>
                                    </div>
                                    <div>
                                        <strong className="text-[11px] font-bold text-slate-800 block mb-1">Changes / Cancellation</strong>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">Before proceeding with a change or cancellation, we suggest you cross-check the policies applicable to the booking purchased. Ticket Changes or Cancellations would be processed as per fare terms and incur a penalty. Kindly ensure to call us at least 48 hours before travel.</p>
                                    </div>
                                    <div>
                                        <strong className="text-[11px] font-bold text-slate-800 block mb-1">No Show</strong>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">Please note if you do not travel the outbound segment of your flight (no-show), the airline automatically cancels your entire booking.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-5 sticky top-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <h3 className="text-[14px] font-black text-slate-800">Price Breakdown</h3>
                        </div>

                        <div className="p-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 flex justify-between items-center">
                                <div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{isUmrah ? 'Package' : 'DEPART'}</span>
                                    <span className="text-[11px] font-bold text-slate-800">{isUmrah ? '15 Days Premium' : `${flights[0].from.city} → ${flights[0].to.city}`}</span>
                                </div>
                                <span className="bg-slate-800 text-white text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest">Completed</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="font-semibold text-slate-600">Base Fare</span>
                                    <span className="font-bold text-slate-800">PKR {data.price.baseFare.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="font-semibold text-slate-600">Taxes & Surcharges</span>
                                    <span className="font-bold text-slate-800">PKR {data.price.taxes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="font-semibold text-slate-600">Booking Fee</span>
                                    <span className="font-bold text-slate-800">PKR {data.price.bookingFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[12px] pb-3 border-b border-slate-100">
                                    <span className="font-semibold text-slate-600">Processing Fee</span>
                                    <span className="font-bold text-[#1a4484]">Free</span>
                                </div>

                                <div className="pt-2 flex justify-between items-end">
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Total Paid</span>
                                        <span className="block text-[9px] font-medium text-slate-400 flex items-center gap-1"><CreditCard size={10} /> {data.price.paymentMethod}</span>
                                    </div>
                                    <span className="text-xl font-black text-[#1a4484] tracking-tight leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                        PKR {data.price.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-in fade-in slide-in-from-right-8 duration-500 delay-150">
                        <h3 className="text-[14px] font-black text-slate-800 mb-4 flex items-center gap-2">
                            <HelpCircle size={16} className="text-[#1a4484]" /> Need help?
                        </h3>

                        <div className="space-y-4">
                            <div className="flex gap-2.5 items-start">
                                <div className="bg-blue-50 p-2 rounded-full text-[#1a4484] shrink-0 mt-0.5"><Phone size={14} /></div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-800 mb-1">Call us 24/7</h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mb-1.5">We offer 24/7 support. Urdu support is available from 9 AM to 6 PM (GMT+5).</p>
                                    <a href="tel:+9221111172782" className="text-[11px] font-bold text-blue-600 hover:underline block">+92 21 111 172 782</a>
                                </div>
                            </div>

                            <div className="flex gap-2.5 items-start">
                                <div className="bg-[#25D366]/10 p-2 rounded-full text-[#25D366] shrink-0 mt-0.5"><MessageCircle size={14} /></div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-800 mb-1">WhatsApp Chat</h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mb-1.5">Connect with our support team instantly over WhatsApp.</p>
                                    <a href="https://wa.me/923047772782" className="text-[11px] font-bold text-[#25D366] hover:underline block">+92 304 7772782</a>
                                </div>
                            </div>

                            <div className="flex gap-2.5 items-start">
                                <div className="bg-slate-100 p-2 rounded-full text-slate-500 shrink-0 mt-0.5"><Mail size={14} /></div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-800 mb-1">Email Support</h4>
                                    <a href="mailto:support@domain.com" className="text-[11px] font-bold text-slate-600 hover:text-[#1a4484] hover:underline block">support@elitebooking.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ViewBookingPage() {
    const [selectedType, setSelectedType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectType = (type) => {
        setIsLoading(true);
        setSelectedType(type);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="bg-[#f0f2f5] min-h-screen font-sans selection:bg-blue-100 relative">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');
        body { font-family: 'Montserrat', sans-serif; }
      `}</style>

            {!selectedType ? (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-600/5 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="max-w-4xl w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Booking Dashboard Preview</h1>
                            <p className="text-slate-500 font-medium text-[15px] max-w-lg mx-auto leading-relaxed">
                                Select a booking type below to view the beautifully crafted dashboard.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <button
                                onClick={() => handleSelectType('ticket')}
                                className="group relative bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 hover:border-[#1a4484]/50 shadow-sm hover:shadow-xl transition-all duration-500 text-left flex flex-col items-start overflow-hidden active:scale-[0.98]"
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
                                <div className="w-16 h-16 bg-blue-50/80 text-[#1a4484] rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-blue-100 group-hover:-translate-y-2 transition-transform duration-500">
                                    <Plane size={32} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 relative z-10 tracking-tight">Flight Ticket</h3>
                                <p className="text-[14px] text-slate-500 font-medium relative z-10 leading-relaxed max-w-[280px]">Standard domestic or international flight booking view.</p>
                                <div className="mt-10 flex items-center gap-2 text-[#1a4484] font-extrabold text-[13px] uppercase tracking-widest relative z-10">
                                    Preview <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                                </div>
                            </button>

                            <button
                                onClick={() => handleSelectType('umrah')}
                                className="group relative bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 hover:border-[#1a4484]/50 shadow-sm hover:shadow-xl transition-all duration-500 text-left flex flex-col items-start overflow-hidden active:scale-[0.98]"
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
                                <div className="w-16 h-16 bg-blue-50/80 text-[#1a4484] rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-blue-100 group-hover:-translate-y-2 transition-transform duration-500">
                                    <Globe size={32} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 relative z-10 tracking-tight">Umrah Package</h3>
                                <p className="text-[14px] text-slate-500 font-medium relative z-10 leading-relaxed max-w-[280px]">Complete Umrah package itinerary including visa status.</p>
                                <div className="mt-10 flex items-center gap-2 text-[#1a4484] font-extrabold text-[13px] uppercase tracking-widest relative z-10">
                                    Preview <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            ) : isLoading ? (
                <div className="min-h-screen pt-4 md:pt-6">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
                        <DashboardSkeleton />
                    </div>
                </div>
            ) : (
                <BookingDashboard type={selectedType} onBack={() => setSelectedType(null)} />
            )}
        </div>
    );
}