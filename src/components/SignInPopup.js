import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Mail, Smartphone, Edit2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SignInPopup({ isOpen, onClose }) {
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'success'
  const [loginMethod, setLoginMethod] = useState('mobile'); // 'mobile' | 'email'
  const [inputValue, setInputValue] = useState('');
  
  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  // Account Setup State

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setInputValue('');
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(60);
      setLoginMethod('mobile');
    }
  }, [isOpen]);

  // Timer logic for OTP
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  // Validation logic
  const isInputValid = loginMethod === 'mobile'
    ? inputValue.replace(/[^0-9]/g, '').length >= 10
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

  const isOtpValid = otp.every(digit => digit !== '');

  const handleMethodChange = (method) => {
    setLoginMethod(method);
    setInputValue('');
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (isInputValid) {
      setStep('otp');
      setTimeLeft(60);
      setOtp(['', '', '', '', '', '']);
      // Focus first OTP input after a short delay for render
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Auto-focus previous input on backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setTimeLeft(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (isOtpValid) {
      // Transition to the final success screen
      setStep('success');
    }
  };

  if (!isOpen) return null;

  const displayIdentifier = loginMethod === 'mobile' ? `+92 ${inputValue}` : inputValue;
  const changeText = loginMethod === 'mobile' ? 'Change number' : 'Change email';

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
      onClick={() => onClose()}
    >
      <div 
        className="bg-white w-full max-w-[340px] rounded-[1.25rem] shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => onClose()} 
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors z-20 active:scale-90"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        <div className="px-6 pt-7 pb-5 flex flex-col relative">
          
          {/* --- STEP 1: INPUT --- */}
          {step === 'input' && (
            <div className="animate-in slide-in-from-left-4 fade-in duration-300">
              <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight mb-1 pr-6 leading-tight">
                Sign in or create an account
              </h2>
              <p className="text-[12px] text-slate-500 font-medium mb-5">
                Select your preferred method to continue.
              </p>

              <form onSubmit={handleInitialSubmit} className="flex flex-col gap-4">
                
                {/* Animated Segmented Control */}
                <div className="flex bg-slate-100 p-1 rounded-lg relative">
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out ${
                      loginMethod === 'mobile' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
                    }`}
                  ></div>
                  
                  <button
                    type="button"
                    onClick={() => handleMethodChange('mobile')}
                    className={`flex-1 py-1.5 text-[12px] font-bold z-10 transition-colors flex items-center justify-center gap-1.5 ${
                      loginMethod === 'mobile' ? 'text-[#1a4484]' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Smartphone size={14} className={loginMethod === 'mobile' ? 'text-[#1a4484]' : 'text-slate-400'} />
                    Mobile
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleMethodChange('email')}
                    className={`flex-1 py-1.5 text-[12px] font-bold z-10 transition-colors flex items-center justify-center gap-1.5 ${
                      loginMethod === 'email' ? 'text-[#1a4484]' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Mail size={14} className={loginMethod === 'email' ? 'text-[#1a4484]' : 'text-slate-400'} />
                    Email
                  </button>
                </div>

                {/* Dynamic Input Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-0.5">
                    {loginMethod === 'mobile' ? 'Mobile Number' : 'Email Address'}
                  </label>
                  
                  {loginMethod === 'mobile' ? (
                    <div className="flex w-full bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:border-[#1a4484] focus-within:ring-[2px] focus-within:ring-blue-50 transition-all h-[42px] shadow-sm">
                      <div className="flex items-center gap-1.5 pl-3 pr-2 border-r border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <span className="text-[13px] font-extrabold text-slate-900">PK</span>
                        <span className="text-[12px] font-semibold text-slate-500">+92</span>
                        <ChevronDown size={12} className="text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        value={inputValue}
                        autoFocus
                        onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="300 0000000"
                        maxLength={10}
                        className="flex-1 w-full px-3 py-2 outline-none text-slate-900 text-[16px] font-bold placeholder:font-medium placeholder:text-slate-300 tracking-wider"
                      />
                    </div>
                  ) : (
                    <div className="flex w-full bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:border-[#1a4484] focus-within:ring-[2px] focus-within:ring-blue-50 transition-all h-[42px] shadow-sm">
                      <div className="flex items-center justify-center pl-3 pr-2.5 text-slate-400 bg-slate-50 border-r border-slate-200">
                         <Mail size={14} />
                      </div>
                      <input
                        type="email"
                        value={inputValue}
                        autoFocus
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="name@example.com"
                        className="flex-1 w-full px-3 py-2 outline-none text-slate-900 text-[16px] font-bold placeholder:font-medium placeholder:text-slate-300"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isInputValid}
                  className={`w-full py-2.5 mt-1 rounded-lg font-bold text-[13px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
                    isInputValid
                      ? 'bg-[#1a4484] hover:bg-[#123060] text-white active:scale-[0.98]'
                      : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* --- STEP 2: OTP VERIFICATION --- */}
          {step === 'otp' && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight mb-1 pr-6 leading-tight flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#1a4484]" /> Verify it's you
              </h2>
              <p className="text-[12px] text-slate-500 font-medium mb-5">
                Enter the 6-digit OTP we've sent to your {loginMethod}.
              </p>

              {/* Identifier & Change Button */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5 shadow-inner">
                 <span className="font-bold text-slate-800 text-[13px] truncate pr-2">
                   {displayIdentifier}
                 </span>
                 <button 
                   onClick={() => setStep('input')}
                   className="text-[#1a4484] text-[11px] font-bold hover:underline whitespace-nowrap flex items-center gap-1"
                 >
                   <Edit2 size={10} /> {changeText}
                 </button>
              </div>

              <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-0.5">
                       OTP Code
                     </label>
                     <span className={`text-[11px] font-bold ${timeLeft === 0 ? 'text-red-500' : 'text-slate-500'}`}>
                       00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                     </span>
                  </div>
                  
                  {/* OTP Inputs */}
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-10 h-12 text-center text-[16px] font-extrabold text-[#1a4484] bg-white border border-slate-300 rounded-lg shadow-sm focus:border-[#1a4484] focus:ring-[2px] focus:ring-blue-50 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center mt-1 mb-2">
                  {timeLeft === 0 ? (
                    <button 
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#1a4484] text-[12px] font-bold hover:underline"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Didn't receive the code? Wait for timer.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isOtpValid}
                  className={`w-full py-2.5 rounded-lg font-bold text-[13px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
                    isOtpValid
                      ? 'bg-[#1a4484] hover:bg-[#123060] text-white active:scale-[0.98]'
                      : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  Verify & Continue
                </button>
              </form>
            </div>
          )}

          {/* --- STEP 3: SUCCESS (ACCOUNT VERIFIED) --- */}
          {step === 'success' && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex flex-col pt-1">
              
              {/* Title */}
              <div className="flex items-center gap-2 mb-4">
                 <h2 className="text-[17px] font-bold text-slate-900 tracking-tight leading-tight">
                   Account verified successfully
                 </h2>
                 <CheckCircle2 size={18} className="text-white fill-[#1a4484]" />
              </div>

              {/* Subtitle */}
              <h3 className="text-[15px] text-slate-800 font-medium mb-3">
                 Get started – set up your account:
              </h3>

              {/* Benefits List */}
              <div className="flex flex-col gap-1 mb-6">
                 <p className="text-[12px] text-slate-500 font-medium">Book more efficiently, how?</p>
                 <p className="text-[12px] text-slate-500 font-medium">Save your info for seamless future use.</p>
                 <p className="text-[12px] text-slate-500 font-medium">Add extra travellers anytime.</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mb-6">
                 <button 
                   onClick={() => onClose()} 
                   className="flex-1 py-2 rounded-md font-bold text-[13px] border border-[#1a4484] text-[#1a4484] hover:bg-blue-50 transition-colors"
                 >
                    Later
                 </button>
                 <button 
                   onClick={() => onClose('profile')} 
                   className="flex-1 py-2 rounded-md font-bold text-[13px] bg-[#1a4484] text-white hover:bg-[#123060] transition-colors shadow-sm"
                 >
                    Now
                 </button>
              </div>

              {/* App Promo Box */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white relative overflow-hidden shadow-sm flex flex-col gap-2">
                 <h4 className="text-[13px] font-bold text-[#1a4484]">Time-saving bookings via our app.</h4>
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed pr-2">
                   Unlock exclusive offers and streamline bookings with our app.
                 </p>
                 
                 <div className="flex items-center justify-between gap-3 mt-2">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://saer.pk/download" 
                      alt="QR" 
                      className="w-[46px] h-[46px] object-contain shrink-0" 
                    />
                    <span className="text-[10px] font-extrabold text-[#1a4484] flex-1 pr-2 leading-tight">
                      Scan QR for quick access.
                    </span>
                    
                    {/* Custom Mini Phone Mockup */}
                    <div className="w-[38px] h-[52px] bg-[#1a4484] rounded-[6px] p-[3px] relative flex flex-col items-center shrink-0 shadow-sm">
                       <div className="w-full h-full bg-white rounded-sm flex items-center justify-center relative">
                           <div className="w-2.5 h-[1.5px] bg-slate-200 rounded-full absolute top-[3px]"></div>
                           <span className="text-[#1a4484] font-black text-[6px] mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>saer.pk</span>
                       </div>
                    </div>
                 </div>
              </div>
              
            </div>
          )}

          {/* Legal Footer (Hidden on success) */}
          {step !== 'success' && (
            <p className="text-center text-[10px] text-slate-500 mt-5 leading-relaxed max-w-[240px] mx-auto">
              By continuing, you agree to our{' '}
              <a href="#/terms" className="text-slate-900 font-bold hover:text-[#1a4484] transition-colors underline decoration-slate-300 underline-offset-2">Terms of Service</a>{' '}
              and{' '}
              <a href="#/privacy" className="text-slate-900 font-bold hover:text-[#1a4484] transition-colors underline decoration-slate-300 underline-offset-2">Privacy Policy</a>.
            </p>
          )}

        </div>
        
        {/* Progress Bar (Indicates step 1 vs 2, hidden on 3) */}
        {step !== 'success' && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
            <div 
              className="h-full bg-[#1a4484] transition-all duration-500 ease-out"
              style={{ width: step === 'input' ? '50%' : '100%' }}
            ></div>
          </div>
        )}

      </div>
    </div>
  );
}
