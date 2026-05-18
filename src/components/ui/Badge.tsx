import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-orange-50 text-orange-600 border-orange-100",
    danger: "bg-red-50 text-red-600 border-red-100",
    info: "bg-natural-accent text-natural-olive border-natural-olive/10",
    neutral: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
      styles[variant],
      className
    )}>
      {children}
    </span>
  );
};
