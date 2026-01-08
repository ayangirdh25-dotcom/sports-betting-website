"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function AuthModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast.error('Please confirm your email address before logging in. Check your inbox!');
          } else {
            throw error;
          }
          return;
        }
        toast.success('Successfully logged in!');
        setOpen(false);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });
        if (error) throw error;
        
        if (data.user && data.session === null) {
          setSignupSuccess(true);
          toast.success('Account created! Please check your email.');
        } else {
          toast.success('Account created and logged in!');
          setOpen(false);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSignupSuccess(false);
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
            {signupSuccess ? 'Check Your Email' : isLogin ? 'Login' : 'Sign Up'}
          </DialogTitle>
        </DialogHeader>

        {signupSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Account Created!</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation link to <strong>{email}</strong>. 
                Please click the link in the email to verify your account and start betting.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSignupSuccess(false);
                setIsLogin(true);
              }}
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4 pt-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {!isLogin && (
                <p className="text-[10px] text-muted-foreground">
                  Password must be at least 6 characters long.
                </p>
              )}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
