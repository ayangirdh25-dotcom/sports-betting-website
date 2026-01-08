"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function AuthModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const cleanUsername = username.trim().toLowerCase();
      
      if (!cleanUsername) {
        toast.error('Username is required');
        return;
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      setLoading(true);
      const virtualEmail = `${cleanUsername}@app.local`;

      try {
        if (isLogin) {
          const { data, error } = await supabase.auth.signInWithPassword({ 
            email: virtualEmail, 
            password 
          });
          if (error) {
            if (error.message.includes('Invalid login credentials')) {
              throw new Error('Invalid username or password');
            }
            throw error;
          }

          // Check for admin role and redirect
          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.user.id)
              .single();
            
            if (profile?.role === 'admin') {
              router.push('/admin');
            }
          }

          toast.success('Successfully logged in!');
          setOpen(false);
        } else {
          // Sign up via API to auto-confirm
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: cleanUsername, password }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to create account');
          }

          // Auto login after signup
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: virtualEmail,
            password
          });

          if (loginError) throw loginError;

          toast.success('Account created and logged in!');
          setOpen(false);
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setIsLogin(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Login / Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? 'Login' : 'Sign Up'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAuth} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
