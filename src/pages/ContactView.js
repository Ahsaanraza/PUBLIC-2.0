import React from 'react';
import { ArrowLeft, Phone, MessageCircle, Mail, MapPin, Send } from 'lucide-react';

export const ContactView = (props) => {
  const { setCurrentView } = props;
  return <div className="bg-[#f0f2f5] min-h-screen pb-16 animate-in fade-in duration-500">
                              <div className="bg-[#0B1A28] text-white py-4 shadow-md sticky top-[64px] md:top-[80px] z-40 border-t border-slate-700/50">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                                    <div>
                                      <button onClick={() => setCurrentView('home')} className="text-blue-400 hover:text-white flex items-center gap-2 text-sm font-semibold mb-1 transition-colors">
                                        <ArrowLeft size={16} /> Back to Home
                                      </button>
                                      <h2 className="text-xl md:text-2xl font-bold tracking-tight">Contact Us</h2>
                                    </div>
                                </div>
                              </div>

                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 flex flex-col lg:flex-row gap-8 items-start">
                                {/* Left Side: Contact Information Cards */}
                                <div className="w-full lg:w-5/12 space-y-6">
                                  <div>
                                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Get in Touch</h3>
                                    <p className="text-slate-500 leading-relaxed">Have a question about your Umrah package or flight? Our dedicated support team is available 24/7 to assist you.</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                    {/* Phone Card */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#1a4484]/50 hover:shadow-md transition-all group">
                                      <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1a4484] flex items-center justify-center shrink-0 group-hover:bg-[#1a4484] group-hover:text-white transition-colors">
                                          <Phone size={20} />
                                      </div>
                                      <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Direct Helpline</p>
                                        <p className="text-lg font-black text-slate-800 group-hover:text-[#1a4484] transition-colors" style={{
                fontFamily: "'Montserrat', sans-serif"
              }}>0300-0701506</p>
                                      </div>
                                    </div>

                                    {/* WhatsApp Card */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-500/50 hover:shadow-md transition-all group">
                                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                          <MessageCircle size={20} />
                                      </div>
                                      <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                                        <p className="text-lg font-black text-slate-800 group-hover:text-emerald-600 transition-colors" style={{
                fontFamily: "'Montserrat', sans-serif"
              }}>0300-0701506</p>
                                      </div>
                                    </div>

                                    {/* Email Card */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#1a4484]/50 hover:shadow-md transition-all group">
                                      <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-[#1a4484] group-hover:text-white transition-colors">
                                          <Mail size={20} />
                                      </div>
                                      <div className="overflow-hidden">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Support</p>
                                        <p className="text-base font-bold text-slate-800 truncate group-hover:text-[#1a4484] transition-colors">support@saer.pk</p>
                                      </div>
                                    </div>

                                    {/* Location Card */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#1a4484]/50 hover:shadow-md transition-all group sm:col-span-2 lg:col-span-1">
                                      <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-[#1a4484] group-hover:text-white transition-colors">
                                          <MapPin size={20} />
                                      </div>
                                      <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Head Office</p>
                                        <p className="text-sm font-semibold text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">123 Business Avenue, Block 4, Gulberg III, Lahore, Pakistan</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side: Contact Form */}
                                <div className="flex-1 w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/80 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                    
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 relative z-10">Send us a Message</h3>
                                    
                                    <form className="space-y-5 relative z-10" onSubmit={e => e.preventDefault()}>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                                          <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:border-[#1a4484] outline-none transition-all placeholder:text-slate-400 font-semibold text-slate-800 text-sm" />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                          <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:border-[#1a4484] outline-none transition-all placeholder:text-slate-400 font-semibold text-slate-800 text-sm" />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Subject</label>
                                        <input type="text" placeholder="How can we help?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:border-[#1a4484] outline-none transition-all placeholder:text-slate-400 font-semibold text-slate-800 text-sm" />
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Message</label>
                                        <textarea rows="5" placeholder="Write your message here..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:border-[#1a4484] outline-none transition-all placeholder:text-slate-400 font-semibold text-slate-800 text-sm resize-none"></textarea>
                                      </div>
                                      <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1a4484] hover:bg-[#123060] text-white font-bold py-3.5 px-8 rounded-xl shadow-md active:scale-95 transition-all">
                                        Send Message <Send size={18} />
                                      </button>
                                    </form>
                                </div>
                              </div>
                            </div>;
};
