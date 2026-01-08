"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Wallet, Trophy, Settings, History, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useBetting } from '@/components/betting-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function ProfileContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  const { user, profile, balance } = useBetting();
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBets() {
      if (!user) return;
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setBets(data);
      }
      setLoading(false);
    }

    fetchBets();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Please log in to view your profile</h1>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Betting
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Profile Card */}
        <div className="space-y-6">
          <Card className="glass-card border-border overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[var(--neon)] to-[var(--neon-secondary)]" />
            <CardContent className="relative pt-12 pb-6 px-6">
              <div className="absolute -top-12 left-6">
                <div className="w-24 h-24 rounded-2xl bg-secondary border-4 border-background flex items-center justify-center text-4xl shadow-xl">
                  {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
              </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{profile?.username || 'User'}</h2>
                  {user.email && !user.email.endsWith('@app.local') && (
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                  )}
                </div>

              <div className="mt-6 flex items-center gap-2 p-4 rounded-xl bg-secondary/50">
                <Wallet className="w-5 h-5 text-[var(--neon)]" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Balance</p>
                  <p className="text-xl font-bold">${balance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Bets</span>
                <span className="font-semibold">{bets.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-semibold text-green-500">64%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Highest Win</span>
                <span className="font-semibold text-[var(--neon)]">$1,240.00</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="bg-secondary/50 p-1 border border-border">
              <TabsTrigger value="overview" className="gap-2">
                <User className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" /> Bet History
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass-card border-border bg-gradient-to-br from-secondary/50 to-transparent">
                  <CardHeader>
                    <Trophy className="w-8 h-8 text-[var(--neon)] mb-2" />
                    <CardTitle>Active Bets</CardTitle>
                    <CardDescription>You have 3 bets currently active</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">View Active</Button>
                  </CardContent>
                </Card>
                <Card className="glass-card border-border bg-gradient-to-br from-secondary/50 to-transparent">
                  <CardHeader>
                    <History className="w-8 h-8 text-[var(--neon-secondary)] mb-2" />
                    <CardTitle>Last 7 Days</CardTitle>
                    <CardDescription>Your betting activity this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-[var(--neon)] w-[70%]" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">12 bets placed, $450 total stake</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bets.slice(0, 3).map((bet) => (
                      <div key={bet.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-[var(--neon)]" />
                          </div>
                          <div>
                            <p className="font-semibold">{bet.selection.toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">{new Date(bet.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${bet.stake}</p>
                          <Badge variant={bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'}>
                            {bet.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {bets.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent activity found.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="glass-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All your placed bets and their outcomes</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" /> Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-4 font-semibold text-muted-foreground">Match/Selection</th>
                          <th className="py-4 font-semibold text-muted-foreground">Odds</th>
                          <th className="py-4 font-semibold text-muted-foreground">Stake</th>
                          <th className="py-4 font-semibold text-muted-foreground">Status</th>
                          <th className="py-4 font-semibold text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bets.map((bet) => (
                          <tr key={bet.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                            <td className="py-4">
                              <p className="font-medium">{bet.selection.toUpperCase()}</p>
                              <p className="text-xs text-muted-foreground">Match ID: {bet.match_id.slice(0, 8)}...</p>
                            </td>
                            <td className="py-4 font-mono">{bet.odds}</td>
                            <td className="py-4 font-bold">${bet.stake}</td>
                            <td className="py-4">
                              <Badge variant={bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'}>
                                {bet.status}
                              </Badge>
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              {new Date(bet.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {bets.length === 0 && (
                      <div className="text-center py-20 text-muted-foreground">
                        No bets placed yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your profile and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Username</label>
                      <input 
                        type="text" 
                        defaultValue={profile?.username}
                        className="w-full p-2 rounded-lg bg-secondary border border-border focus:border-[var(--neon)] outline-none" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input 
                        type="email" 
                        value={user.email} 
                        disabled 
                        className="w-full p-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button className="bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="mt-32 text-center">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}