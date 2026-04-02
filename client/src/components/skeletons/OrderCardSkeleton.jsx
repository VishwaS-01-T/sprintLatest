import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function OrderCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton width={120} height={20} />
          <Skeleton width={200} height={16} />
        </div>
        <Skeleton width={80} height={24} borderRadius={12} />
      </div>

      <div className="flex items-center gap-4 pt-2 border-t">
        <Skeleton width={60} height={60} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t">
        <Skeleton width={100} height={20} />
        <Skeleton width={120} height={36} borderRadius={8} />
      </div>
    </div>
  );
}

export function OrdersListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}
