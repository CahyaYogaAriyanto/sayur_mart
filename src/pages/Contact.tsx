import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-natural-bg pb-24">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 text-center bg-white border-b border-natural-border">
        <div className="space-y-6 max-w-4xl mx-auto">
          <Badge variant="info" className="px-4 py-1.5 uppercase font-bold tracking-widest">Hubungi Kami</Badge>
          <h1 className="text-6xl md:text-7xl font-light text-natural-olive font-serif leading-tight">Kami Siap <span className="italic">Membantu Anda</span></h1>
          <p className="text-natural-sage text-lg font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">Ada pertanyaan tentang pesanan atau ingin bekerja sama sebagai mitra petani? Tim kami siap melayani Anda.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12 py-24 grid lg:grid-cols-12 gap-16">
        {/* Info Blocks */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-10">
            <h2 className="text-4xl font-light text-natural-olive font-serif">Informasi Kontak</h2>
            <div className="space-y-8">
              {[
                { icon: MapPin, title: "Kantor Pusat", detail: "Jl. Petungkriyono,Pekalongan, Jawa Tengah" },
                { icon: Phone, title: "Layanan Pelanggan", detail: "+62 853-2893-8811 (WA Available)" },
                { icon: Mail, title: "Email Support", detail: "support@sayurmart.id" },
                { icon: Clock, title: "Jam Operasional", detail: "Senin - Minggu (08.00 - 17.00 WIB)" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-natural-border flex items-center justify-center text-natural-olive shadow-sm group-hover:bg-natural-olive group-hover:text-white transition-all duration-300">
                    <item.icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-natural-sage">{item.title}</h4>
                    <p className="text-lg font-bold text-natural-olive tracking-tight leading-tight">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-natural-olive p-10 rounded-[48px] text-white space-y-6 shadow-2xl shadow-natural-olive/20">
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-3xl font-light font-serif leading-tight">Butuh Respon Cepat?</h3>
            <p className="opacity-70 text-sm leading-relaxed">Gunakan fitur Live Chat kami di pojok kanan bawah dashboard Admin atau hubungi kami via WhatsApp Business untuk bantuan darurat.</p>
            <Button className="w-full bg-white text-natural-olive hover:bg-natural-accent h-16 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Chat Via WhatsApp</Button>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white rounded-[64px] p-12 shadow-2xl shadow-natural-olive/5 border border-natural-border">
          <form className="space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full h-16 rounded-2xl border-2 border-natural-bg bg-natural-bg/30 px-6 text-sm outline-none transition-all focus:border-natural-olive focus:bg-white"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full h-16 rounded-2xl border-2 border-natural-bg bg-natural-bg/30 px-6 text-sm outline-none transition-all focus:border-natural-olive focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Subjek Pesan</label>
              <select className="w-full h-16 rounded-2xl border-2 border-natural-bg bg-natural-bg/30 px-6 text-sm outline-none transition-all focus:border-natural-olive focus:bg-white cursor-pointer">
                <option>Pertanyaan Pesanan</option>
                <option>Kemitraan Petani</option>
                <option>Keluhan & Saran</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-natural-sage ml-1">Isi Pesan</label>
              <textarea 
                rows={6}
                placeholder="Bagaimana kami bisa membantu Anda hari ini?"
                className="w-full rounded-2xl border-2 border-natural-bg bg-natural-bg/30 p-6 text-sm outline-none transition-all focus:border-natural-olive focus:bg-white resize-none"
              ></textarea>
            </div>

            <Button size="lg" className="h-16 w-full rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-natural-olive/10 group">
              Kirim Pesan Sekarang <Send size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};
