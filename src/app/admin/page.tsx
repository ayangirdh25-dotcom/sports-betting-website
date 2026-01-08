"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useBetting } from '@/components/betting-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Key, Globe, Settings, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface ApiConfig {
  id: string;
  name: string;
  provider_type: string;
  api_key: string;
  base_url: string;
  is_active: boolean;
}

export default function AdminPage() {
  const { profile, loading: authLoading } = useBetting();
  const router = useRouter();
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [newConfig, setNewConfig] = useState<Partial<ApiConfig>>({
    name: '',
    provider_type: 'the-odds-api',
    api_key: '',
    base_url: 'https://api.the-odds-api.com',
    is_active: false
  });

    useEffect(() => {
      const checkAdmin = async () => {
        // Only redirect if loading is finished
        if (!authLoading) {
          // If no profile or not an admin, we might need to redirect
          // But first, let's make sure we don't even have a user session
          // because the profile might still be null if there was an error fetching it
          if (!profile || profile.role !== 'admin') {
            // Give it a tiny bit more time or just check if user exists
            // If there's no profile at all after loading, redirect
            router.replace('/');
            return;
          }
          fetchConfigs();
        }
      };
      checkAdmin();
    }, [profile, authLoading, router]);

  async function fetchConfigs() {
    const { data, error } = await supabase
      .from('api_configurations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch configurations');
    } else {
      setConfigs(data || []);
    }
    setLoading(false);
  }

  async function handleAddConfig() {
    if (!newConfig.name || !newConfig.api_key) {
      toast.error('Name and API Key are required');
      return;
    }

    const { error } = await supabase
      .from('api_configurations')
      .insert([newConfig]);

    if (error) {
      toast.error('Failed to add configuration');
    } else {
      toast.success('Configuration added');
      setNewConfig({
        name: '',
        provider_type: 'the-odds-api',
        api_key: '',
        base_url: 'https://api.the-odds-api.com',
        is_active: false
      });
      fetchConfigs();
    }
  }

  async function handleToggleActive(id: string, active: boolean) {
    if (active) {
      await supabase
        .from('api_configurations')
        .update({ is_active: false })
        .neq('id', id);
    }

    const { error } = await supabase
      .from('api_configurations')
      .update({ is_active: active })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      fetchConfigs();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('api_configurations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete configuration');
    } else {
      toast.success('Configuration deleted');
      fetchConfigs();
    }
  }

  const [editingConfig, setEditingConfig] = useState<string | null>(null);

  async function handleUpdateConfig(config: ApiConfig) {
    const { error } = await supabase
      .from('api_configurations')
      .update({
        name: config.name,
        provider_type: config.provider_type,
        api_key: config.api_key,
        base_url: config.base_url,
      })
      .eq('id', config.id);

    if (error) {
      toast.error('Failed to update configuration');
    } else {
      toast.success('Configuration updated');
      setEditingConfig(null);
      fetchConfigs();
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--neon)]"></div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return null; // Let the useEffect handle redirection
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      <div className="container mx-auto py-10 pt-24">
        {/* Admin Header Banner */}
        <div className="mb-8 p-4 rounded-xl bg-[var(--neon)]/10 border border-[var(--neon)]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--neon)]/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[var(--neon)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--neon)] uppercase tracking-wider">Secure Administrative Session</p>
              <p className="text-xs text-muted-foreground">Logged in as: <span className="text-foreground font-medium">{profile?.username}</span></p>
            </div>
          </div>
          <div className="hidden md:block px-3 py-1 rounded-full bg-secondary/50 border border-border text-[10px] font-bold uppercase tracking-tighter">
            System Administrator
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-extrabold mb-2 tracking-tighter" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              ADMIN <span className="text-[var(--neon)]">DASHBOARD</span>
            </h1>
            <p className="text-muted-foreground">Core system configurations and API management.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card border-border shadow-2xl shadow-black/50">
              <CardHeader className="border-b border-border/50 bg-white/5">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[var(--neon)]" />
                  Add New API Provider
                </CardTitle>
                <CardDescription>Configure a new sports data source for the system.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Provider Name</Label>
                    <Input 
                      placeholder="e.g. The Odds API" 
                      value={newConfig.name}
                      onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
                      className="bg-secondary/30 border-border/50 focus:border-[var(--neon)]/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Provider Type</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm focus:border-[var(--neon)]/50 outline-none transition-colors"
                      value={newConfig.provider_type}
                      onChange={(e) => setNewConfig({...newConfig, provider_type: e.target.value})}
                    >
                      <option value="the-odds-api">The Odds API</option>
                      <option value="rapidapi-sports">RapidAPI Sports</option>
                      <option value="custom">Custom JSON API</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">API Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password"
                        placeholder="••••••••••••••••" 
                        className="pl-10 bg-secondary/30 border-border/50 focus:border-[var(--neon)]/50 transition-colors"
                        value={newConfig.api_key}
                        onChange={(e) => setNewConfig({...newConfig, api_key: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Base URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="https://api..." 
                        className="pl-10 bg-secondary/30 border-border/50 focus:border-[var(--neon)]/50 transition-colors"
                        value={newConfig.base_url}
                        onChange={(e) => setNewConfig({...newConfig, base_url: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  className="mt-8 w-full md:w-auto bg-[var(--neon)] text-black font-bold hover:bg-[var(--neon)]/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleAddConfig}
                >
                  <Save className="w-4 h-4 mr-2" />
                  SAVE CONFIGURATION
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>ACTIVE CONFIGURATIONS</h2>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 glass-card rounded-xl border-dashed">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon)] mb-4"></div>
                  <p className="text-muted-foreground animate-pulse">Retrieving system configurations...</p>
                </div>
              ) : configs.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl border-dashed border-border/50 text-muted-foreground">
                  No configurations found in the system.
                </div>
              ) : (
                  <div className="grid gap-4">
                    {configs.map((config) => (
                      <Card key={config.id} className={`glass-card border-border overflow-hidden transition-all hover:border-[var(--neon)]/30 ${config.is_active ? 'bg-[var(--neon)]/[0.02]' : ''}`}>
                        {editingConfig === config.id ? (
                          <div className="p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Name</Label>
                                <Input 
                                  value={config.name}
                                  onChange={(e) => {
                                    const updated = configs.map(c => c.id === config.id ? { ...c, name: e.target.value } : c);
                                    setConfigs(updated);
                                  }}
                                  className="bg-secondary/30"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">API Key</Label>
                                <Input 
                                  value={config.api_key}
                                  onChange={(e) => {
                                    const updated = configs.map(c => c.id === config.id ? { ...c, api_key: e.target.value } : c);
                                    setConfigs(updated);
                                  }}
                                  className="bg-secondary/30"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleUpdateConfig(config)} className="bg-[var(--neon)] text-black font-bold">
                                Save Changes
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingConfig(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4">
                            <div className="flex items-center gap-4">
                              <div className={`p-4 rounded-xl ${config.is_active ? 'bg-[var(--neon)]/20 text-[var(--neon)] ring-1 ring-[var(--neon)]/30' : 'bg-secondary text-muted-foreground'}`}>
                                <Settings className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-lg leading-none">{config.name}</h3>
                                  {config.is_active && <span className="text-[10px] bg-[var(--neon)]/20 text-[var(--neon)] px-1.5 py-0.5 rounded font-bold uppercase">Live</span>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 font-mono opacity-70">{config.provider_type} • {config.base_url}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/20 border border-border/50">
                                <Label htmlFor={`active-${config.id}`} className="text-xs font-bold uppercase cursor-pointer">Status</Label>
                                <Switch 
                                  id={`active-${config.id}`}
                                  checked={config.is_active}
                                  onCheckedChange={(checked) => handleToggleActive(config.id, checked)}
                                />
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => setEditingConfig(config.id)} className="text-muted-foreground hover:text-foreground">
                                <Plus className="w-5 h-5 rotate-45" /> {/* Using Plus rotated as a settings/edit icon alternative since I don't have Edit icon imported yet, oh wait I do have Settings */}
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => handleDelete(config.id)}>
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <Card className="glass-card border-border bg-gradient-to-br from-secondary/50 to-background">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>Database Connection</span>
                    <span className="text-emerald-500">Stable</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>API Response Time</span>
                    <span className="text-[var(--neon)]">Optimal</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--neon)] w-[85%] shadow-[0_0_10px_rgba(var(--neon-rgb),0.5)]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border overflow-hidden">
              <div className="p-1 bg-[var(--neon)]"></div>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest">Admin Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start border-border/50 hover:border-[var(--neon)]/50">
                  <ShieldCheck className="w-4 h-4 mr-2 text-[var(--neon)]" />
                  View System Logs
                </Button>
                <Button variant="outline" className="justify-start border-border/50 hover:border-[var(--neon)]/50">
                  <Settings className="w-4 h-4 mr-2 text-[var(--neon)]" />
                  Global Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
