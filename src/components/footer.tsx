"use client";

import Link from 'next/link';
import { Zap, Twitter, Instagram, Facebook, Youtube, Shield, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon)] to-[var(--neon-secondary)] flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                VELOCITY<span className="text-[var(--neon)]">BET</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The fastest and most secure sports betting platform. Bet on live sports with real-time odds.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-[var(--neon)] hover:text-black transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-[var(--neon)] hover:text-black transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-[var(--neon)] hover:text-black transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-[var(--neon)] hover:text-black transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SPORTS</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Football</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Basketball</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Tennis</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Esports</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">MMA</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SUPPORT</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Betting Rules</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Responsible Gaming</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>LEGAL</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-[var(--neon)] transition-colors">Licensing</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-[var(--neon)]" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 text-[var(--neon)]" />
                <span>Secure Payments</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VelocityBet. All rights reserved. 18+ Gamble Responsibly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
