import React from 'react';
import { Coins, User, Bell, Smartphone, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface AuthScreenProps {
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  handleAuth: () => void;
  loading: boolean;
}

export const AuthScreen = ({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  phone,
  setPhone,
  handleAuth,
  loading
}: AuthScreenProps) => (
  <div className="h-full bg-white flex flex-col overflow-y-auto">
    {/* Hero Header */}
    <div className="h-64 relative shrink-0">
      <img 
        src="https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&q=80&w=1200" 
        alt="Gold Jewelry"
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-burgundy/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-4">
          <Coins className="w-8 h-8 text-gold" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
          Namitha Jewellers
        </h1>
      </div>
    </div>

    <div className="flex-1 p-8 -mt-8 bg-white rounded-t-[32px] relative z-10 space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-burgundy mb-2">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500 font-medium text-sm">
          {authMode === 'login' ? 'Access your premium gold holdings' : 'Join thousands of smart gold investors'}
        </p>
      </div>

      <div className="space-y-5">
        {authMode === 'signup' && (
          <Input label="Full Name" placeholder="Enter your name" value={name} onChange={(e: any) => setName(e.target.value)} icon={User} />
        )}
        <Input label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} icon={Bell} />
        {authMode === 'signup' && (
          <Input label="Phone Number" placeholder="98765 43210" value={phone} onChange={(e: any) => setPhone(e.target.value)} icon={Smartphone} />
        )}
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} icon={ShieldCheck} />
      </div>

      <div className="space-y-4 pt-4">
        <Button onClick={handleAuth} disabled={loading}>
          {loading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign Up'}
        </Button>
        
        {authMode === 'login' && (
          <button 
            onClick={() => {
              setEmail('test@example.com');
              setPassword('password123');
            }}
            className="w-full py-3 text-xs font-bold text-burgundy/60 uppercase tracking-widest hover:text-burgundy transition-colors"
          >
            Use Demo Credentials
          </button>
        )}

        <div className="pt-4 text-center">
          <button 
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-sm font-bold text-gray-500 uppercase tracking-widest"
          >
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <span className="text-burgundy underline decoration-gold decoration-2 underline-offset-4">
              {authMode === 'login' ? 'Register' : 'Login'}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
