import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import useAuthStore from '../store/authStore';

/**
 * LoginSuccessNotification — Slide-in toast shown after a successful login.
 * Auto-dismisses after 3 seconds.
 */
const LoginSuccessNotification = () => {
  const userName = useAuthStore((s) => s.userName);
  const userPhone = useAuthStore((s) => s.userPhone);

  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) return;
    // Trigger animation
    const showTimer = setTimeout(() => setShow(true), 10);
    // Auto-dismiss after 3s
    const hideTimer = setTimeout(() => {
      setShow(false);
      setTimeout(() => setVisible(false), 400);
    }, 3000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  // Expose a trigger function via a ref pattern using a custom event
  useEffect(() => {
    const handler = () => {
      setShow(false);
      setVisible(false);
      // Small delay so state resets before showing again
      setTimeout(() => setVisible(true), 50);
    };
    window.addEventListener('login-success', handler);
    return () => window.removeEventListener('login-success', handler);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  const displayName = userName || (userPhone ? `+91 ${userPhone}` : 'User');

  return (
    <div
      className={`fixed top-20 right-4 z-[200] w-full max-w-sm transition-all duration-400 ${
        show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden">
        {/* Green top bar */}
        <div className="h-1 bg-green-500 w-full" />

        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar circle */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">Logged in successfully!</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Welcome back, <span className="font-semibold text-amber-500">{displayName}</span> 👋
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 rounded-full transition-colors ml-2 shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccessNotification;
