"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { BetSlipItem } from '@/lib/betting-data';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface BettingContextType {
  betSlip: BetSlipItem[];
  balance: number;
  user: User | null;
  profile: any | null;
  loading: boolean;
  addToBetSlip: (bet: BetSlipItem) => void;
  removeFromBetSlip: (matchId: string) => void;
  updateStake: (matchId: string, stake: number) => void;
  clearBetSlip: () => void;
  placeBet: () => void;
  isBetInSlip: (matchId: string, selection: string) => boolean;
  signOut: () => Promise<void>;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([]);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;
      let sessionChecked = false;

      const handleUserAndProfile = async (sessionUser: User | null) => {
        if (!sessionUser) {
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setBalance(0);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setUser(sessionUser);

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .single();
          
          if (isMounted) {
            if (profile) {
              setProfile(profile);
              setBalance(profile.balance);
            } else {
              // Create profile if it doesn't exist
              const { data: newProfile } = await supabase
                .from('profiles')
                .upsert({ 
                  id: sessionUser.id, 
                  username: sessionUser.user_metadata.username || sessionUser.email?.split('@')[0], 
                  balance: 1000.00 
                })
                .select()
                .single();
              
              if (newProfile) {
                setProfile(newProfile);
                setBalance(newProfile.balance);
              }
            }
          }
        } catch (err) {
          console.error('Error in handleUserAndProfile:', err);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      // Initial session check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!sessionChecked) {
          sessionChecked = true;
          if (session?.user) {
            handleUserAndProfile(session.user);
          } else {
            setLoading(false);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setBalance(0);
            setLoading(false);
          }
        } else if (session?.user) {
          // Only trigger if we haven't checked the session yet or if it's a sign-in event
          if (!sessionChecked || event === 'SIGNED_IN') {
            sessionChecked = true;
            handleUserAndProfile(session.user);
          }
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }, []);

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

  const placeBet = useCallback(async () => {
    const totalStake = betSlip.reduce((sum, b) => sum + b.stake, 0);
    if (!user || totalStake > balance) return;

    // In a real app, this should be a transaction or a RPC call
    const newBalance = balance - totalStake;
    
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    if (balanceError) return;

    const betPromises = betSlip.map(bet => 
      supabase.from('bets').insert({
        user_id: user.id,
        match_id: bet.matchId,
        selection: bet.selection,
        odds: bet.odds,
        stake: bet.stake,
        status: 'pending'
      })
    );

    await Promise.all(betPromises);
    
    setBalance(newBalance);
    setBetSlip([]);
  }, [betSlip, balance, user]);

  const isBetInSlip = useCallback((matchId: string, selection: string) => {
    return betSlip.some(b => b.matchId === matchId && b.selection === selection);
  }, [betSlip]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setBalance(0);
    window.location.href = '/';
  }, []);

  return (
    <BettingContext.Provider value={{
      betSlip,
      balance,
      user,
      profile,
      loading,
      addToBetSlip,
      removeFromBetSlip,
      updateStake,
      clearBetSlip,
      placeBet,
      isBetInSlip,
      signOut,
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
