import React from 'react';
import { ArrowLeft, ShieldCheck, Database, Settings, Lock } from 'lucide-react';

export const PrivacyView = (props) => {
  const { setCurrentView } = props;
  return <div className="bg-[#f0f2f5] min-h-screen pb-16 animate-in fade-in duration-500">
                                <div className="bg-[#0B1A28] text-white py-4 shadow-md sticky top-[64px] md:top-[80px] z-40 border-t border-slate-700/50">
                                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                                      <div>
                                        <button onClick={() => setCurrentView('home')} className="text-blue-400 hover:text-white flex items-center gap-2 text-sm font-semibold mb-1 transition-colors">
                                          <ArrowLeft size={16} /> Back to Home
                                        </button>
                                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Privacy Policy</h2>
                                      </div>
                                  </div>
                                </div>

                                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
                                  <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 w-full border border-slate-200">
                                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 text-center sm:text-left">
                                        <div className="w-14 h-14 bg-blue-50 text-[#1a4484] rounded-full flex items-center justify-center shrink-0"><ShieldCheck size={28} /></div>
                                        <div>
                                          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h2>
                                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">Effective October 2024</p>
                                        </div>
                                      </div>
                                      
                                      <p className="text-slate-600 leading-relaxed mb-8 text-center sm:text-left">At Saer.pk, your privacy is our priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our booking services.</p>
                                      
                                      <div className="space-y-6">
                                        <section>
                                          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Database size={20} className="text-[#1a4484]" /> 1. Information We Collect</h3>
                                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                                            <p className="text-slate-600 leading-relaxed mb-4 text-sm">We collect personal information that you provide to us when registering, booking a flight or package, or contacting our support team. This includes:</p>
                                            <ul className="list-disc pl-5 text-slate-600 space-y-2 text-sm font-medium">
                                              <li>Name, email address, and phone number.</li>
                                              <li>Passport and visa details required for travel.</li>
                                              <li>Payment and billing information (securely processed via third-party gateways).</li>
                                            </ul>
                                          </div>
                                        </section>

                                        <section>
                                          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Settings size={20} className="text-[#1a4484]" /> 2. How We Use Your Information</h3>
                                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                                            <p className="text-slate-600 leading-relaxed mb-4 text-sm">The information we collect is used to:</p>
                                            <ul className="list-disc pl-5 text-slate-600 space-y-2 text-sm font-medium">
                                              <li>Process and manage your bookings and payments.</li>
                                              <li>Send you booking confirmations, updates, and e-tickets.</li>
                                              <li>Respond to your customer service requests.</li>
                                              <li>Improve our website functionality and user experience.</li>
                                            </ul>
                                          </div>
                                        </section>

                                        <section>
                                          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Lock size={20} className="text-[#1a4484]" /> 3. Data Security</h3>
                                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                                            <p className="text-slate-600 leading-relaxed text-sm">We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
                                          </div>
                                        </section>
                                      </div>
                                  </div>
                                </div>
                              </div>;
};
