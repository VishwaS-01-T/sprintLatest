import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton width={200} height={32} />
        <div className="flex gap-4">
          <Skeleton width={150} height={20} />
          <Skeleton width={120} height={28} borderRadius={12} />
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-gray-50 rounded-lg p-6">
        <Skeleton width={150} height={24} className="mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton circle width={40} height={40} />
              <div className="flex-1 space-y-2">
                <Skeleton width="60%" height={18} />
                <Skeleton width="40%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton width={150} height={24} className="mb-4" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4 pb-4 border-b last:border-b-0">
            <Skeleton width={80} height={80} />
            <div className="flex-1 space-y-2">
              <Skeleton width="70%" height={18} />
              <Skeleton width="40%" height={14} />
              <Skeleton width="30%" height={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-6 space-y-3">
        <Skeleton width={150} height={24} className="mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton width={100} height={16} />
            <Skeleton width={80} height={16} />
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div className="border rounded-lg p-6 space-y-3">
        <Skeleton width={150} height={24} className="mb-4" />
        <Skeleton count={3} height={16} />
      </div>
    </div>
  );
}
