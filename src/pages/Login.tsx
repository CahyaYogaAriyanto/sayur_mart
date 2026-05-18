import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Loader2, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { ToastContainer } from '../components/Toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Login only
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;
      
      addToast('Login berhasil! Menuju dashboard...', 'success');
      // Use React Router navigate for faster transition
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 800);
    } catch (err: any) {
      console.error('Auth error:', err);
      addToast(err.message || 'Email atau password salah', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center p-6 bg-gradient-to-br from-cream-bg via-white to-soft-gray">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[48px] border-2 border-border-light bg-white p-10 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-green/10 to-emerald-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="mb-12 text-center relative z-10">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-green to-emerald-500 text-white shadow-lg shadow-primary-green/30">
            <Lock size={40} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-text-dark mb-3">
            Login Admin
          </h1>
          <p className="text-text-muted">
            Akses Dashboard Admin SayurMart
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-dark">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-2xl border-2 border-border-light bg-soft-gray/50 px-6 py-4 text-base outline-none transition-all focus:border-primary-green focus:bg-white"
              placeholder="admin@sayurmart.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-dark">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-2xl border-2 border-border-light bg-soft-gray/50 px-6 py-4 text-base outline-none transition-all focus:border-primary-green focus:bg-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-green to-emerald-500 py-4 text-base font-bold text-white shadow-lg shadow-primary-green/30 hover:shadow-xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Memproses...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Masuk ke Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4 relative z-10">
          <div className="text-sm text-text-muted">
            Tidak punya akun? Hubungi administrator untuk membuat akun baru.
          </div>
          
          <div className="pt-4 border-t border-border-light">
            <Link 
              to="/" 
              className="text-sm font-semibold text-primary-green hover:text-dark-green transition-colors inline-flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> 
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
