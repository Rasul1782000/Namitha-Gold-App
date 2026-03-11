import React from 'react';
import { Home, History, Gift, MapPin, User, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Screen } from '../../types';

interface NavbarProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

export const Navbar = ({ currentScreen, setScreen }: NavbarProps) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'schemes', icon: Calendar, label: 'Savings' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
      <div className="bg-surface backdrop-blur-2xl border border-gold/20 rounded-3xl shadow-2xl px-4 py-3 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as Screen)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 relative group",
                isActive ? "text-gold" : "text-text-muted hover:text-gold/60"
              )}
            >
              <Icon className={cn("w-6 h-6 transition-transform", isActive && "scale-110")} />
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-gold rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
