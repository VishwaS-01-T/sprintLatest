import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function CheckoutSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Shipping Address */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <Skeleton width={180} height={24} />
          <div className="space-y-3">
            <Skeleton height={120} borderRadius={8} />
            <Skeleton height={120} borderRadius={8} />
          </div>
          <Skeleton width={150} height={40} borderRadius={8} />
        </div>

        {/* Shipping Method */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <Skeleton width={160} height={24} />
          <div className="space-y-3">
            <Skeleton height={80} borderRadius={8} />
            <Skeleton height={80} borderRadius={8} />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <Skeleton width={160} height={24} />
          <div className="space-y-3">
            <Skeleton height={60} borderRadius={8} />
            <Skeleton height={60} borderRadius={8} />
          </div>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 border rounded-lg p-6 space-y-4 sticky top-4">
          <Skeleton width={150} height={24} />
          
          {/* Cart Items */}
          <div className="space-y-3 py-4 border-t border-b">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton width={60} height={60} />
                <div className="flex-1 space-y-2">
                  <Skeleton width="80%" height={14} />
                  <Skeleton width="50%" height={12} />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton width={80} height={16} />
                <Skeleton width={60} height={16} />
              </div>
            ))}
          </div>

          <Skeleton height={48} borderRadius={8} className="mt-4" />
        </div>
      </div>
    </div>
  );
}
