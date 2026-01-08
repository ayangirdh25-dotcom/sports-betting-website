"use client";

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Match, formatOdds } from '@/lib/betting-data';
import { useBetting } from '@/components/betting-context';
import { cn } from '@/lib/utils';

interface UpcomingEventsProps {
  matches: Match[];
}

export function UpcomingEvents({ matches }: UpcomingEventsProps) {
  const { addToBetSlip, isBetInSlip } = useBetting();
  const upcomingMatches = matches.filter(m => !m.isLive);

  const handleBetClick = (match: Match, selection: 'home' | 'draw' | 'away', odds: number) => {
    const selectionName = selection === 'home' ? match.homeTeam.name : 
                          selection === 'away' ? match.awayTeam.name : 'Draw';
    addToBetSlip({
      matchId: match.id,
      selection,
      odds,
      stake: 10,
      matchInfo: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      selectionName,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-[var(--neon-secondary)]" />
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          UPCOMING EVENTS
        </h2>
        <span className="text-muted-foreground">({upcomingMatches.length} events)</span>
      </div>

      <div className="grid gap-4">
        {upcomingMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-4 hover:border-[var(--neon-secondary)]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-[var(--neon-secondary)]/20 text-[var(--neon-secondary)] font-medium">
                  {match.sport.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground">{match.league}</span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Today {match.startTime}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{match.homeTeam.logo}</span>
                <p className="font-semibold">{match.homeTeam.name}</p>
              </div>

              <div className="text-center px-4">
                <span className="text-muted-foreground text-sm">VS</span>
              </div>

              <div className="flex items-center gap-3 flex-1 justify-end text-right">
                <p className="font-semibold">{match.awayTeam.name}</p>
                <span className="text-2xl">{match.awayTeam.logo}</span>
              </div>
            </div>

            <div className={cn(
              "grid gap-2",
              match.odds.draw ? "grid-cols-3" : "grid-cols-2"
            )}>
              <button
                onClick={() => handleBetClick(match, 'home', match.odds.home)}
                className={cn(
                  "px-4 py-3 rounded-lg bg-secondary border border-border transition-all duration-300",
                  "hover:border-[var(--neon-secondary)] hover:bg-[var(--neon-secondary)]/10",
                  isBetInSlip(match.id, 'home') && "border-[var(--neon-secondary)] bg-[var(--neon-secondary)]/20"
                )}
              >
                <span className="text-xs text-muted-foreground">1</span>
                <p className="font-bold text-lg">{formatOdds(match.odds.home)}</p>
              </button>
              
              {match.odds.draw && (
                <button
                  onClick={() => handleBetClick(match, 'draw', match.odds.draw!)}
                  className={cn(
                    "px-4 py-3 rounded-lg bg-secondary border border-border transition-all duration-300",
                    "hover:border-[var(--neon-secondary)] hover:bg-[var(--neon-secondary)]/10",
                    isBetInSlip(match.id, 'draw') && "border-[var(--neon-secondary)] bg-[var(--neon-secondary)]/20"
                  )}
                >
                  <span className="text-xs text-muted-foreground">X</span>
                  <p className="font-bold text-lg">{formatOdds(match.odds.draw)}</p>
                </button>
              )}

              <button
                onClick={() => handleBetClick(match, 'away', match.odds.away)}
                className={cn(
                  "px-4 py-3 rounded-lg bg-secondary border border-border transition-all duration-300",
                  "hover:border-[var(--neon-secondary)] hover:bg-[var(--neon-secondary)]/10",
                  isBetInSlip(match.id, 'away') && "border-[var(--neon-secondary)] bg-[var(--neon-secondary)]/20"
                )}
              >
                <span className="text-xs text-muted-foreground">2</span>
                <p className="font-bold text-lg">{formatOdds(match.odds.away)}</p>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
