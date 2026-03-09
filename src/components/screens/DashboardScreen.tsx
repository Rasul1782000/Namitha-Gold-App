import React, { useEffect } from 'react';
import { 
  User, 
  Bell, 
  TrendingUp, 
  Coins, 
  Wallet, 
  Plus, 
  Minus, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { gsap } from 'gsap';
import { Card } from '../common/Card';
import { FEATURED_COLLECTION, GOLD_HISTORY } from '../../constants';
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
  useEffect(() => {
    const card = document.querySelector(".spotlight-card");
    if (card) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gsap.to(".spotlight", {
          x,
          y,
          duration: 0.2,
          ease: "power2.out"
        });
      };
      card.addEventListener("mousemove", handleMouseMove as any);
      return () => card.removeEventListener("mousemove", handleMouseMove as any);
    }
  }, []);

  return (
    <div className="h-full bg-[#FDFCF0]/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-burgundy px-5 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-gold/30">
            <User className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-[8px] text-gold font-bold uppercase tracking-widest">Premium Member</p>
            <p className="text-base font-serif font-bold text-white">{user?.name || 'User'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gold border border-gold/20">
            <Bell className="w-4 h-4" />
          </button>
          <button onClick={() => setScreen('profile')} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gold border border-gold/20">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Live Gold Price Section - Compact */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <h3 className="text-[9px] font-bold text-burgundy uppercase tracking-widest">Market Overview</h3>
            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">LIVE</span>
          </div>
          <Card className="bg-white border-2 border-burgundy/10 p-0 overflow-hidden relative spotlight-card shadow-md h-40">
            <img 
              src="https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=800" 
              alt="Gold Market" 
              className="absolute inset-0 w-full h-full object-cover opacity-10"
              referrerPolicy="no-referrer"
            />
            <div className="spotlight absolute w-40 h-40 bg-burgundy/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="p-4 flex justify-between items-center relative z-10">
              <div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">24K Gold Price</p>
                <div className="flex items-baseline gap-1.5">
                  <h2 className="text-2xl font-serif font-bold text-burgundy">₹{goldPrice.toLocaleString()}</h2>
                  <span className="text-[10px] font-bold text-gray-400">/ g</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs justify-end">
                  <TrendingUp className="w-3 h-3" />
                  +₹45.20
                </div>
              </div>
            </div>
            <div className="h-16 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GOLD_HISTORY}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#600000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#600000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="price" stroke="#600000" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Featured Collection */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[9px] font-bold text-burgundy uppercase tracking-widest">Featured Collection</h3>
            <button className="text-[8px] font-bold text-burgundy underline uppercase tracking-widest">Explore</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {FEATURED_COLLECTION.map((item, i) => (
              <div key={i} className="shrink-0 w-40 space-y-2">
                <div className="h-48 rounded-2xl overflow-hidden shadow-md border border-burgundy/5">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[10px] font-bold text-burgundy uppercase tracking-widest text-center">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Section - Compact */}
        <div className="space-y-2">
          <h3 className="text-[9px] font-bold text-burgundy uppercase tracking-widest">My Portfolio</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-burgundy border-none text-white p-4 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mb-1">
                <Coins className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-[8px] font-bold text-gold uppercase tracking-widest">Gold Balance</p>
                <h4 className="text-lg font-bold">{user?.gold_balance.toFixed(4)} g</h4>
              </div>
            </Card>
            <Card className="bg-gold border-none text-white p-4 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mb-1">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[8px] font-bold text-white/80 uppercase tracking-widest">Total Value</p>
                <h4 className="text-lg font-bold">₹{((user?.gold_balance || 0) * goldPrice).toLocaleString()}</h4>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Grid - Compact */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setScreen('buy')} className="bg-white p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all group">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-burgundy uppercase tracking-widest">Buy Gold</span>
          </button>
          <button onClick={() => setScreen('sell')} className="bg-white p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all group">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
              <Minus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-burgundy uppercase tracking-widest">Sell Gold</span>
          </button>
          <button onClick={() => setScreen('sip')} className="bg-white p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all group">
            <div className="w-10 h-10 bg-burgundy/5 rounded-full flex items-center justify-center text-burgundy group-hover:bg-burgundy/10 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-burgundy uppercase tracking-widest">Gold SIP</span>
          </button>
          <button onClick={() => setScreen('redeem')} className="bg-white p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all group">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-burgundy uppercase tracking-widest">Redeem</span>
          </button>
        </div>

        {/* Promotional Banner - HD IMAGE */}
        <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
            alt="Promotion" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy/80 to-transparent flex flex-col justify-center p-6">
            <p className="text-[8px] font-bold text-gold uppercase tracking-widest mb-1">Limited Offer</p>
            <h4 className="text-white font-serif font-bold text-lg leading-tight">Get 0.5% Extra Gold<br/>on your first SIP</h4>
          </div>
        </div>

        {/* AI Advisor - Compact */}
        <div className="bg-burgundy p-4 rounded-xl text-white relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-16 h-16" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-burgundy" />
              </div>
              <h4 className="text-[8px] font-extrabold text-gold uppercase tracking-widest">AI Market Insight</h4>
            </div>
            <p className="text-xs font-medium leading-relaxed italic">
              "{aiInsight}"
            </p>
          </div>
        </div>

        {/* SIP Plans - Compact */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[9px] font-bold text-burgundy uppercase tracking-widest">Active SIP Plans</h3>
            <button onClick={() => setScreen('sip')} className="text-[8px] font-bold text-burgundy underline uppercase tracking-widest">View All</button>
          </div>
          {activeSips.length > 0 ? (
            activeSips.slice(0, 1).map(sip => (
              <Card key={sip.id} className="p-3 border-l-4 border-l-gold">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-burgundy/5 rounded-full flex items-center justify-center text-burgundy">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-burgundy capitalize">{sip.frequency} Savings</p>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">Next: {sip.next_date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-burgundy">₹{sip.amount.toLocaleString()}</p>
                    <p className="text-[8px] text-emerald-600 font-bold uppercase">{sip.status}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4 text-center border-dashed border-2 border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase">No active SIPs</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
