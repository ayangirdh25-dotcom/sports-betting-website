"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { sportsCategories } from '@/lib/betting-data';
import { cn } from '@/lib/utils';
import { Match } from '@/lib/betting-data';

interface SportsCategoriesProps {
  selectedSport: string | null;
  onSelectSport: (sport: string | null) => void;
  matches: Match[];
}

export function SportsCategories({ selectedSport, onSelectSport, matches = [] }: SportsCategoriesProps) {
  // Dynamically derive active sports from matches
  const activeSports = useMemo(() => {
    if (!matches) return [];
    const sports = new Set(matches.map(m => m.sport));
    return Array.from(sports).map(sportId => {
      const knownSport = sportsCategories.find(s => s.id === sportId || s.name.toLowerCase() === sportId.toLowerCase());
      return {
        id: sportId,
        name: knownSport?.name || sportId.charAt(0).toUpperCase() + sportId.slice(1),
        icon: knownSport?.icon || '🏆'
      };
    });
  }, [matches]);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelectSport(null)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap",
          "border border-border hover:border-[var(--neon)]",
          selectedSport === null && "bg-[var(--neon)] text-black border-[var(--neon)]"
        )}
      >
        <span>All Sports</span>
      </button>
      {activeSports.map((sport) => (
        <motion.button
          key={sport.id}
          onClick={() => onSelectSport(sport.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap",
            "border border-border hover:border-[var(--neon)]",
            selectedSport === sport.id && "bg-[var(--neon)] text-black border-[var(--neon)]"
          )}
        >
          <span>{sport.icon}</span>
          <span>{sport.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
