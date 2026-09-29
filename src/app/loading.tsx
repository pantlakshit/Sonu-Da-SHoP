import React from 'react';

export default function Loading() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 animate-pulse space-y-12">
      <div className="space-y-4 max-w-xl">
        <div className="h-4 w-32 bg-surface-container-high rounded"></div>
        <div className="h-10 w-96 bg-surface-container-high rounded"></div>
        <div className="h-4 w-64 bg-surface-container-high rounded"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/5] bg-surface-container-high rounded-lg"></div>
            <div className="h-6 w-3/4 bg-surface-container-high rounded"></div>
            <div className="h-4 w-1/2 bg-surface-container-high rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
