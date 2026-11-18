import React from 'react';
import { Compass, RotateCcw, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EmptyFeed({ onReset, isResetting = false }) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl p-8 border border-coy-border shadow-card text-center my-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 text-coral-500 flex items-center justify-center mb-5 border border-rose-100 shadow-sm">
        <Compass className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-coy-dark tracking-tight">
        You're All Caught Up!
      </h3>

      <p className="text-sm text-coy-muted mt-2 leading-relaxed">
        You’ve reviewed every profile currently available in your area. Check back soon for new people joining Coy.
      </p>

      <div className="w-full mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate('/matches')}
          className="w-full py-3 px-4 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm shadow-md shadow-coral-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>View Mutual Matches</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isResetting}
          className="w-full py-2.5 px-4 rounded-2xl bg-coy-warm hover:bg-stone-200 text-coy-dark font-semibold text-xs border border-coy-border flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset Feed Demo</span>
        </button>
      </div>
    </div>
  );
}
