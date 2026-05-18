import React, { useState } from 'react';
import { Sidebar } from './AdminSidebar';
import { Topbar } from './AdminTopbar';
import { cn } from '../lib/utils';
import { Outlet } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-natural-bg overflow-x-hidden flex">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen",
        isCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        <Topbar setIsMobileOpen={setIsMobileOpen} />
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="px-10 py-6 border-t border-natural-border text-[10px] text-natural-sage font-bold uppercase tracking-[0.2em] flex justify-between">
          <span>&copy; 2024 SayurMart SaaS Panel</span>
          <span>System Version 2.0.1</span>
        </footer>
      </div>
    </div>
  );
};
