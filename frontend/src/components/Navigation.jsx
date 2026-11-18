import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart, ShieldCheck, RotateCcw } from 'lucide-react';

export function Navigation({ matchCount = 0, onResetDemo, isResetting = false }) {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/matches', label: 'Matches', icon: Heart, badge: matchCount > 0 ? matchCount : null }
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-coy-border px-4 lg:px-8 py-3 transition-colors">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-coral-500/20">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-coy-dark">coy</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-coral-600 border border-coral-200">
                  Discover
                </span>
              </div>
              <p className="text-[11px] text-coy-muted hidden sm:block">Privacy-First Mutual Interest</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-coy-warm/80 p-1.5 rounded-2xl border border-coy-border">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-white text-coy-dark shadow-sm'
                        : 'text-coy-muted hover:text-coy-dark hover:bg-white/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold bg-coral-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetDemo}
              disabled={isResetting}
              title="Reset Database & Demo Likes"
              className="px-3 py-1.5 rounded-xl border border-coy-border bg-white hover:bg-coy-warm text-coy-muted hover:text-coy-dark text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-2xl border border-coy-border shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Alex Rivera"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-coral-100"
              />
              <div className="text-left hidden lg:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-coy-dark">Alex R.</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-coy-muted"></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-coy-border py-2 px-6 shadow-lg safe-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
                    isActive
                      ? 'text-coral-500 font-bold scale-105'
                      : 'text-coy-muted hover:text-coy-dark font-medium'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-coral-500 text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
