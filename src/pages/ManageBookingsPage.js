import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Ticket, Mail, Search, LogIn, HelpCircle } from 'lucide-react';

export default function ManageBookingPage({ onBack, onLogin, onFindBooking, onContactSupport }) {
  const [orderId, setOrderId] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId || !contactInfo) {
       alert("Please fill in both fields to search for your booking.");
       return;
    }
    // Call onFindBooking specifically for the search action
    if (onFindBooking) onFindBooking();
  };

  const handleLogin = () => {
    if (onLogin) onLogin();
  };

  return (
    <div className="bg-[#f4f7fb] min-h-screen flex flex-col font-sans relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@600;700;800&family=Roboto+Slab:wght@600;700;800&family=Montserrat:wght@700;800;900&display=swap');
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-[#0B1A28]/5 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Creative Transparent Top Bar for Back Button (Reduced Top Padding) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-4 relative z-50">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-2.5 px-1.5 py-1.5 pr-4 bg-white/40 hover:bg-white backdrop-blur-md border border-slate-200/60 hover:border-blue-200 rounded-full shadow-sm hover:shadow text-slate-600 hover:text-[#1a4484] text-[13px] font-bold transition-all duration-300 w-fit active:scale-95"
        >
          <div className="bg-white group-hover:bg-blue-50 p-1.5 rounded-full shadow-sm border border-slate-100 transition-colors text-slate-400 group-hover:text-[#1a4484]">
             <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Home
        </button>
      </div>

      {/* Main Content Area (Reduced Top Padding to close the gap) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-5 pb-20 flex justify-center items-start relative z-10">
        
        {/* Search Booking Card - ULTRA COMPACT & SLICK */}
        <div className="bg-white rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] border border-slate-100 p-5 md:p-6 w-full max-w-[380px] animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          <div className="flex flex-col items-center mb-5 text-center">
            <div className="w-10 h-10 bg-blue-50 text-[#1a4484] rounded-xl flex items-center justify-center mb-3 shadow-inner rotate-3">
              <Search size={18} strokeWidth={2.5} className="-rotate-3" />
            </div>
            <h2 className="text-[22px] font-extrabold text-slate-900 tracking-tight mb-1.5">
              Find your trip
            </h2>
            <p className="text-slate-500 font-medium text-[11px] leading-relaxed max-w-[240px]">
              Enter your order details below to view, modify, or download your e-tickets.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            
            {/* Order ID Input Group */}
            <div className="flex flex-col">
              <label htmlFor="orderId" className="text-[10px] font-bold text-slate-800 mb-1 block uppercase tracking-wider">
                Order ID
              </label>
              <div className="relative group">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4484] transition-colors" size={15} />
                <input 
                  type="text" 
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., 22002220000" 
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-[#1a4484] focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-900 font-bold text-[13px]"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 font-medium ml-1">
                The 11-digit number from your confirmation email.
              </p>
            </div>

            {/* Phone/Email Input Group */}
            <div className="flex flex-col">
              <label htmlFor="contactInfo" className="text-[10px] font-bold text-slate-800 mb-1 block uppercase tracking-wider">
                Email or Phone
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4484] transition-colors" size={15} />
                <input 
                  type="text" 
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g., mail@example.com" 
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-[#1a4484] focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-900 font-bold text-[13px]"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 font-medium ml-1">
                The contact info entered during booking.
              </p>
            </div>

            {/* Search Button */}
            <div className="mt-1">
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-1.5 bg-[#1a4484] hover:bg-[#123060] text-white font-bold py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(26,68,132,0.2)] hover:shadow-[0_6px_16px_rgba(26,68,132,0.3)] active:scale-[0.98] text-[13px]"
              >
                Find Booking <ArrowRight size={14} />
              </button>
            </div>

          </form>

          {/* Elegant Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-3 text-slate-400 text-[9px] font-extrabold uppercase tracking-widest">
              Or
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Login Section */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold py-2 rounded-xl transition-all active:scale-[0.98] text-[12px] group"
            >
              <LogIn size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" /> Log in to view orders
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-5 text-center flex items-center justify-center gap-1.5">
            <HelpCircle size={12} className="text-slate-400" />
            <p className="text-[11px] text-slate-500 font-medium">
              Having trouble? <button onClick={(e) => {
                e.preventDefault();
                if (onContactSupport) onContactSupport();
              }} className="text-[#1a4484] font-bold hover:underline">Contact Support</button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
