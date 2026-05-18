import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Star, TrendingUp, Zap, Shield, Truck, Leaf, Plus, ShoppingBag, ArrowRight, Sparkles, Clock, Award } from 'lucide-react';
import { useInventory, Vegetable } from '../context/InventoryContext';
import { useCategories } from '../context/CategoryContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Home: React.FC = () => {
  const { vegetables, loading } = useInventory();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const filteredVegetables = useMemo(() => {
    return vegetables.filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === 'Semua' || v.category === categoryFilter)
    );
  }, [vegetables, search, categoryFilter]);

  const allCategories = ['Semua', ...categories.map(c => c.name)];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-cream-bg via-white to-cream-bg">
      
      {/* ========== HERO SECTION PREMIUM ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-green via-emerald-500 to-dark-green pt-32 pb-40 px-6">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Floating Decorations */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-4xl">
            🥬
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-5xl">
            🥕
          </div>
        </div>
        <div className="absolute bottom-20 right-40 animate-float">
          <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl">
            🍅
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white"
              >
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-sm font-semibold">Pengepul Sayur #1 di Pekalongan</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Sayur Segar Langsung dari Petani ke Rumah Anda
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                Belanja kebutuhan harian lebih cepat, sehat, dan praktis dengan kualitas terbaik setiap hari.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="group flex items-center gap-3 px-8 py-4 bg-white text-primary-green rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all">
                  <ShoppingBag size={24} />
                  Belanja Sekarang
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                  Lihat Promo
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-white">50K+</div>
                  <div className="text-sm text-white/80">Pelanggan Setia</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="text-4xl font-bold text-white">4.9</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-white/80">Rating Pengguna</div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-white">100%</div>
                  <div className="text-sm text-white/80">Produk Segar</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:grid grid-cols-2 gap-6"
            >
              {[
                { icon: <Truck size={32} />, title: 'Pengiriman Cepat', desc: 'Sampai hari ini juga' },
                { icon: <Leaf size={32} />, title: '100% Organik', desc: 'Tanpa pestisida' },
                { icon: <Shield size={32} />, title: 'Terpercaya', desc: 'Garansi uang kembali' },
                { icon: <Award size={32} />, title: 'Kualitas Premium', desc: 'Pilihan terbaik' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover-lift"
                >
                  <div className="text-white mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== SEARCH & FILTER SECTION ========== */}
      <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-border-light"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-green transition-colors" size={24} />
              <input
                type="text"
                placeholder="Cari sayuran segar, buah, atau bumbu..."
                className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-border-light bg-soft-gray/50 text-lg outline-none transition-all focus:border-primary-green focus:bg-white focus:shadow-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3">
              <Link to="/products" className="px-6 py-5 rounded-2xl bg-primary-green text-white font-bold hover:bg-dark-green transition-all hover:scale-105 shadow-lg">
                Cari
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-text-dark mb-4">
            Kategori Pilihan
          </h2>
          <p className="text-xl text-text-muted">Temukan produk segar sesuai kebutuhan Anda</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {allCategories.map((cat, index) => {
            const categoryData = categories.find(c => c.name === cat);
            const icon = categoryData?.icon || '📦';
            const isActive = categoryFilter === cat;
            
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "group relative p-8 rounded-3xl border-2 transition-all hover-lift",
                  isActive 
                    ? "bg-gradient-to-br from-primary-green to-emerald-500 border-primary-green text-white shadow-2xl shadow-primary-green/30" 
                    : "bg-white border-border-light hover:border-primary-green hover:shadow-xl"
                )}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <h3 className={cn(
                  "text-lg font-bold",
                  isActive ? "text-white" : "text-text-dark group-hover:text-primary-green"
                )}>
                  {cat}
                </h3>
                {isActive && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute inset-0 rounded-3xl border-4 border-white/50"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ========== PRODUCTS SECTION ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-text-dark mb-2">
              Produk Segar Hari Ini
            </h2>
            <p className="text-xl text-text-muted">
              {filteredVegetables.length} produk tersedia
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <TrendingUp className="text-primary-green" size={24} />
            <span className="text-sm font-semibold text-text-muted">Terlaris Minggu Ini</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[480px] animate-pulse rounded-3xl bg-soft-gray" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredVegetables.map((veg, index) => {
                const isHovered = hoveredProduct === veg.id;
                const inStock = veg.stock > 0;
                
                return (
                  <motion.div
                    key={veg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredProduct(veg.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="group relative bg-white rounded-3xl border-2 border-border-light overflow-hidden hover:border-primary-green hover:shadow-2xl transition-all hover-lift"
                  >
                    {/* Image Container */}
                    <div className="relative h-72 overflow-hidden bg-soft-gray">
                      <img 
                        src={veg.image_url || 'https://via.placeholder.com/400?text=Sayur'} 
                        alt={veg.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-primary-green border border-primary-green/20">
                          {veg.category}
                        </span>
                        {veg.stock < 10 && veg.stock > 0 && (
                          <span className="px-3 py-1.5 rounded-full bg-orange-accent/95 backdrop-blur-sm text-xs font-bold text-white flex items-center gap-1">
                            <Zap size={12} />
                            Stok Terbatas
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <Link to="/products" className="absolute top-4 right-4 p-3 rounded-full bg-white/95 backdrop-blur-sm hover:bg-primary-green hover:text-white transition-all shadow-lg">
                        <Heart size={20} />
                      </Link>

                      {/* Quick View Overlay */}
                      <AnimatePresence>
                        {isHovered && inStock && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6"
                          >
                            <Link to="/products">
                              <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-primary-green rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all"
                              >
                                <ShoppingBag size={20} />
                                Lihat Detail
                              </motion.button>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Title & Rating */}
                      <div>
                        <h3 className="text-xl font-bold text-text-dark mb-2 line-clamp-2 group-hover:text-primary-green transition-colors">
                          {veg.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-text-muted font-medium">4.9 (128)</span>
                        </div>
                      </div>

                      {/* Price & Stock */}
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-sm text-text-muted mb-1">Harga</div>
                          <div className="text-2xl font-bold text-primary-green">
                            Rp{veg.price.toLocaleString('id-ID')}
                          </div>
                          <div className="text-xs text-text-muted">per {veg.unit}</div>
                        </div>
                        
                        {inStock ? (
                          <Link to="/products">
                            <button
                              className="p-4 rounded-2xl bg-primary-green text-white hover:bg-dark-green transition-all hover:scale-110 shadow-lg"
                            >
                              <Plus size={24} />
                            </button>
                          </Link>
                        ) : (
                          <div className="px-4 py-2 rounded-2xl bg-red-50 text-red-500 text-sm font-bold">
                            Habis
                          </div>
                        )}
                      </div>

                      {/* Stock Indicator */}
                      <div className="flex items-center gap-2 pt-4 border-t border-border-light">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          inStock ? "bg-primary-green animate-pulse" : "bg-red-500"
                        )} />
                        <span className="text-sm font-medium text-text-muted">
                          {inStock ? `Stok: ${veg.stock} ${veg.unit}` : 'Stok Habis'}
                        </span>
                        {inStock && (
                          <div className="ml-auto flex items-center gap-1 text-primary-green">
                            <Clock size={14} />
                            <span className="text-xs font-semibold">Kirim Hari Ini</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredVegetables.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-soft-gray flex items-center justify-center text-6xl">
              🔍
            </div>
            <h3 className="text-3xl font-bold text-text-dark mb-4">Produk Tidak Ditemukan</h3>
            <p className="text-xl text-text-muted mb-8">Coba kata kunci atau kategori lain</p>
            <button
              onClick={() => { setSearch(''); setCategoryFilter('Semua'); }}
              className="px-8 py-4 bg-primary-green text-white rounded-2xl font-bold hover:bg-dark-green transition-all"
            >
              Tampilkan Semua Produk
            </button>
          </motion.div>
        )}
      </section>

      {/* ========== WHY CHOOSE US SECTION ========== */}
      <section className="bg-gradient-to-br from-soft-gray to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-text-dark mb-4">
              Kenapa Pilih SayurMart?
            </h2>
            <p className="text-xl text-text-muted">Komitmen kami untuk kualitas dan kepuasan Anda</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf size={40} />,
                title: 'Segar Setiap Hari',
                desc: 'Produk dipanen pagi, sampai siang di rumah Anda',
                color: 'from-emerald-500 to-green-500'
              },
              {
                icon: <Truck size={40} />,
                title: 'Pengiriman Cepat',
                desc: 'Gratis ongkir untuk pembelian di atas Rp 50.000',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Shield size={40} />,
                title: 'Garansi Kualitas',
                desc: 'Uang kembali 100% jika produk tidak sesuai',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: <Award size={40} />,
                title: 'Harga Terbaik',
                desc: 'Langsung dari petani, tanpa perantara',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: <Star size={40} />,
                title: 'Rating 4.9/5',
                desc: 'Dipercaya oleh 50.000+ pelanggan setia',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Zap size={40} />,
                title: 'Promo Menarik',
                desc: 'Diskon hingga 50% setiap hari',
                color: 'from-pink-500 to-rose-500'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white border-2 border-border-light hover:border-primary-green hover:shadow-2xl transition-all hover-lift"
              >
                <div className={cn(
                  "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform",
                  item.color
                )}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-3">{item.title}</h3>
                <p className="text-text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-primary-green via-emerald-500 to-dark-green p-16 text-center"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white">
              Mulai Belanja Sekarang!
            </h2>
            <p className="text-xl text-white/90">
              Dapatkan diskon 20% untuk pembelian pertama Anda
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products" className="flex items-center gap-3 px-10 py-5 bg-white text-primary-green rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all">
                <ShoppingBag size={24} />
                Belanja Sekarang
                <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
