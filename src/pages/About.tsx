import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, Sprout, Heart, Users, Award, TrendingUp, Leaf, Target, Zap } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { label: 'Petani Mitra', value: '500+', icon: <Users size={24} /> },
    { label: 'Pesanan Sukses', value: '50K+', icon: <Award size={24} /> },
    { label: 'Produk Segar', value: '200+', icon: <Leaf size={24} /> },
    { label: 'Kota Jangkauan', value: '25', icon: <TrendingUp size={24} /> },
  ];

  const features = [
    { 
      icon: <Sprout size={40} />, 
      title: "100% Organik", 
      desc: "Sayuran kami ditanam tanpa menggunakan pestisida kimia berbahaya. Setiap produk tersertifikasi organik.",
      color: "from-emerald-500 to-green-500"
    },
    { 
      icon: <Heart size={40} />, 
      title: "Pemberdayaan Petani", 
      desc: "Setiap pembelian Anda berkontribusi langsung pada kesejahteraan komunitas petani lokal Indonesia.",
      color: "from-pink-500 to-rose-500"
    },
    { 
      icon: <ShieldCheck size={40} />, 
      title: "Garansi Segar", 
      desc: "Jika sayur tidak segar saat sampai, kami ganti 100% tanpa biaya tambahan. Kepuasan Anda prioritas kami.",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: <Truck size={40} />, 
      title: "Pengiriman Cepat", 
      desc: "Pengiriman di hari yang sama untuk area tertentu. Produk sampai dalam kondisi prima.",
      color: "from-purple-500 to-indigo-500"
    },
    { 
      icon: <Target size={40} />, 
      title: "Harga Terbaik", 
      desc: "Langsung dari petani tanpa perantara. Harga lebih murah, kualitas lebih baik.",
      color: "from-orange-500 to-red-500"
    },
    { 
      icon: <Zap size={40} />, 
      title: "Teknologi Modern", 
      desc: "Platform digital yang memudahkan belanja sayur segar kapan saja, di mana saja.",
      color: "from-yellow-500 to-orange-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-bg via-white to-cream-bg">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-green via-emerald-500 to-dark-green pt-32 pb-40 px-6">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white mb-6">
              <Leaf size={16} />
              <span className="text-sm font-semibold">Tentang SayurMart</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight max-w-5xl mx-auto">
              Membawa Kesegaran Alam Dari Sawah ke Meja Anda
            </h1>

            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Misi kami sederhana: Memberdayakan petani lokal dan menyediakan sayuran berkualitas premium bagi setiap keluarga di Indonesia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 z-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-border-light hover:border-primary-green transition-all hover-lift"
            >
              <div className="text-primary-green mb-4">{stat.icon}</div>
              <h3 className="text-4xl font-bold text-text-dark mb-2">{stat.value}</h3>
              <p className="text-sm font-medium text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[48px] overflow-hidden shadow-2xl">
              {/* Video Player */}
              <video 
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/assets/video.mp4" type="video/mp4" />
                <source src="/assets/petani-video.webm" type="video/webm" />
                {/* Fallback image jika video tidak tersedia */}
                <img 
                  src="https://images.unsplash.com/photo-1595855759920-86582396736a?auto=format&fit=crop&q=80&w=1000" 
                  alt="Petani" 
                  className="w-full h-full object-cover" 
                />
              </video>
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-primary-green/20 to-emerald-500/20 rounded-[48px] -z-10 blur-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold text-text-dark leading-tight">
                Berkomitmen Pada Kualitas & Keberlanjutan
              </h2>
              <p className="text-xl text-text-muted leading-relaxed">
                SayurMart bukan sekadar marketplace. Kami adalah jembatan ekonomi yang memastikan petani mendapatkan harga yang layak, dan konsumen mendapatkan kesegaran maksimal dalam waktu kurang dari 24 jam setelah panen.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-soft-gray space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-green to-emerald-500 flex items-center justify-center text-white">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="text-lg font-bold text-text-dark">Quality Control</h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  Setiap produk melewati 3 tahap pengecekan standar nutrisi dan kebersihan.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-soft-gray space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  <Truck size={28} />
                </div>
                <h4 className="text-lg font-bold text-text-dark">Express Delivery</h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  Pengiriman di hari yang sama untuk menjaga tekstur dan vitamin sayuran.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-soft-gray to-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-text-dark mb-4">
              Mengapa Memilih SayurMart?
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Komitmen kami untuk memberikan yang terbaik bagi Anda dan petani Indonesia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white border-2 border-border-light hover:border-primary-green hover:shadow-2xl transition-all hover-lift"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
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
              Bergabunglah dengan Ribuan Pelanggan Puas
            </h2>
            <p className="text-xl text-white/90">
              Mulai belanja sayur segar hari ini dan rasakan perbedaannya
            </p>
            <button className="px-10 py-5 bg-white text-primary-green rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all">
              Mulai Belanja Sekarang
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
