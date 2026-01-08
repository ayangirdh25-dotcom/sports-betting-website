"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';
import { Match, generateOddsChange, formatOdds } from '@/lib/betting-data';
import { useBetting } from '@/components/betting-context';
import { cn } from '@/lib/utils';

interface LiveOddsBoardProps {
  matches: Match[];
  onMatchesUpdate: (matches: Match[]) => void;
}

export function LiveOddsBoard({ matches, onMatchesUpdate }: LiveOddsBoardProps) {
  const { addToBetSlip, isBetInSlip } = useBetting();
  const [flashingOdds, setFlashingOdds] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const liveMatches = matches.filter(m => m.isLive);
      if (liveMatches.length === 0) return;

      const randomMatch = liveMatches[Math.floor(Math.random() * liveMatches.length)];
      const oddsType = Math.random() > 0.5 ? 'home' : 'away';
      
      const updatedMatches = matches.map(m => {
        if (m.id === randomMatch.id) {
          const newOdds = { ...m.odds };
          if (oddsType === 'home') {
            newOdds.home = generateOddsChange(m.odds.home);
          } else {
            newOdds.away = generateOddsChange(m.odds.away);
          }
          return { ...m, odds: newOdds };
        }
        return m;
      });

      setFlashingOdds({ [`${randomMatch.id}-${oddsType}`]: oddsType });
      setTimeout(() => setFlashingOdds({}), 500);

      onMatchesUpdate(updatedMatches);
    }, 3000);

    return () => clearInterval(interval);
  }, [matches, onMatchesUpdate]);

  const handleBetClick = useCallback((match: Match, selection: 'home' | 'draw' | 'away', odds: number) => {
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
  }, [addToBetSlip]);

  const liveMatches = matches.filter(m => m.isLive);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          LIVE NOW
        </h2>
        <span className="text-muted-foreground">({liveMatches.length} events)</span>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {liveMatches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-xl p-4 hover:border-[var(--neon)]/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    LIVE
                  </span>
                  <span className="text-xs text-muted-foreground">{match.league}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {match.minute}&apos;
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{match.homeTeam.logo}</span>
                  <div>
                    <p className="font-semibold">{match.homeTeam.name}</p>
                    {match.homeTeam.score !== undefined && (
                      <p className="text-2xl font-bold text-[var(--neon)]">{match.homeTeam.score}</p>
                    )}
                  </div>
                </div>

                <div className="text-center px-4">
                  <span className="text-muted-foreground text-sm">VS</span>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end text-right">
                  <div>
                    <p className="font-semibold">{match.awayTeam.name}</p>
                    {match.awayTeam.score !== undefined && (
                      <p className="text-2xl font-bold text-[var(--neon)]">{match.awayTeam.score}</p>
                    )}
                  </div>
                  <span className="text-2xl">{match.awayTeam.logo}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <OddsButton
                  label="1"
                  odds={match.odds.home}
                  isFlashing={flashingOdds[`${match.id}-home`] === 'home'}
                  isSelected={isBetInSlip(match.id, 'home')}
                  onClick={() => handleBetClick(match, 'home', match.odds.home)}
                />
                {match.odds.draw && (
                  <OddsButton
                    label="X"
                    odds={match.odds.draw}
                    isFlashing={false}
                    isSelected={isBetInSlip(match.id, 'draw')}
                    onClick={() => handleBetClick(match, 'draw', match.odds.draw!)}
                  />
                )}
                <OddsButton
                  label="2"
                  odds={match.odds.away}
                  isFlashing={flashingOdds[`${match.id}-away`] === 'away'}
                  isSelected={isBetInSlip(match.id, 'away')}
                  onClick={() => handleBetClick(match, 'away', match.odds.away)}
                  className={!match.odds.draw ? 'col-span-1' : ''}
                />
                {!match.odds.draw && <div />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface OddsButtonProps {
  label: string;
  odds: number;
  isFlashing: boolean;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

function OddsButton({ label, odds, isFlashing, isSelected, onClick, className }: OddsButtonProps) {
  const [prevOdds, setPrevOdds] = useState(odds);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (odds !== prevOdds) {
      setTrend(odds > prevOdds ? 'up' : 'down');
      setPrevOdds(odds);
      const timer = setTimeout(() => setTrend(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [odds, prevOdds]);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-3 rounded-lg bg-secondary border border-border transition-all duration-300",
        "hover:border-[var(--neon)] hover:bg-[var(--neon)]/10",
        isFlashing && "animate-odds-flash",
        isSelected && "border-[var(--neon)] bg-[var(--neon)]/20",
        className
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center justify-center gap-1">
        <span className={cn(
          "font-bold text-lg transition-colors",
          trend === 'up' && "text-[var(--win)]",
          trend === 'down' && "text-[var(--lose)]"
        )}>
          {formatOdds(odds)}
        </span>
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-[var(--win)]" />}
        {trend === 'down' && <TrendingDown className="w-3 h-3 text-[var(--lose)]" />}
      </div>
    </button>
  );
}
