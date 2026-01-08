"use client";

import { useState, useCallback, useMemo } from 'react';
import { BettingProvider } from '@/components/betting-context';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { SportsCategories } from '@/components/sports-categories';
import { LiveOddsBoard } from '@/components/live-odds-board';
import { UpcomingEvents } from '@/components/upcoming-events';
import { BetSlip } from '@/components/bet-slip';
import { Footer } from '@/components/footer';
import { initialMatches, Match } from '@/lib/betting-data';

export function HomePage() {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const handleMatchesUpdate = useCallback((updatedMatches: Match[]) => {
    setMatches(updatedMatches);
  }, []);

  const filteredMatches = useMemo(() => {
    if (!selectedSport) return matches;
    return matches.filter(m => m.sport === selectedSport);
  }, [matches, selectedSport]);

  return (
    <BettingProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        
        <main className="max-w-7xl mx-auto px-4 py-12" id="sports">
          <div className="mb-8">
            <SportsCategories 
              selectedSport={selectedSport} 
              onSelectSport={setSelectedSport} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="live">
            <div className="lg:col-span-2 space-y-12">
              <LiveOddsBoard 
                matches={filteredMatches} 
                onMatchesUpdate={handleMatchesUpdate} 
              />
              <UpcomingEvents matches={filteredMatches} />
            </div>
            
            <div className="lg:col-span-1">
              <BetSlip />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </BettingProvider>
  );
}
