"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Zap, Menu, X, Wallet, LogIn, UserPlus, Trophy, Gift, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBetting } from '@/components/betting-context';
import { AuthModal } from '@/components/auth-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { balance, user, profile, signOut } = useBetting();

  const navLinks = [
    { name: 'Sports', href: '#sports' },
    { name: 'Live', href: '#live' },
    { name: 'Casino', href: '#' },
    { name: 'Promotions', href: '#' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon)] to-[var(--neon-secondary)] flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                VELOCITY<span className="text-[var(--neon)]">BET</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
                  <Wallet className="w-4 h-4 text-[var(--neon)]" />
                  <span className="font-semibold">${balance.toFixed(2)}</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="w-4 h-4" />
                      {profile?.username || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 glass-card border-border">
                      <Link href="/profile">
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/profile?tab=history">
                        <DropdownMenuItem className="cursor-pointer">
                          <Trophy className="w-4 h-4 mr-2" />
                          Bet History
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button className="bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90">
                  <Trophy className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
              </>
            ) : (
              <AuthModal />
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
              {user && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary w-fit">
                  <Wallet className="w-4 h-4 text-[var(--neon)]" />
                  <span className="font-semibold">${balance.toFixed(2)}</span>
                </div>
              )}
              <div className="flex gap-2">
                {!user ? (
                  <AuthModal />
                ) : (
                  <Button onClick={() => signOut()} variant="outline" className="flex-1 text-destructive">
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
