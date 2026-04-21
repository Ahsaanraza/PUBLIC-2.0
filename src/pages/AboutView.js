import React from 'react';
import { ArrowLeft, ShieldCheck, Star, Globe, Headset, Lock } from 'lucide-react';

export const AboutView = (props) => {
  const { setCurrentView } = props;
  return <div className="bg-[#f0f2f5] min-h-screen pb-16 animate-in fade-in duration-500">
                                <div className="bg-[#0B1A28] text-white py-4 shadow-md sticky top-[64px] md:top-[80px] z-40 border-t border-slate-700/50">
                                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                                      <div>
                                        <button onClick={() => setCurrentView('home')} className="text-blue-400 hover:text-white flex items-center gap-2 text-sm font-semibold mb-1 transition-colors">
                                          <ArrowLeft size={16} /> Back to Home
                                        </button>
                                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">About Us</h2>
                                      </div>
                                  </div>
                                </div>

                                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
                                  <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 w-full border border-slate-200">
                                      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight text-center">Your Trusted Partner in Spiritual Journeys</h2>
                                      <div className="space-y-6 text-slate-600 leading-relaxed">
                                        <p className="text-lg text-center max-w-2xl mx-auto">
                                          Welcome to <strong>Saer.pk</strong>, Pakistan's pioneering online platform dedicated entirely to Umrah packages and flights. We recognize that embarking on a spiritual journey is one of the most profound experiences of a lifetime, and we are here to make your booking process as serene and effortless as the journey itself.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 pt-8 border-t border-slate-100">
                                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 hover:shadow-md transition-all">
                                              <ShieldCheck size={32} className="text-[#1a4484] mb-4" />
                                              <h3 className="text-xl font-bold text-[#1a4484] mb-2">Our Mission</h3>
                                              <p className="text-sm leading-relaxed">To provide a transparent, accessible, and seamless booking experience for pilgrims, combining modern technology with the deepest respect for Islamic traditions.</p>
                                            </div>
                                            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 hover:shadow-md transition-all">
                                              <Star size={32} className="text-emerald-600 mb-4" />
                                              <h3 className="text-xl font-bold text-emerald-700 mb-2">Our Vision</h3>
                                              <p className="text-sm leading-relaxed">To be the most trusted and preferred digital travel companion for millions of Muslims across the globe seeking to fulfill their religious obligations.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4">
                                          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Why Choose Saer.pk?</h3>
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                              <div className="flex flex-col items-center text-center p-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                                  <Globe size={24} className="text-[#1a4484]" />
                                                </div>
                                                <h4 className="font-bold text-slate-900 mb-2">Unmatched Transparency</h4>
                                                <p className="text-xs text-slate-500">No hidden fees. What you see is exactly what you pay for your complete peace of mind.</p>
                                              </div>
                                              <div className="flex flex-col items-center text-center p-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                                  <Headset size={24} className="text-[#1a4484]" />
                                                </div>
                                                <h4 className="font-bold text-slate-900 mb-2">24/7 Support</h4>
                                                <p className="text-xs text-slate-500">Our dedicated team of travel experts is always on standby to guide you at every step.</p>
                                              </div>
                                              <div className="flex flex-col items-center text-center p-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                                  <Lock size={24} className="text-[#1a4484]" />
                                                </div>
                                                <h4 className="font-bold text-slate-900 mb-2">Secure Booking</h4>
                                                <p className="text-xs text-slate-500">We utilize state-of-the-art encryption to ensure your personal and payment details are strictly safe.</p>
                                              </div>
                                          </div>
                                        </div>
                                      </div>
                                  </div>
                                </div>
                              </div>;
};
