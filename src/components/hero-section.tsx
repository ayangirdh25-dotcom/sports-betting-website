"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="hero-gradient min-h-[80vh] flex items-center justify-center pt-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-secondary)]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
          <div className="absolute inset-0 border border-[var(--neon)]/20 rounded-full" />
          <div className="absolute inset-8 border border-[var(--neon)]/15 rounded-full" />
          <div className="absolute inset-16 border border-[var(--neon)]/10 rounded-full" />
          <div className="absolute inset-24 border border-[var(--neon)]/5 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--neon)]/10 border border-[var(--neon)]/30 text-[var(--neon)] text-sm font-medium">
              <Zap className="w-4 h-4" />
              Live Betting with Real-Time Odds
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            BET FASTER.
            <br />
            <span className="gradient-text">WIN BIGGER.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Experience the thrill of real-time sports betting with industry-leading odds, 
            instant payouts, and a platform built for speed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              size="lg"
              className="bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90 text-lg px-8 h-14 animate-pulse-glow"
            >
              Start Betting Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:border-[var(--neon)] hover:text-[var(--neon)] text-lg px-8 h-14"
            >
              View All Sports
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Zap, label: 'Live Odds', value: 'Real-Time' },
              { icon: Shield, label: 'Secure', value: '256-bit SSL' },
              { icon: Clock, label: 'Payouts', value: 'Instant' },
              { icon: Trophy, label: 'Sports', value: '50+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl p-4 text-center"
              >
                <stat.icon className="w-6 h-6 text-[var(--neon)] mx-auto mb-2" />
                <p className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
