import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useCategories } from '../context/CategoryContext';
import { Tags, Plus, Search, ChevronRight, MoreVertical, Pencil, Trash2, X, Loader2, FileDown, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';

export const AdminCategories: React.FC = () => {
  const { vegetables } = useInventory();
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // Count products per category
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: vegetables.filter(v => v.category === cat.name).length
  }));

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showToast('Kategori berhasil diupdate!', 'success');
      } else {
        await addCategory(formData);
        showToast('Kategori berhasil ditambahkan!', 'success');
      }
      
      // Refresh data untuk memastikan sinkronisasi
      await fetchCategories();
      
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving category:', err);
      showToast(err.message || "Gagal menyimpan kategori", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        await deleteCategory(id);
        showToast('Kategori berhasil dihapus', 'success');
        await fetchCategories();
      } catch (err: any) {
        console.error('Error deleting category:', err);
        showToast(err.message || "Gagal menghapus kategori", 'error');
      }
    }
  };

  const exportToExcel = () => {
    // Prepare header info
    const today = new Date();
    const dateStr = today.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    const timeStr = today.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Calculate summary
    const totalCategories = categoriesWithCount.length;
    const totalProducts = categoriesWithCount.reduce((sum, cat) => sum + cat.count, 0);

    // Create header rows
    const headerData = [
      ['LAPORAN KATEGORI PRODUK'],
      ['SAYUR MART'],
      [''],
      [`Tanggal: ${dateStr}`],
      [`Waktu: ${timeStr}`],
      [''],
    ];

    // Prepare data (tanpa icon)
    const data = categoriesWithCount.map((cat, index) => ({
      'No': index + 1,
      'Nama Kategori': cat.name,
      'Deskripsi': cat.description || '-',
      'Jumlah Produk': cat.count,
    }));

    // Create worksheet from header
    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    // Add data starting from row 7
    XLSX.utils.sheet_add_json(worksheet, data, { 
      origin: 'A7',
      skipHeader: false 
    });

    // Add summary after data
    const dataEndRow = 7 + data.length;
    const summaryData = [
      [''],
      ['RINGKASAN'],
      ['Total Kategori', totalCategories],
      ['Total Produk', totalProducts],
    ];

    XLSX.utils.sheet_add_aoa(worksheet, summaryData, { 
      origin: `A${dataEndRow + 1}` 
    });

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },   // No
      { wch: 25 },  // Nama Kategori
      { wch: 30 },  // Deskripsi
      { wch: 15 },  // Jumlah Produk
    ];

    // Merge cells for header
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title row 1
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Title row 2
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Kategori");

    // Generate filename
    const timestamp = today.toISOString().split('T')[0];
    const filename = `Laporan_Kategori_SayurMart_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 min-h-screen">
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
              toast.type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span className="font-semibold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-natural-olive font-serif">Manajemen Kategori</h1>
          <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-natural-sage">Pengelompokan Produk Inventaris</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportToExcel}
            className="flex items-center justify-center gap-3 rounded-full border-2 border-natural-olive px-6 sm:px-8 py-3 text-xs font-bold uppercase tracking-widest text-natural-olive transition-all hover:bg-natural-olive hover:text-white"
          >
            <FileDown size={18} />
            Export Excel
          </button>
          <Button 
            onClick={openAdd}
            className="rounded-full px-6 sm:px-8 h-12 shadow-lg shadow-natural-olive/20"
          >
            <Plus size={18} className="mr-2" /> Tambah Kategori
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categoriesWithCount.map((cat) => (
          <div key={cat.id} className="bg-white rounded-[40px] border border-natural-border p-6 sm:p-8 hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-natural-accent flex items-center justify-center text-3xl sm:text-4xl">
                📦
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEdit(cat)}
                  className="text-natural-sage hover:text-natural-olive transition-colors p-2 hover:bg-natural-bg rounded-xl"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="text-natural-sage hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-natural-olive uppercase tracking-tight">{cat.name}</h3>
                <Badge variant="success">Aktif</Badge>
              </div>
              <p className="text-xs sm:text-sm text-natural-sage font-medium line-clamp-2">
                {cat.description || `${cat.count} Produk terdaftar dalam kategori ini.`}
              </p>
              <div className="pt-2">
                <span className="text-2xl font-light text-natural-olive font-serif">{cat.count}</span>
                <span className="text-xs text-natural-sage ml-2 uppercase tracking-wider">Produk</span>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={openAdd}
          className="border-4 border-dashed border-natural-border rounded-[40px] flex flex-col items-center justify-center p-8 sm:p-12 text-natural-sage hover:bg-white hover:border-natural-olive hover:text-natural-olive transition-all space-y-4 min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
            <Plus size={24} />
          </div>
          <span className="font-bold uppercase tracking-widest text-xs">Tambah Baru</span>
        </button>
      </div>

      <div className="bg-natural-olive p-8 sm:p-12 rounded-[48px] text-white overflow-hidden relative group">
        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <h3 className="text-2xl sm:text-3xl font-light font-serif italic">Optimalkan Penataan Katalog</h3>
          <p className="opacity-70 text-xs sm:text-sm leading-relaxed">Kategori yang terorganisir dengan baik membantu pembeli menemukan produk lebih cepat. Gunakan penamaan yang intuitif dan emoji kategori yang merepresentasikan isi produk.</p>
          <Button variant="outline" className="border-white/20 text-white rounded-full hover:bg-white/10 uppercase font-bold tracking-widest text-[10px] px-6 sm:px-8 h-10 sm:h-12">Panduan Penataan</Button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      </div>

      {/* Modal Add/Edit Category */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-natural-olive/30 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-[40px] bg-white p-6 sm:p-10 shadow-2xl shadow-natural-olive/20"
            >
              <div className="mb-6 sm:mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-natural-olive font-serif">
                    {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                  </h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-natural-sage">Pengelompokan Produk</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 sm:p-3 hover:bg-natural-bg text-natural-sage transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama Kategori */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Nama Kategori *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Umbi"
                    className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Deskripsi</label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsi kategori (opsional)"
                    className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-full border-2 border-natural-bg py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-natural-sage transition-all hover:bg-natural-bg"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-3 rounded-full bg-natural-olive py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-natural-ink shadow-lg shadow-natural-olive/20 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                    {editingCategory ? 'Update' : 'Tambah'}
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
