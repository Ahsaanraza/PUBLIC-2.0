import React from 'react';
import { ArrowLeft, Building2, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { branchLocations } from '../data/constants';

export const BranchesView = (props) => {
  const { setCurrentView } = props;
  return <div className="bg-[#f0f2f5] min-h-screen pb-16 animate-in fade-in duration-500">
                              <div className="bg-[#0B1A28] text-white py-4 shadow-md sticky top-[64px] md:top-[80px] z-40 border-t border-slate-700/50">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                                    <div>
                                      <button onClick={() => setCurrentView('home')} className="text-blue-400 hover:text-white flex items-center gap-2 text-sm font-semibold mb-1 transition-colors">
                                        <ArrowLeft size={16} /> Back to Home
                                      </button>
                                      <h2 className="text-xl md:text-2xl font-bold tracking-tight">Our Branches</h2>
                                    </div>
                                </div>
                              </div>

                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
                                <div className="text-center max-w-2xl mx-auto mb-10">
                                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Visit a Saer.pk Branch Near You</h3>
                                  <p className="text-slate-500">Our dedicated teams across Pakistan are ready to assist you in planning your perfect spiritual journey.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {branchLocations.map((branch, idx) => <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-[#1a4484]/30 transition-all group">
                                      <div className="w-12 h-12 bg-blue-50 text-[#1a4484] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#1a4484] group-hover:text-white transition-colors">
                                        <Building2 size={24} />
                                      </div>
                                      <h4 className="text-lg font-bold text-slate-900 mb-4">{branch.city}</h4>
                                      <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                          <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                                          <p className="text-sm text-slate-600 leading-relaxed">{branch.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <Phone size={16} className="text-slate-400 shrink-0" />
                                          <p className="text-sm text-slate-600 font-semibold" style={{
                fontFamily: "'Montserrat', sans-serif"
              }}>{branch.phone}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <Mail size={16} className="text-slate-400 shrink-0" />
                                          <p className="text-sm text-slate-600">{branch.email}</p>
                                        </div>
                                      </div>
                                      <button className="w-full mt-6 bg-slate-50 hover:bg-[#1a4484] text-slate-700 hover:text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                                        Get Directions <ChevronRight size={16} />
                                      </button>
                                    </div>)}
                                </div>
                              </div>
                            </div>;
};
