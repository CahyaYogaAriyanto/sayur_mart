import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Leaf, Menu, X, Home, Info, Phone, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CartDrawer } from './CartDrawer';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if current page is Products page
  const isProductsPage = location.pathname === '/products';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Beranda', to: '/', icon: <Home size={18} /> },
    { label: 'Produk', to: '/products', icon: <ShoppingBag size={18} /> },
    { label: 'Tentang', to: '/about', icon: <Info size={18} /> },
    { label: 'Kontak', to: '/contact', icon: <Phone size={18} /> },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-border-light" 
            : "bg-white/80 backdrop-blur-md border-b border-border-light/50"
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-3 text-text-dark hover:bg-soft-gray rounded-2xl transition-all"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-green to-emerald-500 text-white shadow-lg shadow-primary-green/30"
            >
              <Leaf size={24} />
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-2xl font-bold text-text-dark">
                Sayur<span className="text-primary-green">Mart</span>
              </div>
              <div className="text-xs text-text-muted font-medium">Fresh & Healthy</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={cn(
                    "relative flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all",
                    isActive 
                      ? "bg-primary-green text-white shadow-lg shadow-primary-green/30" 
                      : "text-text-dark hover:bg-soft-gray"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="flex items-center gap-3">
            {/* Cart Button - Only show on Products page */}
            {isProductsPage && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 text-text-dark hover:bg-soft-gray rounded-2xl transition-all"
              >
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-gradient-to-br from-orange-accent to-red-500 text-xs text-white flex items-center justify-center font-bold shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-2xl bg-soft-gray text-text-dark font-semibold hover:bg-primary-green hover:text-white transition-all"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut size={20} />
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-green to-emerald-500 text-white font-bold shadow-lg shadow-primary-green/30 hover:shadow-xl hover:scale-105 transition-all"
              >
                <User size={18} />
                <span className="hidden sm:inline">Login Admin</span>
                <span className="sm:hidden">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 z-[60] h-screen w-full max-w-sm bg-white shadow-2xl lg:hidden flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-light flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-green to-emerald-500 text-white">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-text-dark">SayurMart</div>
                      <div className="text-xs text-text-muted">Menu Navigasi</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-2 text-text-muted hover:bg-soft-gray rounded-xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Menu Items - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link 
                        key={link.to} 
                        to={link.to} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold transition-all",
                          isActive 
                            ? "bg-primary-green text-white shadow-lg" 
                            : "text-text-dark hover:bg-soft-gray"
                        )}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    );
                  })}
                  
                  {isAuthenticated && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-text-dark hover:bg-soft-gray transition-all"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border-light flex-shrink-0 bg-soft-gray">
                  <div className="text-center space-y-2">
                    <div className="text-sm font-semibold text-text-dark">SayurMart</div>
                    <div className="text-xs text-text-muted">&copy; 2026 All rights reserved</div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
