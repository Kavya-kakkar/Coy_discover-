import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MatchModal({ match, onClose }) {
  const navigate = useNavigate();

  if (!match) return null;

  const currentUserPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const partner = match.profile;

  const handleGoToMatches = () => {
    onClose();
    navigate('/matches');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-coral-100 text-center overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-coral-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-coral-600 text-xs font-bold border border-coral-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mutual Interest Confirmed</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight bg-gradient-to-r from-coral-600 to-rose-500 bg-clip-text text-transparent">
            It’s a Match!
          </h2>

          <p className="text-sm text-stone-600 mt-2 max-w-xs mx-auto">
            You and <span className="font-bold text-stone-900">{partner.name}</span> expressed mutual interest in each other.
          </p>

          <div className="relative flex items-center justify-center gap-4 my-7">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative"
            >
              <img
                src={currentUserPhoto}
                alt="You"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-xl"
              />
              <span className="absolute bottom-0 right-0 bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                You
              </span>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.25, 1] }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center text-white shadow-lg ring-4 ring-white"
            >
              <Heart className="w-6 h-6 fill-white animate-pulse" />
            </motion.div>

            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative"
            >
              <img
                src={partner.photo}
                alt={partner.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-xl"
              />
              <span className="absolute bottom-0 right-0 bg-coral-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                {partner.name.split(' ')[0]}
              </span>
            </motion.div>
          </div>

          <div className="p-3 bg-coy-warm rounded-2xl border border-coy-border mb-6">
            <p className="text-xs text-coy-muted leading-relaxed">
              Coy’s core promise: your interest is never revealed unless feelings are mutual.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleGoToMatches}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-coral-500 to-rose-500 hover:from-coral-600 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-coral-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <span>View Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-sm border border-stone-200 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-stone-400" />
              <span>Continue Discover</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
