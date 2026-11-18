import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, GraduationCap, Sparkles, Heart, X, Info } from 'lucide-react';

export function ProfileCard({
  profile,
  onSwipe,
  isFront = true,
  disabled = false
}) {
  const [showFullBio, setShowFullBio] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (disabled || !isFront) return;
    const threshold = 100;
    const velocityThreshold = 500;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('LIKE');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('PASS');
    }
  };

  if (!isFront) {
    return (
      <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-white shadow-card border border-coy-border scale-[0.96] translate-y-3 pointer-events-none transition-transform duration-300">
        <div className="relative w-full h-[62%] bg-stone-100 overflow-hidden">
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-cover object-center filter brightness-95"
          />
        </div>
        <div className="p-5 flex flex-col justify-between h-[38%] bg-white">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold text-coy-dark tracking-tight">{profile.name}</h3>
              <span className="text-lg font-medium text-coy-muted">{profile.age}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-coy-muted mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.city}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-white shadow-xl border border-coy-border cursor-grab active:cursor-grabbing select-none"
    >
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-7 left-7 z-20 pointer-events-none transform -rotate-12"
      >
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-emerald-500/90 text-white font-extrabold text-lg tracking-wider border-2 border-white shadow-lg backdrop-blur-sm">
          <Heart className="w-5 h-5 fill-white" />
          <span>LIKE</span>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-7 right-7 z-20 pointer-events-none transform rotate-12"
      >
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-rose-500/90 text-white font-extrabold text-lg tracking-wider border-2 border-white shadow-lg backdrop-blur-sm">
          <X className="w-5 h-5" />
          <span>PASS</span>
        </div>
      </motion.div>

      <div className="relative w-full h-[60%] sm:h-[62%] bg-stone-100 overflow-hidden">
        <img
          src={profile.photo}
          alt={profile.name}
          draggable="false"
          className="w-full h-full object-cover object-center select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        <div className="absolute bottom-4 left-5 right-5 text-white pointer-events-none">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">
              {profile.name}
            </h2>
            <span className="text-xl sm:text-2xl font-semibold opacity-90 drop-shadow-md">
              {profile.age}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium opacity-90 mt-1">
            <div className="flex items-center gap-1 drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>{profile.city}</span>
            </div>
            {profile.college && (
              <div className="flex items-center gap-1 drop-shadow">
                <GraduationCap className="w-3.5 h-3.5 text-rose-300" />
                <span>{profile.college}</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowFullBio(!showFullBio);
          }}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          title="Toggle info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex flex-col justify-between h-[40%] sm:h-[38%] bg-white overflow-y-auto">
        <div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-3">
            {profile.bio}
          </p>

          <div className="mt-3">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-coy-muted uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-coral-500" />
              <span>Interests</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests &&
                profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-coy-warm text-coy-dark text-xs font-medium border border-coy-border/60 hover:border-coral-200 transition-colors"
                  >
                    {interest}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-coy-muted flex items-center justify-between border-t border-stone-100">
          <span>Mutual discovery</span>
          <span className="text-coral-500 font-semibold">100% Private until matched</span>
        </div>
      </div>
    </motion.div>
  );
}
