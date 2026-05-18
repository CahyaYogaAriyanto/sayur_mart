import React from 'react';
import { Settings, User, Bell, Shield, Database, Globe, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AdminSettings: React.FC = () => {
  return (
    <div className="p-6 lg:p-10 space-y-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-natural-olive font-serif">Pengaturan Sistem</h1>
          <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-natural-sage">Konfigurasi & Keamanan Panel</p>
        </div>
        <Button className="rounded-full px-10 h-14 bg-natural-olive text-white shadow-xl shadow-natural-olive/20">
          <Save size={18} className="mr-2" /> Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-[32px] border border-natural-border p-4 space-y-2">
            {[
              { label: 'Profil Saya', icon: User, active: true },
              { label: 'Notifikasi', icon: Bell },
              { label: 'Keamanan', icon: Shield },
              { label: 'Integrasi Database', icon: Database },
              { label: 'Bahasa & Wilayah', icon: Globe },
            ].map((item, i) => (
              <button 
                key={i} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${item.active ? 'bg-natural-olive text-white shadow-md' : 'text-natural-sage hover:bg-natural-bg'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-9 space-y-10">
          <div className="bg-white rounded-[40px] border border-natural-border p-10 space-y-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-light text-natural-olive font-serif border-b border-natural-border pb-4">Profil Administrator</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Username Master</label>
                  <input type="text" defaultValue="admin_sayurmart" className="w-full h-14 rounded-2xl border-2 border-natural-border bg-natural-bg/30 px-6 text-sm outline-none transition-all focus:border-natural-olive focus:bg-white" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Email Resmi</label>
                  <input type="email" defaultValue="admin@sayurmart.id" className="w-full h-14 rounded-2xl border-2 border-natural-border bg-natural-bg/30 px-6 text-sm outline-none transition-all focus:border-natural-olive focus:bg-white" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Deskripsi Store</label>
                  <textarea rows={4} className="w-full rounded-2xl border-2 border-natural-border bg-natural-bg/30 p-6 text-sm outline-none transition-all focus:border-natural-olive focus:bg-white resize-none">Management sayurMart Central West Java. Fokus pada distribusi sayur organik premium.</textarea>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-light text-natural-olive font-serif border-b border-natural-border pb-4">Konfigurasi Keamanan</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 rounded-3xl border border-natural-border hover:bg-natural-bg transition-colors">
                  <div className="space-y-1">
                    <h4 className="font-bold text-natural-olive text-sm uppercase tracking-tight">Two-Factor Authentication</h4>
                    <p className="text-xs text-natural-sage">Tingkatkan keamanan akun dengan verifikasi tambahan.</p>
                  </div>
                  <div className="w-12 h-6 bg-natural-border rounded-full relative cursor-pointer">
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 rounded-3xl border border-natural-border hover:bg-natural-bg transition-colors">
                  <div className="space-y-1">
                    <h4 className="font-bold text-natural-olive text-sm uppercase tracking-tight">Login Alerts</h4>
                    <p className="text-xs text-natural-sage">Terima notifikasi email saat ada aktivitas login baru.</p>
                  </div>
                  <div className="w-12 h-6 bg-natural-olive rounded-full relative cursor-pointer">
                    <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
             <Button variant="ghost" className="rounded-full px-8 uppercase font-bold tracking-widest text-[10px]">Batalkan</Button>
             <Button className="rounded-full px-10 h-14 uppercase font-bold tracking-widest text-[10px]">Terapkan Sekarang</Button>
          </div>
        </main>
      </div>
    </div>
  );
};
