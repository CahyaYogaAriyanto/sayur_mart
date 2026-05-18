import React, { useState, useMemo } from 'react';
import { useInventory, Vegetable } from '../context/InventoryContext';
import { useCategories } from '../context/CategoryContext';
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon, FileDown, Search, Upload, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';
import { Badge } from '../components/ui/Badge';
import { uploadImageToSupabase, validateImageFile, deleteImageFromSupabase } from '../lib/imageUpload';

export const AdminManagement: React.FC = () => {
  const { vegetables, addVegetable, updateVegetable, deleteVegetable, fetchVegetables } = useInventory();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredVegetables = useMemo(() => {
    return vegetables.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vegetables, searchQuery]);

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

    // Create header rows
    const headerData = [
      ['LAPORAN INVENTARIS PRODUK'],
      ['SAYUR MART'],
      [''],
      [`Tanggal: ${dateStr}`],
      [`Waktu: ${timeStr}`],
      [''],
      ['No', 'Nama Produk', 'Kategori', 'Harga (Rp)', 'Satuan', 'Stok', 'Total Nilai (Rp)'],
    ];

    // Prepare data (tanpa deskripsi, stok minimum, status)
    const dataRows = vegetables.map((v, index) => [
      index + 1,
      v.name,
      v.category || '-',
      v.price,
      v.unit,
      v.stock,
      v.price * v.stock,
    ]);

    // Combine header and data
    const allData = [...headerData, ...dataRows];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(allData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },   // No
      { wch: 30 },  // Nama Produk
      { wch: 15 },  // Kategori
      { wch: 15 },  // Harga
      { wch: 10 },  // Satuan
      { wch: 10 },  // Stok
      { wch: 18 },  // Total Nilai
    ];

    // Merge cells for header
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Title row 1
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Title row 2
    ];

    // Apply styles to header row (row 7, index 6)
    const headerRowIndex = 6;
    const headerCells = ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7'];
    
    headerCells.forEach(cell => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          fill: {
            fgColor: { rgb: "4CAF50" } // Green color
          },
          font: {
            bold: true,
            color: { rgb: "FFFFFF" } // White text
          },
          alignment: {
            horizontal: "center",
            vertical: "center"
          }
        };
      }
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Inventaris");

    // Generate filename with timestamp
    const timestamp = today.toISOString().split('T')[0];
    const filename = `Laporan_Inventaris_SayurMart_${timestamp}.xlsx`;

    // Write file with cellStyles option
    XLSX.writeFile(workbook, filename, { cellStyles: true });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeg, setEditingVeg] = useState<Vegetable | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    unit: 'kg',
    stock: 0,
    min_stock: 5,
    category: '',
    image_url: '',
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const openAdd = () => {
    setEditingVeg(null);
    setFormData({ 
      name: '', 
      description: '',
      price: 0, 
      unit: 'kg',
      stock: 0, 
      min_stock: 5,
      category: '', 
      image_url: '',
      is_active: true
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEdit = (veg: Vegetable) => {
    setEditingVeg(veg);
    
    // Find category name from category_id
    let categoryName = '';
    if (veg.category_id) {
      const foundCategory = categories.find(cat => cat.id === veg.category_id);
      categoryName = foundCategory ? foundCategory.name : '';
    } else if (veg.category) {
      // Fallback to legacy category field
      categoryName = veg.category;
    }
    
    setFormData({
      name: veg.name,
      description: veg.description || '',
      price: veg.price,
      unit: veg.unit,
      stock: veg.stock,
      min_stock: veg.min_stock || 5,
      category: categoryName,
      image_url: veg.image_url,
      is_active: veg.is_active
    });
    setImageFile(null);
    setImagePreview(veg.image_url);
    setIsModalOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      validateImageFile(file);
      
      // Set file and preview
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      alert(error.message);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let imageUrl = formData.image_url;

      // Upload image if new file selected
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadImageToSupabase(imageFile);
        setUploadingImage(false);
      }

      // Find category_id from category name
      const selectedCategory = categories.find(cat => cat.name === formData.category);
      const category_id = selectedCategory ? selectedCategory.id : null;

      const dataToSubmit = {
        ...formData,
        category_id, // Use category_id instead of category name
        image_url: imageUrl
      };

      if (editingVeg) {
        // Delete old image if new one uploaded
        if (imageFile && editingVeg.image_url && editingVeg.image_url !== imageUrl) {
          await deleteImageFromSupabase(editingVeg.image_url);
        }
        await updateVegetable(editingVeg.id, dataToSubmit);
        showToast('Produk berhasil diupdate!', 'success');
      } else {
        await addVegetable(dataToSubmit as Omit<Vegetable, "id">);
        showToast('Produk berhasil ditambahkan!', 'success');
      }
      
      // Refresh data untuk memastikan sinkronisasi
      await fetchVegetables();
      
      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview('');
    } catch (err: any) {
      console.error('Error saving product:', err);
      showToast(err.message || "Gagal menyimpan produk", 'error');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await deleteVegetable(id);
        showToast('Produk berhasil dihapus', 'success');
        await fetchVegetables();
      } catch (err: any) {
        console.error('Error deleting product:', err);
        showToast(err.message || "Gagal menghapus produk", 'error');
      }
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
              toast.type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span className="font-semibold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-light tracking-tight text-natural-olive font-serif">Data Master Sayur</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-natural-sage">Pengaturan Inventaris Secara Real-time</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative group mr-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-sage group-focus-within:text-natural-olive transition-colors" size={18} />
            <input
              type="text"
              placeholder="Cari sayur..."
              className="rounded-full border-2 border-natural-border bg-white px-5 py-3 pl-12 text-sm outline-none transition-all focus:border-natural-olive w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={exportToExcel}
            className="flex items-center justify-center gap-3 rounded-full border-2 border-natural-olive px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-natural-olive transition-all hover:bg-natural-olive hover:text-white"
          >
            <FileDown size={18} />
            Export Excel
          </button>
          
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-3 rounded-full bg-natural-olive px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-natural-ink hover:shadow-xl hover:shadow-natural-olive/20"
          >
            <Plus size={18} />
            Tambah Data
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-[40px] border border-natural-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-natural-border bg-natural-cream/30">
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-natural-sage">Produk</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-natural-sage">Kategori</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-natural-sage">Harga Jual</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-natural-sage">Status Stok</th>
                <th className="px-10 py-6 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-natural-sage">Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-bg">
              {filteredVegetables.map((veg) => (
                <tr key={veg.id} className="transition-all hover:bg-natural-bg/50 group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-natural-bg border border-natural-border group-hover:scale-105 transition-transform">
                        <img 
                          src={veg.image_url || 'http://via.placeholder.com/64'} 
                          alt={veg.name} 
                          className="h-full w-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f5f5f0" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-base font-bold text-natural-olive tracking-tight uppercase leading-tight">{veg.name}</p>
                        <p className="text-[10px] font-medium text-natural-sage tracking-widest mt-0.5 uppercase">ID: {veg.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <Badge variant="info">{veg.category}</Badge>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xl font-light text-natural-ink font-serif tracking-tight">Rp {veg.price.toLocaleString('id-ID')}</p>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          veg.stock > 10 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                          veg.stock > 0 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : 
                          "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                        )} />
                        <span className="font-bold text-natural-ink text-xs uppercase tracking-widest">{veg.stock} Unit</span>
                      </div>
                      <div className="w-24 h-1 bg-natural-bg rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-700",
                            veg.stock > 10 ? "bg-emerald-500" : veg.stock > 0 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${Math.min((veg.stock / 50) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => openEdit(veg)}
                        className="rounded-xl p-3 text-natural-sage transition-all hover:bg-natural-accent hover:text-natural-olive shadow-sm"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(veg.id)}
                        className="rounded-xl p-3 text-natural-sage transition-all hover:bg-red-50 hover:text-red-500 shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredVegetables.map((veg) => (
          <div key={veg.id} className="rounded-3xl border border-natural-border bg-white p-6 shadow-sm">
            <div className="flex gap-4">
              {/* Image */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-natural-bg border border-natural-border">
                <img 
                  src={veg.image_url || 'http://via.placeholder.com/96'} 
                  alt={veg.name} 
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23f5f5f0" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-natural-olive uppercase tracking-tight truncate">{veg.name}</h3>
                    <p className="text-xs text-natural-sage mt-1">ID: {veg.id.slice(0, 8)}</p>
                  </div>
                  <Badge variant="info" className="flex-shrink-0">{veg.category}</Badge>
                </div>

                <div className="space-y-3 mt-4">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-natural-sage uppercase tracking-wider">Harga</span>
                    <span className="text-lg font-light text-natural-ink font-serif">Rp {veg.price.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-natural-sage uppercase tracking-wider">Stok</span>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          veg.stock > 10 ? "bg-emerald-500" : 
                          veg.stock > 0 ? "bg-amber-500" : 
                          "bg-rose-500 animate-pulse"
                        )} />
                        <span className="font-bold text-natural-ink text-xs uppercase">{veg.stock} Unit</span>
                      </div>
                    </div>
                    <div className="w-full h-1 bg-natural-bg rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-700",
                          veg.stock > 10 ? "bg-emerald-500" : veg.stock > 0 ? "bg-amber-500" : "bg-rose-500"
                        )} 
                        style={{ width: `${Math.min((veg.stock / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => openEdit(veg)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-natural-sage transition-all hover:bg-natural-accent hover:text-natural-olive border border-natural-border text-xs font-bold uppercase tracking-wider"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(veg.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-natural-sage transition-all hover:bg-red-50 hover:text-red-500 border border-natural-border text-xs font-bold uppercase tracking-wider"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[40px] bg-white shadow-2xl shadow-natural-olive/20"
            >
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-6 sm:p-10 pb-4 sm:pb-6 flex items-center justify-between border-b border-natural-bg">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-natural-olive font-serif">
                    {editingVeg ? 'Edit Data Sayur' : 'Tambah Produk Baru'}
                  </h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-natural-sage">Formulir Inventaris Sayurmart</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 sm:p-3 hover:bg-natural-bg text-natural-sage transition-colors flex-shrink-0"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8" id="product-form">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {/* Nama Produk */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Nama Produk *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Wortel Organik"
                      className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Deskripsi */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Deskripsi</label>
                    <textarea
                      rows={3}
                      placeholder="Deskripsi produk (opsional)"
                      className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  
                  {/* Harga */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Harga (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="100"
                      placeholder="15000"
                      className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white font-serif text-lg"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  {/* Unit */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Satuan *</label>
                    <select
                      required
                      className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white cursor-pointer"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="ikat">Ikat</option>
                      <option value="buah">Buah</option>
                      <option value="pack">Pack</option>
                    </select>
                  </div>

                  {/* Stok */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Stok Tersedia *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      placeholder="50"
                      className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  {/* Min Stock */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Stok Minimum</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="5"
                      className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white"
                      value={formData.min_stock}
                      onChange={(e) => setFormData({ ...formData, min_stock: parseFloat(e.target.value) || 5 })}
                    />
                    <p className="text-[9px] text-natural-sage ml-1">Alert jika stok di bawah nilai ini</p>
                  </div>

                  {/* Kategori */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Kategori *</label>
                    <select
                      required
                      className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 px-5 py-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Aktif */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Status</label>
                    <div className="flex items-center gap-4 px-5 py-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="is_active"
                          checked={formData.is_active === true}
                          onChange={() => setFormData({ ...formData, is_active: true })}
                          className="w-4 h-4 text-natural-olive"
                        />
                        <span className="text-sm text-natural-olive font-medium">Aktif</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="is_active"
                          checked={formData.is_active === false}
                          onChange={() => setFormData({ ...formData, is_active: false })}
                          className="w-4 h-4 text-natural-sage"
                        />
                        <span className="text-sm text-natural-sage font-medium">Nonaktif</span>
                      </label>
                    </div>
                  </div>

                  {/* Upload Gambar */}
                  <div className="sm:col-span-2 space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">
                      Upload Gambar Produk
                    </label>
                    
                    {/* Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className={cn(
                          "flex items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed border-natural-border bg-natural-bg/50 px-6 py-8 cursor-pointer transition-all hover:border-natural-olive hover:bg-natural-accent/30",
                          uploadingImage && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="animate-spin text-natural-olive" size={24} />
                            <span className="text-sm font-medium text-natural-olive">
                              Mengupload & Mengkompress...
                            </span>
                          </>
                        ) : imagePreview ? (
                          <>
                            <CheckCircle className="text-emerald-500" size={24} />
                            <span className="text-sm font-medium text-natural-olive">
                              Gambar dipilih - Klik untuk ganti
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="text-natural-sage" size={24} />
                            <div className="text-center">
                              <span className="text-sm font-medium text-natural-olive block">
                                Klik untuk upload gambar
                              </span>
                              <span className="text-xs text-natural-sage mt-1 block">
                                JPG, PNG, WebP (Max 5MB)
                              </span>
                            </div>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative rounded-2xl border-2 border-natural-border overflow-hidden bg-natural-bg">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-64 object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                            setFormData({ ...formData, image_url: '' });
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={16} />
                        </button>
                        {imageFile && (
                          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB → akan dikompres
                          </div>
                        )}
                      </div>
                    )}

                    {/* URL Manual (Optional) */}
                    <details className="mt-4">
                      <summary className="text-xs text-natural-sage cursor-pointer hover:text-natural-olive ml-1">
                        Atau masukkan URL gambar manual
                      </summary>
                      <div className="mt-3 relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-sage" size={20} />
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-natural-sage focus:bg-white"
                          value={formData.image_url}
                          onChange={(e) => {
                            setFormData({ ...formData, image_url: e.target.value });
                            setImagePreview(e.target.value);
                            setImageFile(null);
                          }}
                        />
                      </div>
                    </details>
                  </div>
                </div>
                </form>
              </div>

              {/* Footer - Fixed */}
              <div className="flex-shrink-0 px-6 sm:px-10 py-6 border-t border-natural-bg">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-full border-2 border-natural-bg py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-natural-sage transition-all hover:bg-natural-bg"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    form="product-form"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-3 rounded-full bg-natural-olive py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-natural-ink shadow-lg shadow-natural-olive/20 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                    {editingVeg ? 'Update Produk' : 'Tambah Produk'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
