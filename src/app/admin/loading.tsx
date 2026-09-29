import React from 'react';

export default function AdminLoading() {
  return (
    <div className="p-8 max-w-container-max mx-auto animate-pulse space-y-8">
      <div className="h-8 w-64 bg-surface-container-high rounded"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-surface-container-high rounded-xl"></div>
        ))}
      </div>
      <div className="h-96 bg-surface-container-high rounded-xl"></div>
    </div>
  );
}
