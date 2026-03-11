import React from 'react';
import { ArrowLeft, Gift } from 'lucide-react';
import { Screen } from '../../types';

export const ReferScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <div className="h-full bg-bg text-white p-6 flex flex-col">
      <button onClick={() => setScreen('dashboard')} className="mb-6 flex items-center gap-2 text-gold">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-gold mb-6">
          <Gift className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-4">Refer & Earn</h2>
        <p className="text-text-muted">Invite friends and earn rewards!</p>
      </div>
    </div>
  );
};
