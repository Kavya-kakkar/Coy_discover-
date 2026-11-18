import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { DiscoverPage } from './pages/DiscoverPage.jsx';
import { MatchesPage } from './pages/MatchesPage.jsx';
import { ChatPage } from './pages/ChatPage.jsx';
import { fetchMatches, resetDatabase } from './services/api.js';

export default function App() {
  const [matchCount, setMatchCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const loadMatchCount = async () => {
    try {
      const data = await fetchMatches();
      setMatchCount((data.matches || []).length);
    } catch {}
  };

  useEffect(() => {
    loadMatchCount();
  }, [resetKey]);

  const handleMatchAdded = () => {
    setMatchCount((prev) => prev + 1);
  };

  const handleResetDemo = async () => {
    if (isResetting) return;
    try {
      setIsResetting(true);
      await resetDatabase();
      setResetKey((prev) => prev + 1);
      await loadMatchCount();
    } catch (err) {
      alert(`Failed to reset demo: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col antialiased selection:bg-rose-100 selection:text-rose-600">
        <Navigation
          matchCount={matchCount}
          onResetDemo={handleResetDemo}
          isResetting={isResetting}
        />

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              key={resetKey}
              path="/discover"
              element={
                <DiscoverPage
                  onMatchAdded={handleMatchAdded}
                  onResetFeed={handleResetDemo}
                  isResetting={isResetting}
                />
              }
            />
            <Route
              key={`matches_${resetKey}`}
              path="/matches"
              element={<MatchesPage />}
            />
            <Route
              path="/chat/:matchId"
              element={<ChatPage />}
            />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
