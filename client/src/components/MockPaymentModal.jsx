import React, { useState } from 'react';
import { X, CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { apiRequest } from '../lib/apiClient';

export function MockPaymentModal({ isOpen, onClose, order, onSuccess, onFailed }) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'failed'

  if (!isOpen || !order) return null;

  const handlePayment = async (success) => {
    setProcessing(true);
    setResult(null);

    try {
      // Simulate processing delay (like real payment gateway)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call webhook endpoint to update payment status
      const response = await apiRequest('/payments/webhook', {
        method: 'POST',
        body: {
          transactionId: order.paymentId || order.id,
          status: success ? 'success' : 'failed',
          razorpayPaymentId: success ? `mock_pay_${Date.now()}` : undefined,
          razorpaySignature: success ? 'mock_signature_abc123' : undefined,
        },
      });

      setResult(success ? 'success' : 'failed');
      
      // Wait a moment to show result, then callback
      setTimeout(() => {
        if (success) {
          onSuccess(response);
        } else {
          onFailed();
        }
      }, 1500);
    } catch (error) {
      console.error('Mock payment error:', error);
      setResult('failed');
      setTimeout(() => {
        onFailed(error);
      }, 1500);
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    if (!processing && !result) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          {!processing && !result && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Mock Payment Gateway</h2>
              <p className="text-sm text-blue-100">Test Environment</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Order ID:</span>
              <span className="font-mono">{order.orderId || order.id}</span>
            </div>
            {order.paymentId && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment ID:</span>
                <span className="font-mono text-xs">{order.paymentId}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t">
              <span className="text-gray-700 font-medium">Amount to Pay:</span>
              <span className="text-3xl font-bold text-gray-900">
                ₹{(order.totalAmount || order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Processing State */}
          {processing && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <p className="text-gray-600 font-medium">Processing payment...</p>
              <p className="text-sm text-gray-500">Please wait</p>
            </div>
          )}

          {/* Success State */}
          {result === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-scale-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-600">Payment Successful!</p>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
          )}

          {/* Failed State */}
          {result === 'failed' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-shake">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <p className="text-xl font-bold text-red-600">Payment Failed</p>
              <p className="text-sm text-gray-500">Please try again</p>
            </div>
          )}

          {/* Action Buttons */}
          {!processing && !result && (
            <>
              <div className="text-center py-4 border-t border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-1">
                  This is a <span className="font-semibold">mock payment gateway</span> for testing
                </p>
                <p className="text-xs text-gray-400">
                  Choose an option to simulate payment result
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePayment(true)}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-md"
                >
                  <CheckCircle className="w-5 h-5" />
                  Success
                </button>
                <button
                  onClick={() => handlePayment(false)}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 active:scale-95 transition-all shadow-md"
                >
                  <XCircle className="w-5 h-5" />
                  Failed
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition"
              >
                Cancel Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
