import React, { useState } from 'react';
import { 
  ChevronDown, Trash2, UserPlus, Gift, CheckCircle2, ArrowLeft, 
  User, Mail, Globe, Ticket, Check, ShieldCheck,
  Baby, UserCircle, Activity, Edit3, ChevronUp
} from 'lucide-react';

// --- Static Data ---
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS_DOB = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const YEARS_EXPIRY = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i);
const NATIONALITIES = ['Pakistan', 'United Arab Emirates', 'United Kingdom', 'United States', 'Saudi Arabia', 'Canada'];
const TRAVELER_TYPES = ['Adult', 'Child', 'Infant'];

// --- Smart Collapsible Traveler Form ---
const TravelerForm = ({ traveler, onChange, onRemove, index, isPrimary = false }) => {
  // If the traveler has data (like a passport number or name), collapse it by default. 
  // If it's empty (new companion), keep it expanded.
  const [isExpanded, setIsExpanded] = useState(() => {
    return !(traveler.givenName || traveler.passportNo);
  });

  const handleChange = (field, value) => onChange(field, value, index);

  return (
    <div className={`relative bg-white rounded-2xl transition-all duration-300 overflow-hidden ${isPrimary ? 'border-2 border-[#1a4484] shadow-md' : 'border border-slate-200 shadow-sm hover:border-slate-300'}`}>
      
      {isExpanded ? (
        // ==========================================
        // EXPANDED VIEW (EDIT MODE)
        // ==========================================
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`flex justify-between items-center px-5 py-4 border-b ${isPrimary ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPrimary ? 'bg-[#1a4484] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500'}`}>
                {traveler.travelerType === 'Child' || traveler.travelerType === 'Infant' ? <Baby size={16} /> : <User size={16} />}
              </div>
              <h4 className="text-[14px] font-black text-slate-800 flex items-center gap-2">
                {traveler.nickname || (isPrimary ? 'My Account' : `Traveler ${index + 1}`)}
                {isPrimary && <span className="bg-[#1a4484] text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-bold shadow-sm">Primary</span>}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {!isPrimary && (
                <button onClick={() => onRemove(index)} className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-md transition-all" title="Remove Traveler">
                  <Trash2 size={16} />
                </button>
              )}
              {/* Only allow collapsing if there is at least a name */}
              {traveler.givenName && (
                <button onClick={() => setIsExpanded(false)} className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-all flex items-center gap-1 text-[11px] font-bold pr-3">
                  <ChevronUp size={16} /> Collapse
                </button>
              )}
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Row 1: Nickname & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Profile Nickname</label>
                <div className="relative group">
                  <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4484] transition-colors" size={18} />
                  <input 
                    type="text" value={traveler.nickname} onChange={e => handleChange('nickname', e.target.value)}
                    placeholder="e.g. My Brother" 
                    className="w-full h-11 pl-10 pr-3 bg-white border border-slate-300 rounded-xl focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 outline-none text-[14px] font-bold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Traveler Type</label>
                <div className="relative">
                  <select 
                    disabled={isPrimary} value={traveler.travelerType} onChange={e => handleChange('travelerType', e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-slate-300 rounded-xl focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 outline-none text-[14px] font-bold text-slate-800 appearance-none disabled:bg-slate-50 disabled:text-slate-400 transition-all shadow-sm"
                  >
                    {TRAVELER_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Full Name <span className="text-slate-400 normal-case font-medium">(As per Passport)</span></label>
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <div className="relative w-full sm:w-28 shrink-0">
                  <select value={traveler.title} onChange={e => handleChange('title', e.target.value)} className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 outline-none text-[14px] font-bold text-slate-800 appearance-none shadow-sm">
                    <option value="Mr">Mr</option><option value="Mrs">Mrs</option><option value="Ms">Ms</option><option value="Mstr">Mstr</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <input type="text" value={traveler.givenName} onChange={e => handleChange('givenName', e.target.value)} placeholder="Given Name" className="flex-1 min-w-0 h-11 px-4 bg-white border border-slate-300 rounded-xl focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 outline-none text-[14px] font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-300 shadow-sm" />
                <input type="text" value={traveler.surname} onChange={e => handleChange('surname', e.target.value)} placeholder="Surname" className="flex-1 min-w-0 h-11 px-4 bg-white border border-slate-300 rounded-xl focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 outline-none text-[14px] font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-300 shadow-sm" />
              </div>
            </div>

            {/* Row 3: Passport Details & Nationality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Passport Number</label>
                <div className="relative group">
                  <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4484] transition-colors" size={18} />
                  <input type="text" value={traveler.passportNo} onChange={e => handleChange('passportNo', e.target.value)} placeholder="e.g. PK123456" className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-xl focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 outline-none text-[14px] font-black text-slate-800 uppercase placeholder:font-medium placeholder:normal-case placeholder:text-slate-300 shadow-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Nationality</label>
                <div className="relative group">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4484] transition-colors" size={18} />
                  <select value={traveler.nationality} onChange={e => handleChange('nationality', e.target.value)} className="w-full h-11 pl-10 pr-10 bg-white border border-slate-300 rounded-xl focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 outline-none text-[14px] font-bold text-slate-800 appearance-none shadow-sm">
                    {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 4: Dates (DOB & Expiry) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5 block">Date of Birth</label>
                <div className="flex gap-2">
                  <select value={traveler.dobDate} onChange={e => handleChange('dobDate', e.target.value)} className="flex-[0.8] h-11 px-2 bg-white border border-slate-300 rounded-xl text-[13px] font-bold text-slate-800 outline-none focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 appearance-none text-center shadow-sm">
                    <option value="" disabled>DD</option>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <select value={traveler.dobMonth} onChange={e => handleChange('dobMonth', e.target.value)} className="flex-1 h-11 px-2 bg-white border border-slate-300 rounded-xl text-[13px] font-bold text-slate-800 outline-none focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 appearance-none text-center shadow-sm">
                    <option value="" disabled>MM</option>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select value={traveler.dobYear} onChange={e => handleChange('dobYear', e.target.value)} className="flex-[1.2] h-11 px-2 bg-white border border-slate-300 rounded-xl text-[13px] font-bold text-slate-800 outline-none focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 appearance-none text-center shadow-sm">
                    <option value="" disabled>YYYY</option>
                    {YEARS_DOB.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5 block">Passport Expiry</label>
                <div className="flex gap-2">
                  <select value={traveler.expDate} onChange={e => handleChange('expDate', e.target.value)} className="flex-[0.8] h-11 px-2 bg-white border border-slate-300 rounded-xl text-[13px] font-bold text-slate-800 outline-none focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 appearance-none text-center shadow-sm">
                    <option value="" disabled>DD</option>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <select value={traveler.expMonth} onChange={e => handleChange('expMonth', e.target.value)} className="flex-1 h-11 px-2 bg-white border border-slate-300 rounded-xl text-[13px] font-bold text-slate-800 outline-none focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 appearance-none text-center shadow-sm">
                    <option value="" disabled>MM</option>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select value={traveler.expYear} onChange={e => handleChange('expYear', e.target.value)} className="flex-[1.2] h-11 px-2 bg-white border border-slate-300 rounded-xl text-[13px] font-bold text-slate-800 outline-none focus:border-[#1a4484] focus:ring-2 focus:ring-blue-50 appearance-none text-center shadow-sm">
                    <option value="" disabled>YYYY</option>
                    {YEARS_EXPIRY.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Done Button inside Expanded View */}
            <div className="flex justify-end pt-2 border-t border-slate-100 mt-2">
              <button 
                onClick={() => {
                  if (traveler.givenName) setIsExpanded(false);
                  else alert("Please enter at least a Given Name before collapsing.");
                }} 
                className="px-6 py-2.5 bg-[#1a4484] hover:bg-[#123060] text-white text-[13px] font-bold rounded-xl shadow-md active:scale-95 transition-all"
              >
                 Done Editing
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // COLLAPSED VIEW (SUMMARY MODE)
        // ==========================================
        <div 
          className="flex justify-between items-center p-4 md:p-5 cursor-pointer hover:bg-slate-50 transition-colors" 
          onClick={() => setIsExpanded(true)}
        >
           <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isPrimary ? 'bg-blue-50 border-blue-200 text-[#1a4484]' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
               {traveler.travelerType === 'Child' || traveler.travelerType === 'Infant' ? <Baby size={24} /> : <User size={24} />}
             </div>
             <div>
               <div className="flex items-center gap-2">
                 <h4 className="text-[16px] font-black text-slate-900 leading-none">
                   {traveler.nickname || traveler.givenName || (isPrimary ? 'My Account' : `Traveler ${index + 1}`)}
                 </h4>
                 {isPrimary && <span className="bg-[#1a4484] text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-bold shadow-sm">Primary</span>}
               </div>
               <div className="flex items-center gap-2 mt-2">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${traveler.travelerType === 'Adult' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-[#1a4484]'}`}>
                   {traveler.travelerType}
                 </span>
                 {traveler.passportNo && (
                   <>
                     <span className="text-slate-300">•</span>
                     <span className="text-[11px] text-slate-500 font-medium">Passport: <span className="font-bold text-slate-700">***{traveler.passportNo.slice(-4)}</span></span>
                   </>
                 )}
               </div>
             </div>
           </div>
           
           <div className="flex items-center gap-2">
             {!isPrimary && (
                <button onClick={(e) => { e.stopPropagation(); onRemove(index); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                  <Trash2 size={18} />
                </button>
             )}
             <button onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }} className="p-2 text-[#1a4484] bg-blue-50 hover:bg-blue-100 rounded-full transition-all">
                <Edit3 size={16} />
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const defaultTraveler = {
    nickname: '', travelerType: 'Adult', title: 'Mr', givenName: '', surname: '', 
    dobDate: '', dobMonth: '', dobYear: '', passportNo: '', expDate: '', expMonth: '', expYear: '', nationality: 'Pakistan'
  };

  const [contact, setContact] = useState({ phone: '3000701506', email: 'ahmed.khan@outlook.com', isSubscribed: true });
  const [inviterCode, setInviterCode] = useState('');
  const [isInviterSaved, setIsInviterSaved] = useState(false);

  // Example: Primary User pre-filled
  const [primary, setPrimary] = useState({
    nickname: 'Me', travelerType: 'Adult', title: 'Mr', givenName: 'Ahmed', surname: 'Khan',
    dobDate: '12', dobMonth: 'Oct', dobYear: '1990', passportNo: 'PK901238', expDate: '20', expMonth: 'Jan', expYear: '2032', nationality: 'Pakistan'
  });

  // Example: Companions pre-filled
  const [companions, setCompanions] = useState([
    { id: 1, nickname: 'Wife', travelerType: 'Adult', title: 'Mrs', givenName: 'Sarah', surname: 'Ahmed', dobDate: '15', dobMonth: 'Feb', dobYear: '1992', passportNo: 'PK881234', expDate: '10', expMonth: 'Dec', expYear: '2030', nationality: 'Pakistan' },
    { id: 2, nickname: 'My Son', travelerType: 'Child', title: 'Mstr', givenName: 'Zain', surname: 'Ahmed', dobDate: '05', dobMonth: 'Mar', dobYear: '2019', passportNo: 'PK112233', expDate: '20', expMonth: 'Jun', expYear: '2028', nationality: 'Pakistan' }
  ]);

  const handlePrimaryChange = (f, v) => setPrimary({...primary, [f]: v});
  const handleCompanionChange = (f, v, i) => {
    const updated = [...companions];
    updated[i] = {...updated[i], [f]: v};
    setCompanions(updated);
  };
  const addCompanion = () => setCompanions([...companions, { ...defaultTraveler, id: Date.now() }]);
  const removeCompanion = (i) => setCompanions(companions.filter((_, idx) => idx !== i));

  const handleSaveInviter = (e) => {
    e.preventDefault();
    if (inviterCode.trim() !== '') setIsInviterSaved(true);
  };

  const handleSubmitProfile = () => {
    alert("Profile and all traveler details updated securely!");
  };

  return (
    <div className="bg-[#f0f3f8] min-h-screen font-sans pb-28 selection:bg-blue-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, button, input, select { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* --- DASHBOARD HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-sm px-4">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-500 active:scale-95">
               <ArrowLeft size={18} />
             </button>
             <h1 className="text-[16px] font-black text-slate-800 tracking-tight">Account & Travel Group</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-[12px] font-black text-slate-800 leading-none">{primary.givenName} {primary.surname}</span>
               <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 flex items-center gap-0.5"><CheckCircle2 size={10}/> Verified</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shadow-sm">
               <User size={14} strokeWidth={2.5} />
             </div>
          </div>
        </div>
      </header>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ==================================================== */}
          {/* LEFT COLUMN: FORMS (Contact, Primary, Companions)  */}
          {/* ==================================================== */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Contact Information */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
                 <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0 border border-slate-200"><Mail size={16} /></div>
                 <div>
                   <h3 className="text-[14px] font-black text-slate-800 leading-none mb-1">Contact Information</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">For Tickets & Alerts</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Phone Number</label>
                    <div className="flex h-10 w-full bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:border-[#1a4484] transition-all shadow-sm">
                      <div className="flex items-center gap-1 px-3 bg-slate-50 border-r border-slate-200 font-black text-slate-600 text-[12px]">PK <span className="text-slate-400">+92</span></div>
                      <input type="tel" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value.replace(/[^0-9]/g, '')})} className="flex-1 px-3 outline-none text-[13px] font-bold text-slate-800 bg-transparent" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4484]" size={16} />
                       <input type="email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} className="w-full h-10 pl-9 pr-3 bg-white border border-slate-300 rounded-lg focus:border-[#1a4484] outline-none text-[13px] font-bold text-slate-800 transition-all shadow-sm" />
                    </div>
                  </div>
               </div>
               <label className="flex items-center gap-2.5 cursor-pointer w-fit group mt-2">
                  <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-all ${contact.isSubscribed ? 'bg-[#1a4484] border-[#1a4484]' : 'bg-white border-slate-300 group-hover:border-[#1a4484]'}`}>
                    {contact.isSubscribed && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <input type="checkbox" className="hidden" checked={contact.isSubscribed} onChange={() => setContact({...contact, isSubscribed: !contact.isSubscribed})} />
                  <span className="text-[12px] font-bold text-slate-700 select-none">Send me special spiritual deals & package alerts</span>
               </label>
            </section>

            {/* 2. Unified Travel Group Timeline */}
            <section className="pt-2">
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1 mb-6">
                 <div>
                   <h3 className="text-[18px] font-black text-slate-800 tracking-tight">Travel Group</h3>
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Manage your saved companions</p>
                 </div>
               </div>
               
               {/* Timeline Container */}
               <div className="relative space-y-6">
                 {/* The vertical connecting line */}
                 <div className="absolute left-[19px] top-6 bottom-10 w-0.5 bg-slate-200 z-0"></div>

                 {/* Primary Traveler */}
                 <div className="relative pl-12">
                   <div className="absolute left-[13px] top-7 w-3.5 h-3.5 bg-[#1a4484] rounded-full ring-4 ring-[#f0f3f8] z-10 shadow-sm"></div>
                   <TravelerForm traveler={primary} onChange={handlePrimaryChange} isPrimary={true} />
                 </div>

                 {/* Saved Companions */}
                 {companions.map((companion, idx) => (
                   <div key={companion.id} className="relative pl-12">
                     <div className="absolute left-[13px] top-7 w-3.5 h-3.5 bg-slate-300 rounded-full ring-4 ring-[#f0f3f8] z-10"></div>
                     <TravelerForm 
                      traveler={companion} 
                      index={idx} 
                      onChange={handleCompanionChange} 
                      onRemove={removeCompanion} 
                     />
                   </div>
                 ))}

                 {/* Add Companion Dropzone */}
                 <div className="relative pl-12">
                   <div className="absolute left-[13px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-slate-200 rounded-full ring-4 ring-[#f0f3f8] z-10"></div>
                   <button 
                     onClick={addCompanion} 
                     className="w-full bg-white border-2 border-dashed border-slate-300 hover:border-[#1a4484] hover:bg-blue-50 text-slate-500 hover:text-[#1a4484] rounded-2xl p-5 flex items-center justify-center transition-all group shadow-sm"
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform group-hover:bg-white group-hover:border-[#1a4484]/30">
                         <UserPlus size={18} className="text-slate-500 group-hover:text-[#1a4484]" />
                       </div>
                       <div className="text-left">
                         <span className="text-[14px] font-black block leading-none mb-1 text-slate-700 group-hover:text-[#1a4484] transition-colors">Add Another Traveler</span>
                         <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Save for quick booking</span>
                       </div>
                     </div>
                   </button>
                 </div>

               </div>
            </section>

          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: WIDGETS (Referral & Summary)         */}
          {/* ==================================================== */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[90px]">
            
            {/* 1. Referral Widget (Neutral & Sleek) */}
            <div className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-sm border border-slate-200">
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                   <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                     <Gift size={16} className="text-slate-600" />
                   </div>
                   <div>
                     <h3 className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-1">Promo Code</h3>
                     <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Apply for discounts</p>
                   </div>
                 </div>
                 
                 {isInviterSaved ? (
                   <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 mt-2 shadow-inner animate-in zoom-in">
                     <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                     <div className="min-w-0">
                       <p className="text-slate-800 font-bold text-[12px] mb-0.5 leading-none">Discount Active</p>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">{inviterCode}</p>
                     </div>
                   </div>
                 ) : (
                   <div className="flex items-center gap-2 mt-2">
                     <input 
                       type="text" value={inviterCode} onChange={e => setInviterCode(e.target.value)}
                       placeholder="Enter Code" 
                       className="flex-1 h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1a4484] transition-all outline-none font-black text-[13px] uppercase tracking-wider"
                     />
                     <button 
                        onClick={handleSaveInviter} disabled={!inviterCode.trim()}
                        className="h-11 px-5 bg-[#1a4484] text-white hover:bg-[#123060] disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 font-black rounded-xl transition-all active:scale-95 text-[11px] uppercase tracking-widest shadow-sm"
                     >
                       Apply
                     </button>
                   </div>
                 )}
               </div>
            </div>

            {/* 2. Dashboard Summary Widget */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                 <Activity size={16} className="text-slate-400"/> Setup Progress
               </h4>
               <div className="flex items-center gap-5">
                 <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * 0.85)} className="text-[#1a4484] transition-all duration-1000" />
                    </svg>
                    <span className="absolute text-[13px] font-black text-slate-800">85%</span>
                 </div>
                 <div className="flex-1 space-y-2.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                       <span className="text-slate-500">Group Size</span>
                       <span className="text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shadow-sm">{companions.length + 1}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold">
                       <span className="text-slate-500">Promo Code</span>
                       <span className={isInviterSaved ? 'text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded shadow-sm' : 'text-slate-400'}>{isInviterSaved ? 'Active' : 'None'}</span>
                    </div>
                 </div>
               </div>
               
               {/* Removed the duplicate Save Changes button from here!
                 Now it strictly relies on the sticky bottom bar for saving to avoid confusion.
               */}
            </div>
            
          </div>
        </div>
      </main>

      {/* --- STICKY BOTTOM SECURITY & SAVE BAR --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 md:p-4 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
               <ShieldCheck size={18} strokeWidth={2.5} />
             </div>
             <p className="text-[11px] text-slate-500 font-bold leading-tight max-w-[280px] hidden sm:block uppercase tracking-wider">
               Data is secured with <span className="text-slate-700">AES-256 encryption.</span>
             </p>
             <p className="text-[11px] text-slate-500 font-bold leading-tight sm:hidden uppercase tracking-wider">
               Secure Connection
             </p>
           </div>
           <button 
             onClick={handleSubmitProfile}
             className="bg-[#1a4484] hover:bg-[#123060] text-white font-black py-3 px-8 rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all text-[12px] uppercase tracking-widest flex justify-center items-center gap-2"
           >
             Save Profile <Check size={16} strokeWidth={3} />
           </button>
        </div>
      </div>
      
    </div>
  );
}
