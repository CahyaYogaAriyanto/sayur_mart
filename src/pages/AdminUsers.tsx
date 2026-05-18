import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, Trash2, Shield, Mail, Loader2, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  phone_number?: string;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Call RPC function to get admin users with emails
      const { data, error } = await supabase
        .rpc('get_admin_users_with_email');
      
      if (error) throw error;

      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      showToast('Gagal memuat daftar admin', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: {
          data: {
            full_name: newFullName || newEmail.split('@')[0],
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Gagal membuat user');
      }

      showToast('Admin baru berhasil ditambahkan!', 'success');
      setIsModalOpen(false);
      setNewEmail('');
      setNewPassword('');
      setNewFullName('');
      
      // Tunggu sebentar agar trigger selesai
      setTimeout(() => {
        fetchUsers();
      }, 500);
    } catch (error: any) {
      console.error('Error creating admin:', error);
      showToast(error.message || 'Gagal menambahkan admin', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (userId: string, email: string) => {
    if (!confirm(`Yakin ingin menghapus admin: ${email}?`)) return;

    try {
      // Delete from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;

      showToast('Admin berhasil dihapus', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      showToast(error.message || 'Gagal menghapus admin', 'error');
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-6 z-50"
          >
            <div className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl",
              toast.type === 'success' ? "bg-primary-green text-white" : "bg-red-500 text-white"
            )}>
              {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span className="font-semibold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-text-dark">Manajemen Admin</h1>
          <p className="text-text-muted">Kelola akun administrator sistem</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-green to-emerald-500 px-8 py-4 font-bold text-white shadow-lg shadow-primary-green/30 hover:shadow-xl hover:scale-105 transition-all"
        >
          <UserPlus size={20} />
          Tambah Admin Baru
        </button>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-primary-green" size={48} />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-32">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-soft-gray flex items-center justify-center">
            <User size={64} className="text-text-muted" />
          </div>
          <h3 className="text-2xl font-bold text-text-dark mb-4">Belum Ada Admin</h3>
          <p className="text-text-muted mb-8">Tambahkan admin pertama untuk memulai</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-primary-green text-white rounded-2xl font-bold hover:bg-dark-green transition-all"
          >
            Tambah Admin
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl border-2 border-border-light p-6 hover:border-primary-green hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-green to-emerald-500 flex items-center justify-center text-white">
                  <Shield size={28} />
                </div>
                <button
                  onClick={() => handleDeleteAdmin(user.id, user.email)}
                  className="p-2 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-text-dark mb-1">{user.full_name}</h3>
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <Mail size={14} />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-light space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Calendar size={14} />
                    <span>
                      Dibuat: {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {user.phone_number && (
                    <div className="text-xs text-text-muted">
                      <span className="font-semibold">Telepon:</span> {user.phone_number}
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-green/10 text-primary-green text-xs font-bold">
                    <Shield size={14} />
                    Administrator
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-[48px] bg-white p-10 shadow-2xl"
            >
              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-green to-emerald-500 text-white">
                  <UserPlus size={32} />
                </div>
                <h2 className="text-3xl font-bold text-text-dark mb-2">
                  Tambah Admin Baru
                </h2>
                <p className="text-text-muted">Buat akun administrator baru</p>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-text-dark">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-2xl border-2 border-border-light bg-soft-gray/50 px-5 py-4 text-base outline-none transition-all focus:border-primary-green focus:bg-white"
                    placeholder="John Doe"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-text-dark">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-2xl border-2 border-border-light bg-soft-gray/50 px-5 py-4 text-base outline-none transition-all focus:border-primary-green focus:bg-white"
                    placeholder="admin@sayurmart.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-text-dark">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full rounded-2xl border-2 border-border-light bg-soft-gray/50 px-5 py-4 text-base outline-none transition-all focus:border-primary-green focus:bg-white"
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <p className="text-xs text-text-muted">Password minimal 6 karakter</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-2xl border-2 border-border-light py-4 font-bold text-text-dark hover:bg-soft-gray transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-green to-emerald-500 py-4 font-bold text-white shadow-lg shadow-primary-green/30 hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Membuat...
                      </>
                    ) : (
                      <>
                        <UserPlus size={20} />
                        Buat Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

