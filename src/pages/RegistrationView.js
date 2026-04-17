import React, { useState, useEffect } from 'react';
import { 
  Building2, User, Mail, Phone, MapPin, Globe, 
  Send, CheckCircle2, ArrowLeft, Briefcase, 
  ShieldCheck, FileText, ChevronRight
} from 'lucide-react';

export const RegistrationView = ({ type = 'Agent', onBack }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    website: '',
    experience: '0-2 years',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Application Received!</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Thank you for your interest in joining the Saer.pk network. Our team will review your application and contact you within 2-3 business days.
          </p>
          <button 
            onClick={onBack}
            className="w-full bg-[#1a4484] hover:bg-[#123060] text-white font-bold h-14 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> <span className="leading-none">Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 selection:bg-blue-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Hero Header */}
      <div className="bg-[#0B1A28] text-white pt-12 pb-24 md:pt-20 md:pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[80px] pointer-events-none -ml-24 -mb-24"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <button 
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white font-bold text-[13px] transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm active:scale-95"
          >
            <ArrowLeft size={16} /> Back to home
          </button>
          
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-none">Global Network Partnership</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black mb-6 tracking-tight leading-tight">
            Register as a <span className="text-blue-400">{type}</span>
          </h1>
          <p className="text-slate-400 text-[14px] md:text-[16px] max-w-2xl mx-auto font-medium leading-relaxed">
            Expand your business horizons by partnering with Saer.pk. Gain access to exclusive inventory, competitive commissions, and a reliable booking platform.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 md:-mt-24 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Sidebar info */}
            <div className="lg:col-span-4 bg-slate-50 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-200">
              <h3 className="text-slate-900 font-heading font-extrabold text-xl mb-8 leading-tight">Why Partner with us?</h3>
              
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: "Trusted Brand", desc: "Collaborate with one of the most reliable names in travel." },
                  { icon: Briefcase, title: "Best Inventory", desc: "Exclusive access to premium Umrah packages & flights." },
                  { icon: FileText, title: "Fast Payouts", desc: "Transparent commission structures and timely payments." }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#1a4484] shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-slate-800 font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 p-6 bg-[#1a4484] rounded-2xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Need Assistance?</p>
                <div className="text-sm font-bold relative z-10">0300-0701506</div>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-8 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        type="text" 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Agency or Branch Name" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1a4484] focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Authorized Person</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Legal Name" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1a4484] focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contact@business.com" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1a4484] focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1a4484] focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Lahore, Karachi" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1a4484] focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Business Experience</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <select 
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1a4484] transition-all font-bold text-slate-800 text-sm appearance-none cursor-pointer"
                      >
                        <option>0-2 years</option>
                        <option>2-5 years</option>
                        <option>5-10 years</option>
                        <option>10+ years</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Additional Information (Optional)</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your current setup..." 
                    rows={4}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#1a4484] focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 text-sm resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-[#1a4484] hover:bg-[#123060] text-white font-bold h-14 rounded-2xl transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="leading-none">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span className="leading-none">Submit Application</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-slate-400 text-[11px] font-medium mt-4">
                    By submitting, you agree to Saer.pk's <span className="text-[#1a4484] hover:underline cursor-pointer">Partner Terms of Service</span>.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
