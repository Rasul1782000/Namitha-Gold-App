import React from 'react';
import { ArrowLeft, CreditCard, Smartphone, Building } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Screen } from '../../types';

interface BuyGoldScreenProps {
  setScreen: (screen: Screen) => void;
  goldPrice: number;
  buyAmount: string;
  setBuyAmount: (amount: string) => void;
  handleBuy: () => void;
  loading: boolean;
}

export const BuyGoldScreen = ({
  setScreen,
  goldPrice,
  buyAmount,
  setBuyAmount,
  handleBuy,
  loading
}: BuyGoldScreenProps) => (
  <div className="h-full bg-bg flex flex-col">
    <div className="px-6 py-6 flex items-center gap-4 sticky top-0 z-20 bg-bg/95 backdrop-blur-sm">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-gold"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-display font-bold text-white">Buy Digital Gold</h2>
    </div>
    <div className="flex-1 p-6 space-y-8 overflow-y-auto">
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl border border-gold/20 group">
        <img 
          src="https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&q=80&w=800" 
          alt="Gold Bullion" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent flex flex-col justify-end p-6">
          <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Live Buying Price</p>
          <h3 className="text-3xl font-display font-bold text-white">₹{goldPrice.toLocaleString()} <span className="text-xs font-bold text-gold/60">/ g</span></h3>
        </div>
      </div>

      <div className="space-y-6">
        <Input 
          label="Investment Amount (₹)" 
          placeholder="Min ₹10" 
          value={buyAmount} 
          onChange={(e: any) => setBuyAmount(e.target.value)} 
          icon={CreditCard}
          className="bg-surface border-gold/20 text-white"
        />
        
        <div className="flex justify-between items-center p-5 bg-surface rounded-2xl border border-gold/20">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Estimated Gold</span>
          <span className="text-xl font-bold text-gold">
            {buyAmount ? (Number(buyAmount) / goldPrice).toFixed(4) : '0.0000'} g
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Quick Select</p>
          <div className="grid grid-cols-3 gap-3">
            {[500, 1000, 5000].map((amt) => (
              <button 
                key={amt} 
                onClick={() => setBuyAmount(amt.toString())}
                className="py-3 rounded-xl border border-gold/20 text-sm font-bold text-white hover:border-gold hover:bg-gold/10 transition-all"
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Secure Payment</h4>
        <div className="space-y-3">
          {[
            { id: 'upi', label: 'UPI (PhonePe, GPay)', icon: Smartphone },
            { id: 'card', label: 'Debit / Credit Card', icon: CreditCard },
            { id: 'net', label: 'Net Banking', icon: Building },
          ].map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gold/20 rounded-2xl hover:border-gold cursor-pointer group transition-all bg-surface shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <method.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-white">{method.label}</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-text-muted group-hover:border-gold" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="p-6 border-t border-gold/20 bg-bg">
      <Button onClick={handleBuy} disabled={loading || !buyAmount} className="w-full py-4 bg-gold text-bg font-bold">
        {loading ? 'Processing...' : `Securely Pay ₹${buyAmount || '0'}`}
      </Button>
    </div>
  </div>
);
