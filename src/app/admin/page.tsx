"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Key, Globe, Settings, Save } from 'lucide-react';
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
    fetchConfigs();
  }, []);

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
    // Deactivate all others first if we want only one active
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

  return (
    <div className="container mx-auto py-10 pt-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>ADMIN PANEL</h1>
          <p className="text-muted-foreground">Manage your sports data API keys and configurations securely.</p>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[var(--neon)]" />
              Add New API Provider
            </CardTitle>
            <CardDescription>Configure a new sports data source.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider Name</Label>
                <Input 
                  placeholder="e.g. The Odds API" 
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Provider Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newConfig.provider_type}
                  onChange={(e) => setNewConfig({...newConfig, provider_type: e.target.value})}
                >
                  <option value="the-odds-api">The Odds API</option>
                  <option value="rapidapi-sports">RapidAPI Sports</option>
                  <option value="custom">Custom JSON API</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password"
                    placeholder="Enter API Key" 
                    className="pl-10 bg-secondary/50"
                    value={newConfig.api_key}
                    onChange={(e) => setNewConfig({...newConfig, api_key: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Base URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="https://api..." 
                    className="pl-10 bg-secondary/50"
                    value={newConfig.base_url}
                    onChange={(e) => setNewConfig({...newConfig, base_url: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <Button 
              className="mt-6 bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90"
              onClick={handleAddConfig}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>ACTIVE CONFIGURATIONS</h2>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading configurations...</div>
          ) : configs.length === 0 ? (
            <div className="text-center py-10 glass-card rounded-xl text-muted-foreground">No configurations found.</div>
          ) : (
            configs.map((config) => (
              <Card key={config.id} className="glass-card border-border overflow-hidden">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${config.is_active ? 'bg-[var(--neon)]/20 text-[var(--neon)]' : 'bg-secondary text-muted-foreground'}`}>
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{config.name}</h3>
                      <p className="text-sm text-muted-foreground">{config.provider_type} • {config.base_url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${config.id}`} className="text-sm">Active</Label>
                      <Switch 
                        id={`active-${config.id}`}
                        checked={config.is_active}
                        onCheckedChange={(checked) => handleToggleActive(config.id, checked)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(config.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
