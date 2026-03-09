import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'dark' | 'ghost';
}

export const Button = ({ children, onClick, variant = 'primary', className, disabled, ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-burgundy text-white hover:bg-burgundy-light shadow-md shadow-burgundy/10',
    secondary: 'bg-white text-burgundy border-2 border-burgundy hover:bg-burgundy/5',
    gold: 'bg-gold text-white hover:bg-[#B8962F] shadow-md shadow-gold/10',
    dark: 'bg-black text-white hover:bg-gray-900',
    ghost: 'bg-transparent text-burgundy hover:bg-burgundy/10'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-3 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase tracking-wider text-xs",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
