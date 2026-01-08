"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { BettingProvider } from '@/components/betting-context';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { SportsCategories } from '@/components/sports-categories';
import { LiveOddsBoard } from '@/components/live-odds-board';
import { UpcomingEvents } from '@/components/upcoming-events';
import { BetSlip } from '@/components/bet-slip';
import { Footer } from '@/components/footer';
import { Match } from '@/lib/betting-data';
import { supabase } from '@/lib/supabase';

export function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/sports');
        if (!response.ok) throw new Error('Failed to fetch sports');
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchMatches();
      // Poll every 30 seconds for live odds
      const interval = setInterval(fetchMatches, 30000);
      return () => clearInterval(interval);
    }, []);

  const handleMatchesUpdate = useCallback((updatedMatches: Match[]) => {
    setMatches(updatedMatches);
  }, []);

  const filteredMatches = useMemo(() => {
    if (!selectedSport) return matches;
    return matches.filter(m => m.sport === selectedSport);
  }, [matches, selectedSport]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <main className="max-w-7xl mx-auto px-4 py-12" id="sports">
          <div className="mb-8">
            <SportsCategories 
              selectedSport={selectedSport} 
              onSelectSport={setSelectedSport} 
              matches={matches}
            />
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="live">
          <div className="lg:col-span-2 space-y-12">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--neon)]"></div>
              </div>
            ) : (
              <>
                <LiveOddsBoard 
                  matches={filteredMatches} 
                  onMatchesUpdate={handleMatchesUpdate} 
                />
                <UpcomingEvents matches={filteredMatches} />
              </>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <BetSlip />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
