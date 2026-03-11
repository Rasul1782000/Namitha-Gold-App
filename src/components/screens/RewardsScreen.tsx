import React from 'react';
import { ArrowLeft, TrendingUp, Share2, Copy, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { MOCK_REWARDS } from '../../constants';
import { Screen } from '../../types';

interface RewardsScreenProps {
  setScreen: (screen: Screen) => void;
}

export const RewardsScreen = ({
  setScreen
}: RewardsScreenProps) => (
  <div className="h-full bg-bg text-white flex flex-col">
    <div className="px-6 py-6 flex items-center gap-4 sticky top-0 z-20">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-gold"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-display font-bold text-white">Rewards</h2>
    </div>
    
    <div className="flex-1 overflow-y-auto pb-28 p-6 space-y-8">
      {/* Rewards Balance */}
      <div className="bg-surface p-6 smooth-card border border-gold/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20">
          <Sparkles className="w-24 h-24 text-gold" />
        </div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Reward Gold Earned</p>
        <div className="flex items-baseline gap-2 mb-4">
          <h3 className="text-4xl font-display font-bold text-gold">0.2500</h3>
          <span className="text-sm font-bold text-text-muted">g</span>
        </div>
        <div className="flex items-center gap-2 text-white font-bold text-sm bg-gold/20 px-3 py-1 rounded-full w-fit">
          <TrendingUp className="w-4 h-4" />
          Value: ₹1,550
        </div>
      </div>

      {/* Referral Program */}
      <div className="bg-surface p-6 smooth-card border border-gold/20 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gold/20 rounded-3xl flex items-center justify-center text-gold shadow-lg">
            <Share2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold text-white">Invite & Earn</h4>
            <p className="text-[10px] text-text-muted font-bold uppercase">Get 0.1g for every referral</p>
          </div>
        </div>
        
        <div className="bg-bg p-4 rounded-2xl flex items-center justify-between border border-gold/20">
          <span className="text-lg font-mono font-bold text-gold">NAMITHA100</span>
          <button className="text-gold hover:bg-gold/10 p-3 rounded-xl transition-colors">
            <Copy className="w-6 h-6" />
          </button>
        </div>
        
        <Button className="w-full py-4 text-sm font-bold bg-gold text-white">Share Referral Link</Button>
      </div>

      {/* Reward History */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Reward History</p>
        <div className="space-y-4">
          {MOCK_REWARDS.map((reward, i) => (
            <div key={i} className="bg-surface p-5 smooth-card border border-gold/20 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-display font-bold text-white">{reward.type}</p>
                <p className="text-[10px] text-text-muted font-bold uppercase">{reward.date}</p>
              </div>
              <p className="text-sm font-bold text-gold">+{reward.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
