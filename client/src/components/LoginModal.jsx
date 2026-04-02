import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { userAuth } from '../lib/api';

/**
 * Steps:
 *  'phone'     → Enter phone number
 *  'phone-otp' → Verify 6-digit phone OTP
 *  'details'   → Registration details (new users only)
 *  'email-otp' → Verify email (6-digit code from email)
 */

const RESEND_SECONDS = 30;

// Generic 6-box OTP input component
function OtpBoxes({ value, onChange, onKeyDown, inputRefs, error }) {
  return (
    <div className="flex justify-center gap-3">
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
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
        />
      ))}
    </div>
  );
}

// Countdown timer hook
function useCountdown(start, active) {
  const [seconds, setSeconds] = useState(start);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setSeconds(start);
    setDone(false);
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(id); setDone(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, start]);

  const fmt = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return { fmt, done };
}

// ─────────────────────────────────────────────────────────────────────────────

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const login = useAuthStore((s) => s.login);

  // ---- Step / flow state ----
  const [step, setStep] = useState('phone');
  const [flow, setFlow] = useState(null); // 'login' | 'register'

  // ---- Phone step ----
  const [phone, setPhone] = useState('');
  const phoneE164 = '+91' + phone;

  // ---- Phone OTP step ----
  const [phoneOtp, setPhoneOtp] = useState(Array(6).fill(''));
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [phoneOtpActive, setPhoneOtpActive] = useState(false);
  const phoneOtpRefs = useRef([]);
  const phoneTimer = useCountdown(RESEND_SECONDS, phoneOtpActive);

  // ---- Details step (register only) ----
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'UNISEX',
    dateOfBirth: '1995-01-01',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [detailsErrors, setDetailsErrors] = useState({});
  const [sessionId, setSessionId] = useState('');

  // ---- Email OTP step ----
  const [emailOtp, setEmailOtp] = useState(Array(6).fill(''));
  const [emailOtpError, setEmailOtpError] = useState('');
  const [emailOtpActive, setEmailOtpActive] = useState(false);
  const emailOtpRefs = useRef([]);
  const emailTimer = useCountdown(RESEND_SECONDS, emailOtpActive);

  // ---- Shared ----
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-focus first OTP box when entering OTP steps
  useEffect(() => {
    if (step === 'phone-otp') setTimeout(() => phoneOtpRefs.current[0]?.focus(), 100);
    if (step === 'email-otp') setTimeout(() => emailOtpRefs.current[0]?.focus(), 100);
  }, [step]);

  const resetAll = useCallback(() => {
    setStep('phone');
    setFlow(null);
    setPhone('');
    setPhoneOtp(Array(6).fill(''));
    setPhoneOtpError('');
    setPhoneOtpActive(false);
    setDetails({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: 'UNISEX',
      dateOfBirth: '1995-01-01',
    });
    setShowPassword(false);
    setDetailsErrors({});
    setSessionId('');
    setEmailOtp(Array(6).fill(''));
    setEmailOtpError('');
    setEmailOtpActive(false);
    setLoading(false);
    setError('');
  }, []);

  const handleClose = () => { resetAll(); onClose(); };

  if (!isOpen) return null;

  // ────────────────────────────── OTP box helpers ────────────────────────────

  function makeOtpHandlers(otp, setOtp, refs, setErr) {
    const handleChange = (idx, value) => {
      if (idx === 'bulk') { setOtp(value); setErr(''); return; }
      if (value && !/^\d$/.test(value)) return;
      const next = [...otp]; next[idx] = value; setOtp(next); setErr('');
      if (value && idx < 5) setTimeout(() => refs.current[idx + 1]?.focus(), 0);
    };
    const handleKeyDown = (idx, e) => {
      if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
    };
    return { handleChange, handleKeyDown };
  }

  const phoneOtpHandlers = makeOtpHandlers(phoneOtp, setPhoneOtp, phoneOtpRefs, setPhoneOtpError);
  const emailOtpHandlers = makeOtpHandlers(emailOtp, setEmailOtp, emailOtpRefs, setEmailOtpError);

  // ────────────────────────────── Step 1: Phone ──────────────────────────────

  const maskedPhone = phone.length >= 4
    ? `+91 ${'●'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`
    : `+91 ${phone}`;

  const handleGetOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await userAuth.requestLoginOtp(phoneE164);
      setFlow('login');
      setStep('phone-otp');
      setPhoneOtpActive(true);
    } catch (err) {
      try {
        const initiated = await userAuth.initiateRegisterPhone(phoneE164);
        setFlow('register');
        setSessionId(initiated.sessionId || '');
        setStep('phone-otp');
        setPhoneOtpActive(true);
      } catch (registrationErr) {
        setError(registrationErr.message || err.message || 'Failed to send OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    setPhoneOtp(Array(6).fill(''));
    setPhoneOtpError('');
    try {
      if (flow === 'login') {
        await userAuth.resendLoginOtp(phoneE164);
      } else {
        await userAuth.resendRegisterPhoneOtp(phoneE164);
      }
      setPhoneOtpActive(true);
      phoneOtpRefs.current[0]?.focus();
    } catch (err) {
      setPhoneOtpError(err.message || 'Failed to resend OTP');
    }
  };

  // ────────────────────────────── Step 2: Phone OTP ──────────────────────────

  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    const otpStr = phoneOtp.join('');
    if (otpStr.length !== 6) return;
    setPhoneOtpError('');

    setLoading(true);
    try {
      if (flow === 'login') {
        const res = await userAuth.loginWithPhone(phoneE164, otpStr);
        const data = res.data || {};
        login({
          phone: phoneE164,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userData: data.user || null,
        });
        handleClose();
        onLoginSuccess?.();
      } else {
        const verified = await userAuth.verifyRegisterPhone(phoneE164, otpStr);
        setSessionId(verified.sessionId || sessionId);
        setStep('details');
      }
    } catch (err) {
      setPhoneOtpError(err.message || 'Invalid OTP');
      setPhoneOtp(Array(6).fill(''));
      phoneOtpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────── Step 3: Details ────────────────────────────

  const validateDetails = () => {
    const errs = {};
    if (details.firstName.trim().length < 2) errs.firstName = 'At least 2 characters';
    if (details.lastName.trim().length < 2) errs.lastName = 'At least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) errs.email = 'Enter a valid email';
    if (details.password.length < 8) errs.password = 'At least 8 characters';
    if (!details.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    return errs;
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    const errs = validateDetails();
    if (Object.keys(errs).length) { setDetailsErrors(errs); return; }

    setLoading(true);
    try {
      await userAuth.initiateEmail(sessionId, details.email, details.firstName);
      setStep('email-otp');
      setEmailOtpActive(true);
    } catch (err) {
      setError(err.message || 'Failed to send email OTP');
    } finally {
      setLoading(false);
    }
  };

  const setDetail = (key, val) => {
    setDetails((d) => ({ ...d, [key]: val }));
    setDetailsErrors((e) => ({ ...e, [key]: '' }));
  };

  // ────────────────────────────── Step 4: Email OTP ──────────────────────────

  const handleResendEmail = async () => {
    setEmailOtp(Array(6).fill(''));
    setEmailOtpError('');
    try {
      await userAuth.resendEmail(sessionId, details.email, details.firstName);
      setEmailOtpActive(true);
      emailOtpRefs.current[0]?.focus();
    } catch (err) {
      setEmailOtpError(err.message || 'Failed to resend email OTP');
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    const tokenStr = emailOtp.join('');
    if (tokenStr.length !== 6) return;
    setEmailOtpError('');

    setLoading(true);
    try {
      await userAuth.verifyEmail(sessionId, details.email, tokenStr);
      const completed = await userAuth.completeRegistration({
        sessionId,
        firstName: details.firstName,
        lastName: details.lastName,
        gender: details.gender,
        email: details.email,
        password: details.password,
        dateOfBirth: details.dateOfBirth,
      });
      const data = completed.data || {};

      login({
        phone: phoneE164,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userData: data.user || null,
      });
      handleClose();
      onLoginSuccess?.();
    } catch (err) {
      setEmailOtpError(err.message || 'Failed to complete registration');
      setEmailOtp(Array(6).fill(''));
      emailOtpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────── Shared UI helpers ──────────────────────────

  const BackButton = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-4 left-4 p-1 hover:bg-gray-100 rounded-full transition-all duration-[250ms] ease cursor-pointer"
    >
      <ArrowLeft className="w-6 h-6 text-gray-500" />
    </button>
  );

  const ResendRow = ({ canResend, timer, onResend, label = 'Resend OTP' }) => (
    <div className="text-center mt-4">
      {canResend ? (
        <button
          type="button"
          onClick={onResend}
          className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-all duration-[250ms] ease cursor-pointer"
        >
          {label}
        </button>
      ) : (
        <p className="text-sm text-gray-400">
          Resend in <span className="font-semibold text-gray-600">{timer.fmt}</span>
        </p>
      )}
    </div>
  );

  // ────────────────────────────────── Render ─────────────────────────────────

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[20px] shadow-[var(--shadow-soft)] w-full max-w-md mx-4 p-8 z-10 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-all duration-[250ms] ease cursor-pointer"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Logo" className="h-12 w-auto invert" />
        </div>

        {/* ===================== STEP: PHONE ===================== */}
        {step === 'phone' && (
          <>
            <h2 className="text-xl font-bold text-center text-black mb-2">
              Log in to your account
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              Get personalised picks &amp; faster checkout
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleGetOtp}>
              <div className="mb-6">
                <div className="flex border border-gray-300 rounded-[20px] overflow-hidden focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-300/60 transition-all duration-[250ms] ease">
                  <span className="flex items-center px-3 text-gray-500 text-sm bg-gray-50 border-r border-gray-300 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    className="flex-1 px-4 py-4 text-black placeholder:text-muted focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phone.length !== 10 || loading}
                className={`w-full py-2.5 px-6 rounded-full font-semibold transition-all duration-[250ms] ease cursor-pointer flex items-center justify-center gap-2 ${
                  phone.length === 10 && !loading
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Get OTP
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              By entering this site, you agree to the{' '}
              <a href="/terms" className="underline font-medium text-black">Terms &amp; Conditions</a>{' '}
              and{' '}
              <a href="/privacy" className="underline font-medium text-black">Privacy Policy</a>
            </p>
          </>
        )}

        {/* =================== STEP: PHONE OTP =================== */}
        {step === 'phone-otp' && (
          <>
            <BackButton onClick={() => { setStep('phone'); setPhoneOtpActive(false); }} />

            <h2 className="text-xl font-bold text-center text-black mb-2">Enter OTP</h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              OTP sent to <span className="font-medium text-black">{maskedPhone}</span>
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyPhoneOtp}>
              <OtpBoxes
                value={phoneOtp}
                onChange={phoneOtpHandlers.handleChange}
                onKeyDown={phoneOtpHandlers.handleKeyDown}
                inputRefs={phoneOtpRefs}
                error={!!phoneOtpError}
              />
              {phoneOtpError && (
                <p className="text-center text-sm text-red-500 mt-3">{phoneOtpError}</p>
              )}

              <ResendRow
                canResend={phoneTimer.done}
                timer={phoneTimer}
                onResend={handleResendPhoneOtp}
              />

              <button
                type="submit"
                disabled={phoneOtp.join('').length !== 6 || loading}
                className={`w-full mt-6 py-4 rounded-full font-semibold transition flex items-center justify-center gap-2 ${
                  phoneOtp.join('').length === 6 && !loading
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify OTP
              </button>
            </form>
          </>
        )}

        {/* =================== STEP: DETAILS ==================== */}
        {step === 'details' && (
          <>
            <BackButton onClick={() => setStep('phone-otp')} />

            <h2 className="text-xl font-bold text-center text-black mb-2">Create your account</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Just a few details to get started
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={details.firstName}
                    onChange={(e) => setDetail('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-[20px] text-sm text-black placeholder:text-muted focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease ${detailsErrors.firstName ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {detailsErrors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{detailsErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={details.lastName}
                    onChange={(e) => setDetail('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-[20px] text-sm text-black placeholder:text-muted focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease ${detailsErrors.lastName ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {detailsErrors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{detailsErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={details.email}
                  onChange={(e) => setDetail('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-[20px] text-sm text-black placeholder:text-muted focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease ${detailsErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                />
                {detailsErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{detailsErrors.email}</p>
                )}
              </div>

              <div>
                <div className={`flex border rounded-[20px] overflow-hidden focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-300/60 transition-all duration-[250ms] ease ${detailsErrors.password ? 'border-red-400' : 'border-gray-300'}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min. 8 chars)"
                    value={details.password}
                    onChange={(e) => setDetail('password', e.target.value)}
                    className="flex-1 px-4 py-3 text-sm text-black placeholder:text-muted focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="px-3 text-muted hover:text-gray-600 transition-all duration-[250ms] ease cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {detailsErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{detailsErrors.password}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                  <select
                    value={details.gender}
                    onChange={(e) => setDetail('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[20px] text-sm text-black focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease"
                  >
                    <option value="MEN">Men</option>
                    <option value="WOMEN">Women</option>
                    <option value="UNISEX">Unisex</option>
                    <option value="KIDS">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={details.dateOfBirth}
                    onChange={(e) => setDetail('dateOfBirth', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-[20px] text-sm text-black focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 transition-all duration-[250ms] ease ${detailsErrors.dateOfBirth ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {detailsErrors.dateOfBirth && (
                    <p className="text-xs text-red-500 mt-1">{detailsErrors.dateOfBirth}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-6 rounded-full font-semibold transition-all duration-[250ms] ease cursor-pointer flex items-center justify-center gap-2 ${
                  !loading ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Continue
              </button>
            </form>
          </>
        )}

        {/* =================== STEP: EMAIL OTP =================== */}
        {step === 'email-otp' && (
          <>
            <BackButton onClick={() => setStep('details')} />

            <h2 className="text-xl font-bold text-center text-black mb-2">Verify your Email</h2>
            <p className="text-center text-gray-500 text-sm mb-2">
              We&apos;ve sent a 6-digit code to
            </p>
            <p className="text-center font-semibold text-black text-sm mb-8">
              {details.email}
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleCompleteRegistration}>
              <OtpBoxes
                value={emailOtp}
                onChange={emailOtpHandlers.handleChange}
                onKeyDown={emailOtpHandlers.handleKeyDown}
                inputRefs={emailOtpRefs}
                error={!!emailOtpError}
              />
              {emailOtpError && (
                <p className="text-center text-sm text-red-500 mt-3">{emailOtpError}</p>
              )}

              <ResendRow
                canResend={emailTimer.done}
                timer={emailTimer}
                onResend={handleResendEmail}
                label="Resend Email"
              />

              <button
                type="submit"
                disabled={emailOtp.join('').length !== 6 || loading}
                className={`w-full mt-6 py-2.5 px-6 rounded-full font-semibold transition-all duration-[250ms] ease cursor-pointer flex items-center justify-center gap-2 ${
                  emailOtp.join('').length === 6 && !loading
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify &amp; Create Account
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
