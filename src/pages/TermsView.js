import React from 'react';
import { ArrowLeft, FileText, CheckSquare, RefreshCw, Globe, HeartHandshake } from 'lucide-react';

export const TermsView = (props) => {
  const { setCurrentView } = props;
  return <div className="bg-[#f0f2f5] min-h-screen pb-16 animate-in fade-in duration-500">
                                <div className="bg-[#0B1A28] text-white py-4 shadow-md sticky top-[64px] md:top-[80px] z-40 border-t border-slate-700/50">
                                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                                      <div>
                                        <button onClick={() => setCurrentView('home')} className="text-blue-400 hover:text-white flex items-center gap-2 text-sm font-semibold mb-1 transition-colors">
                                          <ArrowLeft size={16} /> Back to Home
                                        </button>
                                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Terms & Conditions</h2>
                                      </div>
                                  </div>
                                </div>

                                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
                                  <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 w-full border border-slate-200">
                                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 text-center sm:text-left">
                                        <div className="w-14 h-14 bg-blue-50 text-[#1a4484] rounded-full flex items-center justify-center shrink-0"><FileText size={28} /></div>
                                        <div>
                                          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Terms & Conditions</h2>
                                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">Effective October 2024</p>
                                        </div>
                                      </div>
                                      
                                      <p className="text-slate-600 leading-relaxed mb-8 text-center sm:text-left">Please read these Terms and Conditions carefully before using the Saer.pk platform. By booking through our platform, you agree to be bound by these terms.</p>
                                      
                                      <div className="space-y-6">
                                        <section>
                                          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><CheckSquare size={20} className="text-[#1a4484]" /> 1. Booking Policies</h3>
                                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                                            <p className="text-slate-600 leading-relaxed text-sm">All bookings are subject to availability at the time of reservation. Prices are dynamically fetched and are subject to change without prior notice until the payment is fully confirmed and e-tickets are issued.</p>
                                          </div>
                                        </section>

                                        <section>
                                          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><RefreshCw size={20} className="text-[#1a4484]" /> 2. Cancellations & Refunds</h3>
                                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                                            <p className="text-slate-600 leading-relaxed text-sm">We proudly offer a <strong className="text-slate-800">48-Hour Refund Guarantee</strong> for certain packages. For standard flight bookings, airline-specific cancellation penalties and rules apply. Refund processing may take 7-14 business days depending on your payment method.</p>
                                          </div>
                                        </section>

                                        <section>
                                          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Globe size={20} className="text-[#1a4484]" /> 3. Travel Documentation</h3>
                                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                                            <p className="text-slate-600 leading-relaxed text-sm">It is the sole responsibility of the passenger to ensure they have the valid travel documents, including passports (with at least 6 months validity), visas, and required health certificates. Saer.pk is not liable for boarding denials due to incomplete documentation.</p>
                                          </div>
                                        </section>

                                        <section>
                                          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><HeartHandshake size={20} className="text-[#1a4484]" /> 4. Limitation of Liability</h3>
                                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                                            <p className="text-slate-600 leading-relaxed text-sm">Saer.pk acts as an intermediary between users and service providers (airlines, hotels). We are not liable for direct, indirect, or consequential damages resulting from service failures, delays, or cancellations initiated by the third-party providers.</p>
                                          </div>
                                        </section>
                                      </div>
                                  </div>
                                </div>
                              </div>;
};
