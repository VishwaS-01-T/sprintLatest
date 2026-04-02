import React from 'react';

export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
