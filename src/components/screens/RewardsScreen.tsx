import React from 'react';
import { ArrowLeft, TrendingUp, Share2, Copy, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Screen } from '../../types';

interface RewardsScreenProps {
  setScreen: (screen: Screen) => void;
}

export const RewardsScreen = ({
  setScreen
}: RewardsScreenProps) => (
  <div className="h-full bg-gray-50 flex flex-col">
    <div className="bg-white px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-serif font-bold text-burgundy">Rewards</h2>
    </div>
    
    <div className="flex-1 overflow-y-auto pb-28">
      {/* Rewards Balance */}
      <div className="p-6">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800" 
            alt="Rewards" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-burgundy/40 to-transparent flex flex-col justify-end p-6">
            <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Reward Gold Earned</p>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-3xl font-serif font-bold text-white">0.2500</h3>
              <span className="text-xs font-bold text-gold">g</span>
            </div>
            <div className="flex items-center gap-2 text-gold/80">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Value: ₹1,550</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Program */}
      <div className="px-6 space-y-4">
        <div className="bg-white p-6 rounded-3xl border-2 border-burgundy/10 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center text-burgundy">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-burgundy">Invite & Earn Free Gold</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Get 0.1g for every referral</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
            <span className="text-sm font-mono font-bold text-burgundy">NAMITHA100</span>
            <button className="text-burgundy hover:bg-burgundy/5 p-2 rounded-lg transition-colors">
              <Copy className="w-5 h-5" />
            </button>
          </div>
          
          <Button className="w-full py-4 text-sm font-bold">Share Referral Link</Button>
        </div>
      </div>

      {/* Campaigns */}
      <div className="p-6 space-y-4">
        <p className="text-xs font-bold text-burgundy uppercase tracking-widest ml-1">Active Offers</p>
        <div className="bg-emerald-50 p-5 rounded-3xl border-2 border-emerald-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">Festival Bonus</h4>
            <p className="text-[10px] text-emerald-700 font-bold uppercase">Buy ₹5000+ get 0.02g free</p>
          </div>
        </div>
      </div>

      {/* Reward History */}
      <div className="px-6 space-y-4">
        <p className="text-xs font-bold text-burgundy uppercase tracking-widest ml-1">Reward History</p>
        <div className="space-y-3">
          {[
            { type: 'Referral Bonus', amount: '0.1000 g', date: '10 Mar 2024' },
            { type: 'Festival Offer', amount: '0.0500 g', date: '08 Mar 2024' },
            { type: 'Signup Bonus', amount: '0.1000 g', date: '01 Mar 2024' },
          ].map((reward, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border-2 border-gray-50 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-bold text-burgundy">{reward.type}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{reward.date}</p>
              </div>
              <p className="text-sm font-bold text-emerald-600">+{reward.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
