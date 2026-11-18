import React from 'react';
import { Heart, X } from 'lucide-react';

export function SwipeControls({ onSwipe, disabled = false }) {
  return (
    <div className="flex items-center justify-center gap-6 mt-6 select-none">
      <button
        type="button"
        onClick={() => onSwipe('PASS')}
        disabled={disabled}
        aria-label="Pass profile"
        className="group relative w-16 h-16 rounded-full bg-white border border-stone-200 shadow-lg hover:shadow-xl flex items-center justify-center text-stone-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <X className="w-8 h-8 transition-transform group-hover:scale-110" />
      </button>

      <button
        type="button"
        onClick={() => onSwipe('LIKE')}
        disabled={disabled}
        aria-label="Like profile"
        className="group relative w-20 h-20 rounded-full bg-gradient-to-tr from-coral-500 to-rose-400 text-white shadow-float hover:shadow-2xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Heart className="w-10 h-10 fill-white transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}
