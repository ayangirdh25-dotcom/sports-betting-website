"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Zap, Menu, X, Wallet, LogIn, UserPlus, Trophy, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBetting } from '@/components/betting-context';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { balance } = useBetting();

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
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
              <Wallet className="w-4 h-4 text-[var(--neon)]" />
              <span className="font-semibold">${balance.toFixed(2)}</span>
            </div>
            
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[var(--neon)] text-[var(--neon)] hover:bg-[var(--neon)] hover:text-black">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Welcome to VELOCITY<span className="text-[var(--neon)]">BET</span>
                  </DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-secondary">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" className="bg-secondary border-border" />
                    </div>
                    <Button className="w-full bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </TabsContent>
                  <TabsContent value="register" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" placeholder="John Doe" className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" placeholder="you@example.com" className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" placeholder="••••••••" className="bg-secondary border-border" />
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--neon)]/10 border border-[var(--neon)]/30">
                      <div className="flex items-center gap-2 text-[var(--neon)]">
                        <Gift className="w-4 h-4" />
                        <span className="font-semibold text-sm">Welcome Bonus: 100% up to $500</span>
                      </div>
                    </div>
                    <Button className="w-full bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Button className="bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90">
              <Trophy className="w-4 h-4 mr-2" />
              Deposit
            </Button>
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
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary w-fit">
                <Wallet className="w-4 h-4 text-[var(--neon)]" />
                <span className="font-semibold">${balance.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-[var(--neon)] text-[var(--neon)]">
                  Login
                </Button>
                <Button className="flex-1 bg-[var(--neon)] text-black">
                  Register
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
