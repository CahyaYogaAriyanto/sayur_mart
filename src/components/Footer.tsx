import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-text-dark via-gray-900 to-text-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-green to-emerald-500 text-white shadow-lg"
              >
                <Leaf size={24} />
              </motion.div>
              <div>
                <div className="text-2xl font-bold">
                  Sayur<span className="text-primary-green">Mart</span>
                </div>
                <div className="text-xs text-gray-400">Fresh & Healthy</div>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Platform marketplace sayuran segar terpercaya yang menghubungkan petani lokal dengan konsumen di seluruh Indonesia.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook size={20} />, href: '#' },
                { icon: <Instagram size={20} />, href: '#' },
                { icon: <Twitter size={20} />, href: '#' },
                { icon: <Youtube size={20} />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary-green flex items-center justify-center transition-all hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Menu Cepat</h3>
            <ul className="space-y-3">
              {[
                { label: 'Beranda', to: '/' },
                { label: 'Produk', to: '/products' },
                { label: 'Tentang Kami', to: '/about' },
                { label: 'Kontak', to: '/contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary-green transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-green transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Layanan Pelanggan</h3>
            <ul className="space-y-3">
              {[
                'Cara Pemesanan',
                'Kebijakan Pengiriman',
                'Pengembalian & Refund',
                'FAQ',
                'Syarat & Ketentuan',
                'Kebijakan Privasi',
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-green transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-green transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Hubungi Kami</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-green/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-primary-green" />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Alamat</div>
                  <div className="text-sm text-gray-400">
                    Jl. Petungkriyono Dk.Sikucing Ds.Yosorejo<br />
                    Petungkriyono, Pekalongan, Jawa Tengah
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-green/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-primary-green" />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Telepon</div>
                  <div className="text-sm text-gray-400">+62 853-2893-8811</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-green/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-primary-green" />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Email</div>
                  <div className="text-sm text-gray-400">support@sayurmart.id</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400 text-center md:text-left">
              &copy; {currentYear} SayurMart. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
              <span>in Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
