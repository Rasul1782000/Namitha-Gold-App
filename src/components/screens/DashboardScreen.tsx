import React from 'react';
import { 
  User, 
  Bell, 
  TrendingUp, 
  Coins, 
  Wallet, 
  Plus, 
  Minus, 
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Card } from '../common/Card';
import { UserData, SIP, Screen } from '../../types';

interface DashboardScreenProps {
  user: UserData | null;
  goldPrice: number;
  aiInsight: string;
  activeSips: SIP[];
  setScreen: (screen: Screen) => void;
}

export const DashboardScreen = ({
  user,
  goldPrice,
  aiInsight,
  activeSips,
  setScreen
}: DashboardScreenProps) => {
  return (
    <div className="h-full bg-bg text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center border border-gold/30">
            <User className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Premium User</p>
            <p className="text-lg font-display font-bold text-white">{user?.name || 'User'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-surface rounded-2xl flex items-center justify-center text-gold">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
        {/* Savings Balance */}
        <div className="bg-surface p-6 smooth-card text-white relative overflow-hidden shadow-xl border border-gold/20">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Your Savings in 24K Gold</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-display font-bold text-gold">₹{((user?.gold_balance || 0) * goldPrice).toLocaleString()}</h2>
          </div>
          <p className="text-sm text-text-muted mt-1">into {user?.gold_balance.toFixed(4)} gm of gold</p>
          <div className="flex items-center gap-2 text-white font-bold text-sm mt-4 bg-gold/20 px-3 py-1 rounded-full w-fit">
            Gold buy price: ₹{goldPrice.toLocaleString()}
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Coins, label: 'Lease Gold', screen: 'buy' },
            { icon: Sparkles, label: 'Refer', screen: 'refer' },
            { icon: TrendingUp, label: 'Transaction', screen: 'transaction' },
            { icon: Wallet, label: 'Withdraw', screen: 'withdraw' },
          ].map((action, i) => (
            <button key={i} onClick={() => setScreen(action.screen as Screen)} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-surface rounded-3xl flex items-center justify-center text-gold shadow-md">
                <action.icon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Banner with Image */}
        <div className="bg-surface smooth-card border border-gold/20 flex items-center justify-between overflow-hidden relative min-h-[120px]">
          <img src="https://picsum.photos/seed/golddelivery/400/200" alt="Delivery" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" referrerPolicy="no-referrer" />
          <div className="p-6 relative z-10 w-2/3">
            <p className="text-sm font-medium leading-relaxed text-white">
              Buy and get 24K pure gold delivered at your doorstep.
            </p>
          </div>
          <div className="pr-6 relative z-10">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-bg" />
            </div>
          </div>
        </div>

        {/* Flashcards / Horizontal Scroll */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white">Popular Coins</h3>
            <button className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center">
              See All <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-6 px-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="min-w-[160px] bg-surface rounded-3xl p-3 border border-gold/20 snap-start shadow-lg">
                <img src={`https://picsum.photos/seed/goldcoin${item}/200/200`} alt="Gold Coin" className="w-full h-32 object-cover rounded-2xl mb-3 border border-gold/10" referrerPolicy="no-referrer" />
                <p className="text-sm font-bold text-white">Augmont Coin 1gm</p>
                <p className="text-[10px] text-text-muted uppercase mt-1">24K | 99.9% pure</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gold">₹6,137</span>
                  <button className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Offer */}
        <div className="bg-surface p-4 smooth-card border border-gold/20 flex items-center justify-between relative overflow-hidden">
          <img src="https://picsum.photos/seed/offer/400/100" alt="Offer" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" referrerPolicy="no-referrer" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-gold/20 rounded-xl text-gold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Today's Offer</p>
              <p className="text-[10px] text-text-muted">Save for 0.5gm Gold, win upto ₹250</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
