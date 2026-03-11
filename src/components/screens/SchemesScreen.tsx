import React from 'react';
import { ArrowLeft, Calendar, CheckCircle, TrendingUp, ChevronRight, Plus, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Screen } from '../../types';

interface SchemesScreenProps {
  setScreen: (screen: Screen) => void;
}

export const SchemesScreen = ({ setScreen }: SchemesScreenProps) => {
  const activeSchemes = [
    { id: 1, name: 'Monthly Gold SIP', duration: '12 Months', progress: 40, amount: '₹2,000/mo', goldSaved: '1.25g' },
    { id: 2, name: 'Diwali Special Plan', duration: '24 Months', progress: 75, amount: '₹5,000/mo', goldSaved: '15.4g' },
  ];

  const newPlans = [
    { id: 1, title: 'Daily Savings', desc: 'Start with ₹10/day', img: 'https://picsum.photos/seed/dailygold/200/200' },
    { id: 2, title: 'Wedding Plan', desc: 'Extra 5% bonus gold', img: 'https://picsum.photos/seed/weddinggold/200/200' },
    { id: 3, title: 'Kids Future', desc: 'Long term wealth', img: 'https://picsum.photos/seed/kidsgold/200/200' },
  ];

  return (
    <div className="h-full bg-bg text-white flex flex-col">
      <div className="px-6 py-6 flex items-center gap-4 sticky top-0 z-20 bg-bg/95 backdrop-blur-sm">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-gold"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-display font-bold text-white">My Savings</h2>
      </div>
      
      <div className="flex-1 p-6 space-y-8 overflow-y-auto pb-28">
        
        {/* Hero Banner */}
        <div className="bg-surface smooth-card border border-gold/20 flex items-center justify-between overflow-hidden relative min-h-[140px]">
          <img src="https://picsum.photos/seed/goldbars/400/200" alt="Gold Bars" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" referrerPolicy="no-referrer" />
          <div className="p-6 relative z-10 w-2/3">
            <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Daily Savings</p>
            <h3 className="text-xl font-display font-bold text-white leading-tight mb-2">
              Start your saving Journey in <span className="text-gold">Gold</span>
            </h3>
            <button className="bg-gold text-bg px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              Start Now
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-50">
            <Sparkles className="w-32 h-32 text-gold" />
          </div>
        </div>

        {/* Active Savings */}
        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold text-white">Active Plans</h3>
          {activeSchemes.map(scheme => (
            <div key={scheme.id} className="bg-surface smooth-card border border-gold/20 p-5 space-y-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-bl-full" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="text-base font-display font-bold text-white">{scheme.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{scheme.amount}</p>
                </div>
                <div className="bg-gold/20 text-gold px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-gold/30">
                  {scheme.duration}
                </div>
              </div>
              
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Gold Accumulated</p>
                  <p className="text-lg font-bold text-gold">{scheme.goldSaved}</p>
                </div>
                <div className="text-right w-1/2">
                  <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase mb-1">
                    <span>Progress</span>
                    <span className="text-gold">{scheme.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${scheme.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore New Plans (Horizontal Scroll) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white">Explore Plans</h3>
            <button className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center">
              View All <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-6 px-6">
            {newPlans.map((plan) => (
              <div key={plan.id} className="min-w-[180px] bg-surface rounded-3xl p-3 border border-gold/20 snap-start shadow-lg">
                <img src={plan.img} alt={plan.title} className="w-full h-28 object-cover rounded-2xl mb-3 border border-gold/10" referrerPolicy="no-referrer" />
                <h4 className="text-sm font-bold text-white">{plan.title}</h4>
                <p className="text-[10px] text-text-muted mt-1">{plan.desc}</p>
                <button className="mt-3 w-full py-2 bg-gold/10 text-gold rounded-xl text-xs font-bold uppercase tracking-widest border border-gold/20 hover:bg-gold/20 transition-colors">
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust Banner */}
        <div className="bg-surface p-4 smooth-card border border-gold/20 flex items-center gap-4 justify-center">
          <ShieldCheck className="w-8 h-8 text-gold" />
          <div>
            <p className="text-sm font-bold text-white">100% Safe & Secure</p>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">Powered by Augmont</p>
          </div>
        </div>

      </div>
    </div>
  );
};
