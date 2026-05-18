import React from 'react';
import { User, Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface TopbarProps {
  setIsMobileOpen: (v: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ setIsMobileOpen }) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-natural-border flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4 lg:gap-6">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-natural-sage hover:bg-natural-bg rounded-xl transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <button className="relative w-10 h-10 flex items-center justify-center text-natural-sage hover:text-natural-olive hover:bg-natural-bg rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-natural-border hidden sm:block"></div>

        <div className="flex items-center gap-3 lg:gap-4 group cursor-pointer">
          <div className="text-right hidden sm:flex flex-col justify-center">
            <span className="text-sm font-bold text-natural-ink">Admin Sayur</span>
            <span className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Store Manager</span>
          </div>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-natural-accent flex items-center justify-center text-natural-olive border-2 border-white shadow-sm overflow-hidden transition-transform group-hover:scale-105">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};
