import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, ShieldCheck } from 'lucide-react';

export function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-coy-warm flex items-center justify-center text-coy-muted mb-4 border border-coy-border">
        <ShieldCheck className="w-8 h-8 text-coral-500" />
      </div>

      <h1 className="text-2xl font-extrabold text-coy-dark tracking-tight">
        Coy Home
      </h1>

      <p className="text-sm text-coy-muted mt-2 max-w-sm">
        This is a placeholder page for the core application shell. The new discovery experience lives in the Discover tab.
      </p>

      <NavLink
        to="/discover"
        className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm shadow-md shadow-coral-500/20 active:scale-95 transition-all"
      >
        <Compass className="w-4 h-4" />
        <span>Open Discover Tab</span>
      </NavLink>
    </div>
  );
}
