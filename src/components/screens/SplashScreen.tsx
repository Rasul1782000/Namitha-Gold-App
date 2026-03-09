import React from 'react';
import { Coins } from 'lucide-react';

export const SplashScreen = () => (
  <div className="h-full bg-burgundy flex flex-col items-center justify-center text-center p-8">
    <div className="mb-8 splash-logo">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.4)] border-4 border-gold">
        <Coins className="w-12 h-12 text-burgundy" />
      </div>
    </div>
    <h1 className="text-2xl font-serif font-bold text-gold mb-2 tracking-widest uppercase splash-text">
      NAMITHA JEWELLERS
    </h1>
    <p className="text-white/80 font-medium tracking-widest text-[10px] uppercase splash-text">
      Save Gold. Secure Future.
    </p>
  </div>
);
