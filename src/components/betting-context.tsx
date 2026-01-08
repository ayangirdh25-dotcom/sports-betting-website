"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BetSlipItem } from '@/lib/betting-data';

interface BettingContextType {
  betSlip: BetSlipItem[];
  balance: number;
  addToBetSlip: (bet: BetSlipItem) => void;
  removeFromBetSlip: (matchId: string) => void;
  updateStake: (matchId: string, stake: number) => void;
  clearBetSlip: () => void;
  placeBet: () => void;
  isBetInSlip: (matchId: string, selection: string) => boolean;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([]);
  const [balance, setBalance] = useState(1250.00);

  const addToBetSlip = useCallback((bet: BetSlipItem) => {
    setBetSlip(prev => {
      const existing = prev.find(b => b.matchId === bet.matchId);
      if (existing) {
        return prev.map(b => b.matchId === bet.matchId ? bet : b);
      }
      return [...prev, bet];
    });
  }, []);

  const removeFromBetSlip = useCallback((matchId: string) => {
    setBetSlip(prev => prev.filter(b => b.matchId !== matchId));
  }, []);

  const updateStake = useCallback((matchId: string, stake: number) => {
    setBetSlip(prev => prev.map(b => 
      b.matchId === matchId ? { ...b, stake } : b
    ));
  }, []);

  const clearBetSlip = useCallback(() => {
    setBetSlip([]);
  }, []);

  const placeBet = useCallback(() => {
    const totalStake = betSlip.reduce((sum, b) => sum + b.stake, 0);
    if (totalStake > balance) return;
    setBalance(prev => prev - totalStake);
    setBetSlip([]);
  }, [betSlip, balance]);

  const isBetInSlip = useCallback((matchId: string, selection: string) => {
    return betSlip.some(b => b.matchId === matchId && b.selection === selection);
  }, [betSlip]);

  return (
    <BettingContext.Provider value={{
      betSlip,
      balance,
      addToBetSlip,
      removeFromBetSlip,
      updateStake,
      clearBetSlip,
      placeBet,
      isBetInSlip,
    }}>
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
}
