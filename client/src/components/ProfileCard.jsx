import React from 'react';

/**
 * ProfileCard — Reusable card wrapper used inside MyProfile page.
 * Props:
 *   - title   : section heading
 *   - icon    : Lucide icon component (optional)
 *   - children: card body content
 */
const ProfileCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-[20px] shadow-sm hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] transition-all duration-300 ease-out overflow-hidden">
      {/* Header */}
      {title && (
        <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-100 bg-gray-50/70">
          {Icon && <Icon className="w-5 h-5 text-amber-500" />}
          <h3 className="text-base font-bold text-neutral-900">{title}</h3>
        </div>
      )}

      {/* Body */}
      <div className="px-7 py-6">{children}</div>
    </div>
  );
};

export default ProfileCard;
