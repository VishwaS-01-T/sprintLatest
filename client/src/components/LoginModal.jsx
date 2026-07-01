import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { userAuth } from '../lib/api';

const RESEND_SECONDS = 30;

function OtpBoxes({ value, onChange, onKeyDown, inputRefs, error }) {
  return (
    <div className="flex justify-center gap-3">
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(idx, e.target.value)}
          onKeyDown={(e) => onKeyDown(idx, e)}
          onPaste={
            idx === 0
              ? (e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                  if (!pasted) return;
                  const next = [...value];
                  for (let i = 0; i < pasted.length && i < 6; i++) next[i] = pasted[i];
                  onChange('bulk', next);
                  const focusIdx = Math.min(pasted.length, 5);
                  setTimeout(() => inputRefs.current[focusIdx]?.focus(), 0);
                }
              : undefined
          }
          className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-[20px] focus:outline-none transition-all duration-[250ms] ease ${
            error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60'
          }`}
          aria-label={`Digit ${idx + 1}`}
        />
      ))}
    </div>
  );
}

function useCountdown(start, active) {
  const [seconds, setSeconds] = useState(start);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      setSeconds(start);
      setDone(false);
    });
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(id); setDone(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [active, start]);

  const fmt = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return { fmt, done };
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const login = useAuthStore((s) => s.login);

  // 'login', 'register', 'otp'
  const [step, setStep] = useState('login');
  
  // which flow initiated the OTP
  const [flow, setFlow] = useState(null); // 'login' | 'register'
  
  // Shared fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpActive, setOtpActive] = useState(false);
  const otpRefs = useRef([]);
  const timer = useCountdown(RESEND_SECONDS, otpActive);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inlineMsg, setInlineMsg] = useState(null); // { type: 'login' | 'register', msg: '' }

  useEffect(() => {
    if (step === 'otp') setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }, [step]);

  const resetAll = useCallback(() => {
    setStep('login');
    setFlow(null);
    setEmail('');
    setFirstName('');
    setLastName('');
    setOtp(Array(6).fill(''));
    setOtpError('');
    setOtpActive(false);
    setLoading(false);
    setError('');
    setInlineMsg(null);
  }, []);

  const handleClose = () => { resetAll(); onClose(); };

  const validateEmail = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  }

  // --- Login Form ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setInlineMsg(null);
    setLoading(true);
    try {
      const res = await userAuth.checkEmailExists(email);
      const exists = res.data?.exists;
      if (exists) {
        await userAuth.requestEmailLoginOTP(email);
        setFlow('login');
        setStep('otp');
        setOtpActive(true);
      } else {
        setInlineMsg({ type: 'login', msg: 'No account found with this email.' });
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // --- Register Form ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (firstName.trim().length < 2) {
      setError('First name must be at least 2 characters.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setInlineMsg(null);
    setLoading(true);
    try {
      const res = await userAuth.checkEmailExists(email);
      const exists = res.data?.exists;
      if (exists) {
        setInlineMsg({ type: 'register', msg: 'An account with this email already exists.' });
      } else {
        await userAuth.requestEmailRegisterOTP(email, firstName);
        setFlow('register');
        setStep('otp');
        setOtpActive(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // --- OTP Handlers ---
  const handleOtpChange = (idx, value) => {
    if (idx === 'bulk') { 
      setOtp(value); setOtpError('');
      return; 
    }
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp]; next[idx] = value; setOtp(next); setOtpError('');
    if (value && idx < 5) setTimeout(() => otpRefs.current[idx + 1]?.focus(), 0);
  };
  
  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  useEffect(() => {
    const tokenStr = otp.join('');
    if (tokenStr.length === 6 && !loading && !otpError) {
      handleVerifyOtp(tokenStr);
    }
  }, [otp]); // Removed loading and otpError from deps to prevent duplicate calls, just rely on otp changing

  const handleVerifyOtp = async (tokenStr) => {
    setOtpError('');
    setLoading(true);
    try {
      let res;
      if (flow === 'login') {
        res = await userAuth.loginWithEmailOTP(email, tokenStr);
      } else {
        res = await userAuth.completeEmailRegistration({
          firstName,
          lastName,
          email,
          otp: tokenStr
        });
      }
      const data = res.data || {};
      login({
        email: data.user?.email || email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userData: data.user || null,
      });
      handleClose();
      onLoginSuccess?.();
    } catch (err) {
      setOtpError(err.message || 'Incorrect code, try again.');
      setOtp(Array(6).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp(Array(6).fill(''));
    setOtpError('');
    try {
      if (flow === 'login') {
        await userAuth.requestEmailLoginOTP(email);
      } else {
        await userAuth.requestEmailRegisterOTP(email, firstName);
      }
      setOtpActive(true);
      otpRefs.current[0]?.focus();
    } catch (err) {
      if (err.message?.toLowerCase().includes("rate limit") || err.message?.toLowerCase().includes("too many requests")) {
         setOtpError('Too many requests. Please try again later.');
      } else {
         setOtpError(err.message || 'Failed to resend OTP.');
      }
    }
  };

  const handleSwitchToRegister = () => {
    setStep('register');
    setInlineMsg(null);
    setError('');
  };

  const handleSwitchToLogin = () => {
    setStep('login');
    setInlineMsg(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white rounded-[20px] shadow-[var(--shadow-soft)] w-full max-w-md mx-4 p-8 z-10 max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={handleClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-all duration-[250ms] ease cursor-pointer">
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Logo" className="h-12 w-auto invert" />
        </div>

        {/* LOGIN STEP */}
        {step === 'login' && (
          <>
            <h2 className="text-xl font-bold text-center text-black mb-2">Log in to your account</h2>
            <p className="text-center text-gray-500 text-sm mb-8">Get personalised picks &amp; faster checkout</p>

            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-6">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setInlineMsg(null); setError(''); }}
                  className={`w-full px-4 py-4 text-black placeholder:text-muted bg-white border ${inlineMsg ? 'border-red-400' : 'border-gray-300'} rounded-[20px] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease`}
                />
                {inlineMsg?.type === 'login' && (
                  <p className="mt-2 text-sm text-red-500">
                    {inlineMsg.msg} <button type="button" onClick={handleSwitchToRegister} className="underline font-semibold ml-1 text-red-600 hover:text-red-700">Create one</button>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className={`w-full py-2.5 px-6 rounded-full font-semibold transition-all duration-[250ms] ease cursor-pointer flex items-center justify-center gap-2 ${
                  email && !loading ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Continue
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account? <button type="button" onClick={handleSwitchToRegister} className="font-semibold text-black hover:underline">Sign up</button>
            </p>
          </>
        )}

        {/* REGISTER STEP */}
        {step === 'register' && (
          <>
            <h2 className="text-xl font-bold text-center text-black mb-2">Create your account</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Just a few details to get started</p>

            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[20px] text-sm text-black placeholder:text-muted focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease"
                />
                <input
                  type="text"
                  placeholder="Last Name (optional)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[20px] text-sm text-black placeholder:text-muted focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease"
                />
              </div>

              <div>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setInlineMsg(null); setError(''); }}
                  className={`w-full px-4 py-3 border ${inlineMsg ? 'border-red-400' : 'border-gray-300'} rounded-[20px] text-sm text-black placeholder:text-muted focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease`}
                />
                {inlineMsg?.type === 'register' && (
                  <p className="mt-2 text-sm text-red-500">
                    {inlineMsg.msg} <button type="button" onClick={handleSwitchToLogin} className="underline font-semibold ml-1 text-red-600 hover:text-red-700">Log in instead</button>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email || !firstName}
                className={`w-full py-2.5 mt-2 px-6 rounded-full font-semibold transition-all duration-[250ms] ease cursor-pointer flex items-center justify-center gap-2 ${
                  email && firstName && !loading ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Continue
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account? <button type="button" onClick={handleSwitchToLogin} className="font-semibold text-black hover:underline">Log in</button>
            </p>
            <p className="text-center text-xs text-gray-400 mt-4 px-4">
              By creating an account, you agree to the <a href="/terms" className="underline hover:text-gray-600">Terms</a> &amp; <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
            </p>
          </>
        )}

        {/* OTP STEP */}
        {step === 'otp' && (
          <>
            <button type="button" onClick={() => { setStep(flow === 'login' ? 'login' : 'register'); setOtpActive(false); }} className="absolute top-4 left-4 p-1 hover:bg-gray-100 rounded-full transition-all duration-[250ms] ease cursor-pointer">
              <ArrowLeft className="w-6 h-6 text-gray-500" />
            </button>

            <h2 className="text-xl font-bold text-center text-black mb-2">Verify your Email</h2>
            <p className="text-center text-gray-500 text-sm mb-2">We&apos;ve sent a 6-digit code to</p>
            <p className="text-center font-semibold text-black text-sm mb-8">{email}</p>

            <OtpBoxes value={otp} onChange={handleOtpChange} onKeyDown={handleOtpKeyDown} inputRefs={otpRefs} error={!!otpError} />
            
            {otpError && <p className="text-center text-sm text-red-500 mt-3">{otpError}</p>}
            {error && <p className="text-center text-sm text-red-500 mt-3">{error}</p>}

            <div className="text-center mt-6">
              {timer.done ? (
                <button type="button" onClick={handleResendOtp} disabled={loading} className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-all duration-[250ms] ease cursor-pointer disabled:opacity-50">
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-400">Resend in <span className="font-semibold text-gray-600">{timer.fmt}</span></p>
              )}
            </div>
            
            {otpError && otpError.includes("Too many") && (
              <div className="text-center mt-4">
                 <button type="button" onClick={() => setStep(flow === 'login' ? 'login' : 'register')} className="text-sm font-medium text-gray-600 underline hover:text-black">
                    Use a different email
                 </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
