import React, { useState } from 'react';
import { ArrowLeft, ArrowDownRight, ArrowUpRight, History } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserData, Transaction, Screen } from '../../types';

interface HistoryScreenProps {
  setScreen: (screen: Screen) => void;
  transactions: Transaction[];
  user: UserData | null;
  goldPrice: number;
}

export const HistoryScreen = ({
  setScreen,
  transactions,
  user,
  goldPrice
}: HistoryScreenProps) => {
  const [filter, setFilter] = useState('all');
  
  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' ? true : tx.type === filter
  );

  const stats = {
    totalBought: transactions.reduce((acc, tx) => tx.type === 'buy' ? acc + tx.gold_amount : acc, 0),
    totalSold: transactions.reduce((acc, tx) => tx.type === 'sell' ? acc + tx.gold_amount : acc, 0),
    currentBalance: user?.gold_balance || 0,
    investmentValue: (user?.gold_balance || 0) * goldPrice
  };

  return (
    <div className="h-full bg-[#FDFCF0]/30 flex flex-col">
      <div className="bg-white px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-serif font-bold text-burgundy">Transaction History</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Investment Summary */}
        <div className="p-6 grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-sm">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Bought</p>
            <p className="text-sm font-bold text-burgundy">{stats.totalBought.toFixed(4)} g</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-sm">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sold</p>
            <p className="text-sm font-bold text-burgundy">{stats.totalSold.toFixed(4)} g</p>
          </div>
          <div className="bg-burgundy p-4 rounded-2xl shadow-md col-span-2 flex justify-between items-center">
            <div>
              <p className="text-[8px] font-bold text-gold/60 uppercase tracking-widest mb-1">Current Value</p>
              <p className="text-lg font-bold text-white">₹{stats.investmentValue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold text-gold/60 uppercase tracking-widest mb-1">Balance</p>
              <p className="text-lg font-bold text-gold">{stats.currentBalance.toFixed(4)} g</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'buy', 'sell', 'sip', 'reward'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 border-2",
                filter === f 
                  ? "bg-burgundy border-burgundy text-white shadow-md" 
                  : "bg-white border-gray-100 text-gray-400 hover:border-burgundy/20"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="px-6 space-y-3">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="bg-white p-4 rounded-2xl border-2 border-gray-50 flex items-center justify-between shadow-sm hover:border-burgundy/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    tx.type === 'buy' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" : "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                  )}>
                    {tx.type === 'buy' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-burgundy capitalize">{tx.type} Gold</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-burgundy">₹{(tx.gold_amount * tx.price).toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">{tx.gold_amount.toFixed(4)} g</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <History className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
