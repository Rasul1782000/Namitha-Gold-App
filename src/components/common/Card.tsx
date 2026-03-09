import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={cn("bg-white rounded-xl p-4 shadow-lg border border-gray-100", className)}>
    {children}
  </div>
);
