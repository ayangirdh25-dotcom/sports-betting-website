"use client";

import { motion } from 'framer-motion';
import { sportsCategories } from '@/lib/betting-data';
import { cn } from '@/lib/utils';

interface SportsCategoriesProps {
  selectedSport: string | null;
  onSelectSport: (sport: string | null) => void;
}

export function SportsCategories({ selectedSport, onSelectSport }: SportsCategoriesProps) {
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
      {sportsCategories.map((sport) => (
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
