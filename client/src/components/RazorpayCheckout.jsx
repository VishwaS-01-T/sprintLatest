import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { paymentsApi } from '../lib/api/paymentsApi';

/**
 * Razorpay Checkout Component
 *
 * Handles real Razorpay payment integration:
 * 1. Creates a Razorpay order from our backend
 * 2. Opens Razorpay checkout popup
 * 3. Verifies payment on completion
 */
export function RazorpayCheckout({
  isOpen,
  onClose,
  order,
  onSuccess,
  onFailed,
  userInfo = {},
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'failed' | null
  const [error, setError] = useState('');
  const [initiated, setInitiated] = useState(false); // Track if payment flow started

  // Load Razorpay script
  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [isOpen]);

  const initiatePayment = useCallback(async () => {
    if (!order?.paymentId) {
      setError('No payment ID provided');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Step 1: Create Razorpay order from our backend
      const response = await paymentsApi.createOrder(order.paymentId);
      const orderData = response.data;

      if (!orderData?.razorpayOrderId) {
        throw new Error('Failed to create payment order');
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Sprint Shoes',
        description: `Order #${order.orderId || order.id}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: userInfo.name || '',
          email: userInfo.email || '',
          contact: userInfo.phone || '',
        },
        theme: {
          color: '#171717', // neutral-900
        },
        handler: async function (response) {
          // Step 3: Verify payment
          try {
            const verifyResponse = await paymentsApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentId: order.paymentId,
            });

            setResult('success');
            setLoading(false);

            // Wait a moment to show success, then callback
            setTimeout(() => {
              onSuccess(verifyResponse.data);
            }, 1500);
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            setResult('failed');
            setError(verifyError.message || 'Payment verification failed');
            setLoading(false);

            setTimeout(() => {
              onFailed(verifyError);
            }, 1500);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            onClose();
          },
          escape: true,
          confirm_close: true,
        },
      };

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setResult('failed');
        setError(response.error.description || 'Payment failed');
        setLoading(false);

        setTimeout(() => {
          onFailed(response.error);
        }, 1500);
      });

      rzp.open();
      setLoading(false);
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  }, [order, userInfo, onSuccess, onFailed, onClose]);

  // Auto-initiate payment when modal opens (only once)
  useEffect(() => {
    if (isOpen && order?.paymentId && !initiated) {
      setInitiated(true);
      // Small delay to ensure Razorpay script is loaded
      const timer = setTimeout(() => {
        initiatePayment();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, order?.paymentId, initiated, initiatePayment]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInitiated(false);
      setResult(null);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Secure Payment</h2>
              <p className="text-sm text-neutral-300">Powered by Razorpay</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Order ID:</span>
              <span className="font-mono">{order?.orderId || order?.id}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t">
              <span className="text-neutral-700 font-medium">Amount:</span>
              <span className="text-2xl font-bold text-neutral-900">
                ₹{(order?.totalAmount || order?.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading && !result && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 text-neutral-600 animate-spin" />
              <p className="text-neutral-600 font-medium">Initializing payment...</p>
              <p className="text-sm text-neutral-500">Please wait</p>
            </div>
          )}

          {/* Success State */}
          {result === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-600">Payment Successful!</p>
              <p className="text-sm text-neutral-500">Redirecting to your order...</p>
            </div>
          )}

          {/* Failed State */}
          {result === 'failed' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <p className="text-xl font-bold text-red-600">Payment Failed</p>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <button
                onClick={() => {
                  setResult(null);
                  setError('');
                  initiatePayment();
                }}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Error State (no result yet) */}
          {error && !result && !loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-amber-600" />
              </div>
              <p className="text-lg font-semibold text-neutral-800">Something went wrong</p>
              <p className="text-sm text-red-500 text-center">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setError('');
                    initiatePayment();
                  }}
                  className="px-6 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
                >
                  Retry
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Cancel button when loading */}
          {loading && !result && (
            <button
              onClick={onClose}
              className="w-full text-neutral-500 hover:text-neutral-700 py-2 text-sm font-medium transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RazorpayCheckout;
