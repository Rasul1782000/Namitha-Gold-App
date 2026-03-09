import React from 'react';
import { ArrowLeft, Package, Store } from 'lucide-react';
import { UserData, Screen } from '../../types';

interface RedeemGoldScreenProps {
  setScreen: (screen: Screen) => void;
  user: UserData | null;
}

export const RedeemGoldScreen = ({
  setScreen,
  user
}: RedeemGoldScreenProps) => (
  <div className="h-full bg-white flex flex-col">
    <div className="px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-serif font-bold text-burgundy">Redeem Gold</h2>
    </div>
    <div className="flex-1 p-6 space-y-8 overflow-y-auto">
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
        <img 
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
          alt="Gold Redemption" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gold via-gold/40 to-transparent flex flex-col justify-end p-6">
          <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Available for Redemption</p>
          <h3 className="text-3xl font-serif font-bold text-white">{user?.gold_balance.toFixed(4)} g</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white p-6 rounded-3xl border-2 border-gray-50 shadow-sm hover:border-burgundy transition-all text-center space-y-3 group overflow-hidden relative">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
            <img src="https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=200" alt="Coins" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center text-burgundy mx-auto group-hover:bg-burgundy group-hover:text-white transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-burgundy uppercase tracking-widest mt-3">Physical Coins</p>
            <p className="text-[8px] text-gray-400 font-bold uppercase">Doorstep Delivery</p>
          </div>
        </button>
        
        <button className="bg-white p-6 rounded-3xl border-2 border-gray-50 shadow-sm hover:border-burgundy transition-all text-center space-y-3 group overflow-hidden relative">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200" alt="Jewelry" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center text-burgundy mx-auto group-hover:bg-burgundy group-hover:text-white transition-colors">
              <Store className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-burgundy uppercase tracking-widest mt-3">Jewelry</p>
            <p className="text-[8px] text-gray-400 font-bold uppercase">At Store Outlet</p>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">Popular Coins</h4>
        <div className="space-y-3">
          {[
            { weight: '1g', type: '24K Gold Coin', price: '₹6,800', img: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=100' },
            { weight: '2g', type: '24K Gold Coin', price: '₹13,500', img: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=100' },
            { weight: '5g', type: '24K Gold Bar', price: '₹33,200', img: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=100' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border-2 border-gray-50 flex items-center justify-between shadow-sm group hover:border-gold transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                  <img src={item.img} alt={item.type} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-bold text-burgundy">{item.weight} {item.type}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Making charges: ₹450</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-burgundy">{item.price}</p>
                <button className="text-[10px] font-black text-gold uppercase tracking-widest mt-1">Select</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
