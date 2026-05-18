import React, { useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Package, TrendingUp, AlertTriangle, Database, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

export const AdminDashboard: React.FC = () => {
  const { vegetables, loading } = useInventory();

  const stats = useMemo(() => {
    const totalVeggies = vegetables.length;
    const outOfStock = vegetables.filter(v => v.stock === 0).length;
    const totalStock = vegetables.reduce((acc, v) => acc + v.stock, 0);

    return [
      { 
        label: 'Total Produk', 
        value: totalVeggies, 
        icon: Package, 
        color: 'bg-indigo-500',
        change: '+4.5%',
        isPositive: true,
        sub: 'Jenis sayur aktif'
      },
      { 
        label: 'Stok Kosong', 
        value: outOfStock, 
        icon: AlertTriangle, 
        color: 'bg-rose-500',
        change: '-2.1%',
        isPositive: true,
        sub: 'Segera restock'
      },
      { 
        label: 'Total Unit', 
        value: totalStock, 
        icon: Database, 
        color: 'bg-emerald-500',
        change: '+11.2%',
        isPositive: true,
        sub: 'Akumulasi stok'
      },
      { 
        label: 'Market Saham', 
        value: '78.4%', 
        icon: TrendingUp, 
        color: 'bg-amber-500',
        change: '+0.8%',
        isPositive: true,
        sub: 'Index kesegaran'
      },
    ];
  }, [vegetables]);

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-natural-olive font-serif">Selamat Datang, Admin</h1>
          <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-natural-sage">Dashboard Ringkasan Operasional</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/manage" className="px-6 py-3 bg-natural-olive text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-natural-olive/20 hover:scale-105 transition-all text-center">
            Kelola Produk
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="group relative rounded-[40px] border border-natural-border bg-white p-8 transition-all hover:shadow-2xl hover:shadow-natural-olive/5 overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color} text-white shadow-lg`}>
                <stat.icon size={28} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
                stat.isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              )}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            
            <div className="mt-8 relative z-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-natural-sage">{stat.label}</h3>
              <p className="mt-2 text-4xl font-light text-natural-olive font-serif">{stat.value}</p>
              <p className="mt-2 text-xs text-natural-sage font-medium">{stat.sub}</p>
            </div>

            {/* Decorative background circle */}
            <div className={cn(
              "absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] transition-transform group-hover:scale-150 duration-700",
              stat.color
            )} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-[40px] border border-natural-border bg-white p-10 overflow-hidden relative">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-light text-natural-olive font-serif">Aktifitas Terbaru</h3>
            <Link to="/admin/manage" className="text-[10px] font-bold uppercase tracking-widest text-natural-sage hover:text-natural-olive underline underline-offset-4">Lihat Semua</Link>
          </div>
          
          <div className="space-y-6">
            {loading && vegetables.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-natural-sage">Memuat data produk...</p>
              </div>
            ) : vegetables.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-natural-sage">Belum ada produk</p>
              </div>
            ) : (
              vegetables.slice(0, 5).map((veg) => (
                <div key={veg.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-natural-bg overflow-hidden border border-natural-border">
                      <img src={veg.image_url} alt={veg.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-natural-olive uppercase tracking-wider">{veg.name}</p>
                      <p className="text-xs text-natural-sage">{veg.category} • Rp {veg.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <Badge variant={veg.stock > 0 ? 'success' : 'danger'}>
                    {veg.stock > 0 ? `${veg.stock} unit` : 'HABIS'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[40px] border border-natural-border bg-natural-olive p-10 text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-3xl font-light font-serif">Market Update</h3>
              <p className="text-sm text-natural-bg/70 leading-relaxed">
                Permintaan pasar untuk kategori umbi meningkat pesat sebesar 15% pada minggu ini. Pastikan stok kentang dan wortel mencukupi.
              </p>
            </div>
            
            <button className="mt-8 w-full py-4 bg-white text-natural-olive rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 transition-all">
              Buka Laporan
            </button>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none group-hover:bg-white/10 transition-all" />
        </div>
      </div>
    </div>
  );
};
