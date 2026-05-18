import React, { useState, useMemo } from 'react';
import { Search, Heart, Star, Plus, ShoppingBag, Clock, Zap, Filter, X } from 'lucide-react';
import { useInventory, Vegetable } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { useCategories } from '../context/CategoryContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Products: React.FC = () => {
  const { vegetables, loading } = useInventory();
  const { addToCart } = useCart();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredVegetables = useMemo(() => {
    return vegetables.filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === 'Semua' || v.category === categoryFilter)
    );
  }, [vegetables, search, categoryFilter]);

  const allCategories = ['Semua', ...categories.map(c => c.name)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-bg via-white to-cream-bg">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-green via-emerald-500 to-dark-green pt-32 pb-20 px-6">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Produk Segar Pilihan
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Temukan sayuran dan buah segar berkualitas premium langsung dari petani lokal
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-border-light"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-green transition-colors" size={24} />
              <input
                type="text"
                placeholder="Cari sayuran segar, buah, atau bumbu..."
                className="w-full pl-16 pr-6 py-4 rounded-2xl border-2 border-border-light bg-soft-gray/50 text-base outline-none transition-all focus:border-primary-green focus:bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary-green text-white font-bold"
            >
              <Filter size={20} />
              Filter
            </button>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-3xl p-6 border-2 border-border-light">
                <h3 className="text-xl font-bold text-text-dark mb-6">Kategori</h3>
                <div className="space-y-2">
                  {allCategories.map((cat) => {
                    const categoryData = categories.find(c => c.name === cat);
                    const icon = categoryData?.icon || '📦';
                    const isActive = categoryFilter === cat;
                    
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all text-left",
                          isActive 
                            ? "bg-primary-green text-white shadow-lg" 
                            : "text-text-dark hover:bg-soft-gray"
                        )}
                      >
                        <span className="text-2xl">{icon}</span>
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Promo Banner */}
              <div className="bg-gradient-to-br from-orange-accent to-red-500 rounded-3xl p-6 text-white">
                <div className="text-4xl mb-3">🎉</div>
                <h4 className="text-xl font-bold mb-2">Promo Spesial!</h4>
                <p className="text-sm text-white/90 mb-4">
                  Diskon hingga 30% untuk pembelian pertama
                </p>
                <button className="w-full px-4 py-3 bg-white text-orange-accent rounded-2xl font-bold hover:scale-105 transition-all">
                  Lihat Promo
                </button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-text-dark">
                  {categoryFilter === 'Semua' ? 'Semua Produk' : categoryFilter}
                </h2>
                <p className="text-text-muted mt-1">
                  {filteredVegetables.length} produk tersedia
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[480px] animate-pulse rounded-3xl bg-soft-gray" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          <button className="absolute top-4 right-4 p-3 rounded-full bg-white/95 backdrop-blur-sm hover:bg-primary-green hover:text-white transition-all shadow-lg">
                            <Heart size={20} />
                          </button>

                          {/* Quick Add Overlay */}
                          <AnimatePresence>
                            {isHovered && inStock && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6"
                              >
                                <motion.button
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: 20, opacity: 0 }}
                                  onClick={() => addToCart(veg)}
                                  className="flex items-center gap-2 px-6 py-3 bg-white text-primary-green rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all"
                                >
                                  <Plus size={20} />
                                  Tambah ke Keranjang
                                </motion.button>
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
                              <button
                                onClick={() => addToCart(veg)}
                                className="p-4 rounded-2xl bg-primary-green text-white hover:bg-dark-green transition-all hover:scale-110 shadow-lg"
                              >
                                <Plus size={24} />
                              </button>
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
          </div>
        </div>
      </section>

      {/* Mobile Filter Sidebar */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
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
                <h3 className="text-2xl font-bold text-text-dark">Filter Produk</h3>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)} 
                  className="p-2 text-text-muted hover:bg-soft-gray rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Categories */}
                <div>
                  <h4 className="text-lg font-bold text-text-dark mb-4">Kategori</h4>
                  <div className="space-y-2">
                    {allCategories.map((cat) => {
                      const categoryData = categories.find(c => c.name === cat);
                      const icon = categoryData?.icon || '📦';
                      const isActive = categoryFilter === cat;
                      
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategoryFilter(cat);
                            setIsMobileFilterOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all text-left",
                            isActive 
                              ? "bg-primary-green text-white shadow-lg" 
                              : "text-text-dark hover:bg-soft-gray"
                          )}
                        >
                          <span className="text-2xl">{icon}</span>
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border-light flex-shrink-0 bg-soft-gray">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full px-6 py-4 bg-primary-green text-white rounded-2xl font-bold hover:bg-dark-green transition-all shadow-lg"
                >
                  Terapkan Filter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
