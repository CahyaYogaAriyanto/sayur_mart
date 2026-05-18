import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Tags,
  Users,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    { label: 'Data Sayur', icon: Package, to: '/admin/manage' },
    { label: 'Kategori', icon: Tags, to: '/admin/categories' },
    { label: 'Admin Users', icon: Users, to: '/admin/users' },
    { label: 'Pengaturan', icon: Settings, to: '/admin/settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="h-24 flex items-center px-6 mb-4 justify-between lg:justify-start">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-natural-olive text-white shadow-lg">
            <Package size={22} />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <span className="text-xl font-bold tracking-tight text-natural-olive font-serif whitespace-nowrap">
              Admin<span className="font-light">SAYUR</span>
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 text-natural-sage hover:bg-natural-bg rounded-full"
        >
          <X size={24} />
        </button>
      </div>

      {/* Toggle Button (Desktop only) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-28 h-6 w-6 rounded-full bg-white border border-natural-border items-center justify-center text-natural-sage hover:text-natural-olive shadow-sm z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative",
              isActive 
                ? "bg-natural-accent/40 text-natural-olive border-l-4 border-natural-olive" 
                : "text-natural-sage hover:bg-natural-bg hover:text-natural-ink"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-natural-olive" : "text-natural-sage group-hover:text-natural-olive"
                )} />
                {(!isCollapsed || isMobileOpen) && (
                  <span className={cn(
                    "text-sm font-bold uppercase tracking-widest",
                    isActive ? "text-natural-olive" : ""
                  )}>
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-natural-border">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className={cn(
            "flex items-center gap-4 px-4 py-4 w-full rounded-2xl text-red-500 hover:bg-red-50 transition-all group",
            isCollapsed && !isMobileOpen && "justify-center"
          )}
        >
          <LogOut size={20} className="transition-transform group-hover:rotate-12" />
          {(!isCollapsed || isMobileOpen) && (
            <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-[60] bg-natural-olive/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-[70] h-full w-72 bg-white shadow-2xl lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-white border-r border-natural-border transition-all duration-300 ease-in-out hidden lg:flex lg:flex-col",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
};
