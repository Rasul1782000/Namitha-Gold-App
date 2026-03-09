import React from 'react';
import { ArrowLeft, Calendar, Pause, Trash2, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { cn } from '../../lib/utils';
import { SIP, Screen } from '../../types';

interface SIPGoldScreenProps {
  setScreen: (screen: Screen) => void;
  activeSips: SIP[];
  sipAmount: string;
  setSipAmount: (amount: string) => void;
  sipFrequency: 'daily' | 'weekly' | 'monthly';
  setSipFrequency: (freq: 'daily' | 'weekly' | 'monthly') => void;
  handleCreateSIP: () => void;
  loading: boolean;
}

export const SIPGoldScreen = ({
  setScreen,
  activeSips,
  sipAmount,
  setSipAmount,
  sipFrequency,
  setSipFrequency,
  handleCreateSIP,
  loading
}: SIPGoldScreenProps) => (
  <div className="h-full bg-white flex flex-col">
    <div className="px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-serif font-bold text-burgundy">Gold SIP</h2>
    </div>
    <div className="flex-1 p-6 space-y-8 overflow-y-auto">
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
        <img 
          src="https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=800" 
          alt="Gold SIP" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 via-emerald-600/40 to-transparent flex flex-col justify-end p-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Total SIP Investment</p>
              <h3 className="text-2xl font-serif font-bold text-white">₹12,500</h3>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold text-emerald-100 uppercase tracking-widest">Active Plans</p>
              <p className="text-sm font-bold text-white">{activeSips.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">Active Plans</h4>
        {activeSips.map(sip => (
          <div key={sip.id} className="bg-white p-5 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-burgundy">₹{sip.amount.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold uppercase">/ {sip.frequency}</span></p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Next: {sip.next_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-burgundy"><Pause className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-burgundy/5 p-6 rounded-3xl border-2 border-dashed border-burgundy/20 space-y-4">
        <h4 className="text-sm font-bold text-burgundy">Start New SIP</h4>
        <Input 
          label="Monthly Amount" 
          placeholder="Min ₹500" 
          value={sipAmount} 
          onChange={(e: any) => setSipAmount(e.target.value)} 
          icon={Plus}
        />
        <div className="grid grid-cols-3 gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map(freq => (
            <button 
              key={freq}
              onClick={() => setSipFrequency(freq)}
              className={cn(
                "py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border-2 transition-all",
                sipFrequency === freq ? "bg-burgundy border-burgundy text-white" : "bg-white border-gray-100 text-gray-400"
              )}
            >
              {freq}
            </button>
          ))}
        </div>
        <Button onClick={handleCreateSIP} disabled={loading || !sipAmount}>Setup SIP</Button>
      </div>
    </div>
  </div>
);
