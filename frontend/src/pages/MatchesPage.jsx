import React, { useState, useEffect } from 'react';
import { Heart, MapPin, GraduationCap, Calendar, Sparkles, MessageCircle, X, Compass, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { fetchMatches } from '../services/api.js';
import { ErrorAlert } from '../components/ErrorAlert.jsx';

export function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMatches();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message || 'Failed to load matches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6">
        <div className="h-8 w-40 bg-stone-200 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-4 border border-coy-border animate-pulse h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <ErrorAlert message={error} onRetry={loadMatches} />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-coy-dark tracking-tight">
              Mutual Matches
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-coral-50 text-coral-600 border border-coral-200">
              {matches.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-coy-muted mt-1">
            People who expressed mutual interest with you. 100% private until matched.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-coy-border text-xs text-coy-muted shadow-sm self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero one-sided leaks</span>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-coy-border text-center max-w-md mx-auto my-12 shadow-card">
          <div className="w-16 h-16 rounded-3xl bg-coral-50 text-coral-500 flex items-center justify-center mx-auto mb-4 border border-coral-100">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-coy-dark tracking-tight">
            No Matches Yet
          </h2>
          <p className="text-sm text-coy-muted mt-2 leading-relaxed">
            Matches only appear when both people like each other. Your interest remains completely confidential until feelings are mutual.
          </p>
          <NavLink
            to="/discover"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm shadow-md shadow-coral-500/20 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Profiles</span>
          </NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {matches.map((item) => {
            const p = item.profile;
            return (
              <div
                key={item.matchId}
                onClick={() => setSelectedMatch(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-coy-border shadow-card hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-64 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={p.photo}
                    alt={p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-coy-dark flex items-center gap-1 shadow-sm">
                    <Calendar className="w-3 h-3 text-coral-500" />
                    <span>{formatDate(item.matchedAt)}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-baseline gap-1.5">
                      <h3 className="text-xl font-bold tracking-tight drop-shadow">
                        {p.name}
                      </h3>
                      <span className="text-lg font-medium opacity-90 drop-shadow">
                        {p.age}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-90 mt-0.5 drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-rose-300" />
                      <span>{p.city}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {p.bio}
                  </p>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-semibold text-coral-600">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Mutual Interest</span>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1 rounded-xl bg-coy-warm hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-stone-500" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-coy-border max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setSelectedMatch(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-72 sm:h-80 w-full bg-stone-100 overflow-hidden flex-shrink-0">
              <img
                src={selectedMatch.profile.photo}
                alt={selectedMatch.profile.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-extrabold">{selectedMatch.profile.name}</h2>
                  <span className="text-2xl font-medium opacity-90">{selectedMatch.profile.age}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium opacity-90 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-rose-300" />
                    <span>{selectedMatch.profile.city}</span>
                  </div>
                  {selectedMatch.profile.college && (
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-rose-300" />
                      <span>{selectedMatch.profile.college}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-coy-muted mb-1">
                  About
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {selectedMatch.profile.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-coy-muted mb-2">
                  Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMatch.profile.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-coy-warm text-coy-dark text-xs font-medium border border-coy-border"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-coral-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700 leading-relaxed">
                  <p className="font-bold text-coral-700 mb-0.5">Matched on {formatDate(selectedMatch.matchedAt)}</p>
                  <p>You both showed interest in each other. Enjoy starting your conversation!</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Starting encrypted chat with ${selectedMatch.profile.name}...`)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-coral-500 to-rose-500 hover:from-coral-600 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-coral-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start Conversation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
