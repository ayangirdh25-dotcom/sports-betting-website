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
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (data) {
      const transformedMatches: Match[] = data.map(m => ({
        id: m.id,
        sport: m.sport,
        league: m.league,
        homeTeam: m.home_team,
        awayTeam: m.away_team,
        odds: m.odds,
        isLive: m.is_live,
        startTime: new Date(m.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        minute: m.minute
      }));
      setMatches(transformedMatches);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();

    const channel = supabase
      .channel('matches-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        fetchMatches();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    </BettingProvider>
  );
}
