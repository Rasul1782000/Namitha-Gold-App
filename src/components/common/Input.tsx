import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

export const Input = ({ label, type = "text", value, onChange, placeholder, icon: Icon, className, ...props }: InputProps) => (
  <div className={cn("space-y-1", className)}>
    {label && <label className="text-[10px] font-bold text-burgundy uppercase tracking-widest ml-1">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy/40" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full bg-white border-2 border-gray-100 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-burgundy/5 focus:border-burgundy transition-all font-medium text-sm",
          Icon && "pl-10"
        )}
        {...props}
      />
    </div>
  </div>
);
