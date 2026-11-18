import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto h-[540px] sm:h-[580px] bg-white rounded-3xl overflow-hidden border border-coy-border shadow-card animate-pulse flex flex-col">
      <div className="w-full h-[62%] bg-stone-200" />
      <div className="p-5 flex flex-col justify-between h-[38%]">
        <div>
          <div className="h-6 w-36 bg-stone-200 rounded-lg mb-2" />
          <div className="h-4 w-24 bg-stone-200 rounded-lg mb-4" />
          <div className="h-3 w-full bg-stone-100 rounded mb-2" />
          <div className="h-3 w-4/5 bg-stone-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-stone-200 rounded-xl" />
          <div className="h-6 w-20 bg-stone-200 rounded-xl" />
          <div className="h-6 w-14 bg-stone-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
