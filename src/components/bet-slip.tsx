"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBetting } from '@/components/betting-context';
import { formatOdds } from '@/lib/betting-data';

export function BetSlip() {
  const { betSlip, balance, removeFromBetSlip, updateStake, clearBetSlip, placeBet } = useBetting();

  const totalStake = betSlip.reduce((sum, b) => sum + b.stake, 0);
  const totalOdds = betSlip.reduce((acc, b) => acc * b.odds, 1);
  const potentialWin = totalStake * totalOdds;
  const canPlaceBet = betSlip.length > 0 && totalStake > 0 && totalStake <= balance;

  return (
    <div className="glass-card rounded-xl border border-border overflow-hidden h-fit sticky top-20">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          BET SLIP
          {betSlip.length > 0 && (
            <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-[var(--neon)] text-black">
              {betSlip.length}
            </span>
          )}
        </h3>
        {betSlip.length > 0 && (
          <button
            onClick={clearBetSlip}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4">
        <AnimatePresence mode="popLayout">
          {betSlip.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-muted-foreground"
            >
              <p className="text-sm">Click on any odds to add to your bet slip</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {betSlip.map((bet) => (
                <motion.div
                  key={bet.matchId}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-3 rounded-lg bg-secondary border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">{bet.matchInfo}</p>
                      <p className="font-semibold text-[var(--neon)]">{bet.selectionName}</p>
                    </div>
                    <button
                      onClick={() => removeFromBetSlip(bet.matchId)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{formatOdds(bet.odds)}</span>
                    <Input
                      type="number"
                      value={bet.stake}
                      onChange={(e) => updateStake(bet.matchId, parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 text-sm bg-background border-border"
                      min="0"
                      step="1"
                    />
                    <span className="text-xs text-muted-foreground">
                      Win: ${(bet.stake * bet.odds).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {betSlip.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-border space-y-3"
          >
            {betSlip.length > 1 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accumulator Odds</span>
                <span className="font-bold">{formatOdds(totalOdds)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Stake</span>
              <span className="font-bold">${totalStake.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Potential Win</span>
              <span className="font-bold text-[var(--neon)] text-lg">
                ${potentialWin.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={placeBet}
              disabled={!canPlaceBet}
              className="w-full bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90 disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Place Bet
            </Button>

            {totalStake > balance && (
              <p className="text-xs text-destructive text-center">
                Insufficient balance. Please deposit more funds.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
