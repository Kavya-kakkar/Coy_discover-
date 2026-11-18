import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProfileCard } from '../components/ProfileCard.jsx';
import { SwipeControls } from '../components/SwipeControls.jsx';
import { MatchModal } from '../components/MatchModal.jsx';
import { EmptyFeed } from '../components/EmptyFeed.jsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.jsx';
import { ErrorAlert } from '../components/ErrorAlert.jsx';
import { fetchFeed, submitSwipe } from '../services/api.js';

export function DiscoverPage({ onMatchAdded, onResetFeed, isResetting = false }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);

  const swipingRef = useRef(false);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeed();
      setProfiles(data.profiles || []);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message || 'Unable to load profile feed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleSwipe = async (action) => {
    if (swipingRef.current) return;
    if (currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    swipingRef.current = true;
    setSwiping(true);
    setSwipeDirection(action);

    try {
      const response = await submitSwipe(currentProfile.id, action);

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwipeDirection(null);
        setSwiping(false);
        swipingRef.current = false;

        if (response.matched && response.match) {
          setActiveMatch(response.match);
          if (onMatchAdded) {
            onMatchAdded(response.match);
          }
        }
      }, 250);
    } catch (err) {
      setSwipeDirection(null);
      setSwiping(false);
      swipingRef.current = false;
      if (err.status === 409) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setError(err.message || 'Failed to submit swipe. Please try again.');
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeMatch) return;
      if (e.key === 'ArrowLeft') {
        handleSwipe('PASS');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('LIKE');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, profiles, activeMatch]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <ErrorAlert message={error} onRetry={loadFeed} />
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  if (!currentProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <EmptyFeed onReset={onResetFeed} isResetting={isResetting} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 select-none max-w-lg mx-auto w-full">
      <div className="w-full flex items-center justify-between text-xs text-coy-muted mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-coy-dark">Active Feed</span>
        </div>
        <span>
          Profile {currentIndex + 1} of {profiles.length}
        </span>
      </div>

      <div className="relative w-full max-w-sm h-[520px] sm:h-[560px]">
        {nextProfile && (
          <ProfileCard
            key={nextProfile.id}
            profile={nextProfile}
            isFront={false}
          />
        )}

        <AnimatePresence>
          {currentProfile && (
            <motion.div
              key={currentProfile.id}
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={
                swipeDirection === 'LIKE'
                  ? { x: 500, rotate: 25, opacity: 0 }
                  : swipeDirection === 'PASS'
                  ? { x: -500, rotate: -25, opacity: 0 }
                  : { x: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <ProfileCard
                profile={currentProfile}
                onSwipe={handleSwipe}
                isFront={true}
                disabled={swiping}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SwipeControls onSwipe={handleSwipe} disabled={swiping} />

      <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-stone-400 mt-4">
        <span>Use arrow keys: <kbd className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-[10px]">← Pass</kbd></span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-[10px]">→ Like</kbd></span>
      </div>

      {activeMatch && (
        <MatchModal
          match={activeMatch}
          onClose={() => setActiveMatch(null)}
        />
      )}
    </div>
  );
}
