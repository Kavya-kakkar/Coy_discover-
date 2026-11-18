import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function ErrorAlert({ message, onRetry }) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl p-6 border border-rose-200 shadow-card text-center my-auto flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-stone-900">
        Something went wrong
      </h3>

      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
        {message || 'Unable to communicate with the server. Please check your connection and try again.'}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 py-2.5 px-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
