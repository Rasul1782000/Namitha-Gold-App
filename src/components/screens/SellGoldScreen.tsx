import React from 'react';
import { ArrowLeft, Wallet, Building, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { UserData, Screen } from '../../types';

interface SellGoldScreenProps {
  setScreen: (screen: Screen) => void;
  goldPrice: number;
  user: UserData | null;
  sellAmount: string;
  setSellAmount: (amount: string) => void;
  handleSell: () => void;
  loading: boolean;
}

export const SellGoldScreen = ({
  setScreen,
  goldPrice,
  user,
  sellAmount,
  setSellAmount,
  handleSell,
  loading
}: SellGoldScreenProps) => (
  <div className="h-full bg-white flex flex-col">
    <div className="px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-serif font-bold text-burgundy">Sell Digital Gold</h2>
    </div>
    <div className="flex-1 p-6 space-y-8 overflow-y-auto">
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
        <img 
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
          alt="Sell Gold" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-orange-600/40 to-transparent flex flex-col justify-end p-6">
          <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Live Selling Price</p>
          <h3 className="text-3xl font-serif font-bold text-white">₹{(goldPrice * 0.97).toLocaleString()} <span className="text-xs font-bold text-white/60">/ g</span></h3>
          <p className="text-[8px] text-white/60 mt-1">* 3% spread applied for processing</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Balance</span>
          <span className="text-sm font-bold text-burgundy">{user?.gold_balance.toFixed(4)} g</span>
        </div>
        
        <Input 
          label="Sell Amount (₹)" 
          placeholder="Min ₹100" 
          value={sellAmount} 
          onChange={(e: any) => setSellAmount(e.target.value)} 
          icon={Wallet}
        />
        
        <div className="flex justify-between items-center p-5 bg-orange-50 rounded-2xl border-2 border-orange-100">
          <span className="text-xs font-bold text-orange-800 uppercase tracking-widest">Gold to Deduct</span>
          <span className="text-xl font-bold text-orange-800">
            {sellAmount ? (Number(sellAmount) / (goldPrice * 0.97)).toFixed(4) : '0.0000'} g
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">Credit To</h4>
        <div className="p-4 border-2 border-burgundy rounded-2xl bg-burgundy/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-burgundy rounded-xl flex items-center justify-center text-white">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-burgundy">HDFC Bank **** 4321</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Primary Account</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-burgundy ml-auto" />
        </div>
      </div>
    </div>
    <div className="p-6 border-t-2 border-gray-50">
      <Button onClick={handleSell} disabled={loading || !sellAmount} variant="secondary">
        {loading ? 'Processing...' : `Sell & Credit ₹${sellAmount || '0'}`}
      </Button>
    </div>
  </div>
);
