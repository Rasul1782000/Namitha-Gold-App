import React from 'react';
import { Home, History, Gift, MapPin, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Screen } from '../../types';

interface NavbarProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

export const Navbar = ({ currentScreen, setScreen }: NavbarProps) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'locator', icon: MapPin, label: 'Stores' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-burgundy/10 rounded-2xl shadow-2xl px-2 py-2 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as Screen)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 relative group",
                isActive ? "text-burgundy" : "text-gray-400 hover:text-burgundy/60"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-burgundy/5 rounded-xl -z-10" />
              )}
              <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-burgundy rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
