import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Trash2, CheckCircle, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { cn } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Formating WhatsApp Message
    const itemDetails = cart.map(item => 
      `• ${item.name} (${item.quantity} unit/kg) - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    ).join('\n');

    const message = `Halo SayurMart! 👋\nSaya ingin melakukan pemesanan sayur segar:\n\n${itemDetails}\n\n━━━━━━━━━━━━━━\n*Total Pesanan: Rp ${totalPrice.toLocaleString('id-ID')}*\n━━━━━━━━━━━━━━\n\nMohon informasi selanjutnya untuk pengiriman. Terima kasih! 🥬✨`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6285328938811?text=${encodedMessage}`;
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show Success State
    setIsSuccess(true);
    
    // Clear cart after short delay
    setTimeout(() => {
      clearCart();
    }, 1000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[70] bg-natural-olive/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[80] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-8 border-b border-natural-border">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-natural-accent text-natural-olive">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-natural-olive font-serif">Keranjang</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-natural-sage">{totalItems} Item terpilih</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-natural-bg rounded-full text-natural-sage">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
                    <CheckCircle size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-light text-natural-olive font-serif">Pesanan Terkirim!</h3>
                    <p className="text-sm font-medium uppercase tracking-widest text-natural-sage px-6 leading-relaxed">
                      Daftar pesanan Anda telah diteruskan ke WhatsApp kami. Mohon tunggu konfirmasi selanjutnya.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleClose} className="rounded-2xl px-10">Kembali Belanja</Button>
                </motion.div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-natural-bg flex items-center justify-center text-natural-sage/30">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-natural-sage font-medium uppercase tracking-widest text-sm">Keranjang masih kosong</p>
                  <Button variant="outline" onClick={onClose}>Mulai Belanja</Button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="h-20 w-20 rounded-2xl border border-natural-border overflow-hidden bg-natural-bg shrink-0">
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-natural-olive uppercase tracking-tight">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-natural-sage hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-natural-sage capitalize">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-natural-olive">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                        <div className="flex items-center gap-3 bg-natural-bg rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-natural-olive text-natural-sage">
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-natural-olive text-natural-sage">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!isSuccess && cart.length > 0 && (
              <div className="p-8 border-t border-natural-border space-y-6 bg-natural-bg/30">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest text-natural-sage">Total Pembayaran</span>
                  <span className="text-3xl font-light text-natural-olive font-serif italic">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-16 shadow-xl shadow-natural-olive/20 group"
                >
                  Pesan via WhatsApp <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
