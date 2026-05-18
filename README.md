# 🥬 Sayur Mart - Modern Grocery E-Commerce

Platform e-commerce modern untuk penjualan sayur dan bahan makanan segar dengan UI/UX premium.

## ✨ Features

### Public Pages
- 🏠 **Home** - Landing page dengan hero section modern
- 🛒 **Products** - Katalog produk dengan filter kategori & cart
- ℹ️ **About** - Tentang perusahaan dengan video
- 📞 **Contact** - Form kontak

### Admin Dashboard
- 📊 **Dashboard** - Overview statistik
- 📦 **Product Management** - CRUD produk dengan upload gambar
- 🏷️ **Category Management** - CRUD kategori
- 👥 **Admin User Management** - Kelola admin users
- 📥 **Export Excel** - Export data ke Excel

### Features
- ✅ Authentication (Admin only)
- ✅ Shopping Cart
- ✅ Image Upload & Compression
- ✅ Toast Notifications
- ✅ Responsive Design
- ✅ Real-time Data Sync
- ✅ Export to Excel

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Akun Supabase

### Installation

1. **Clone repository**
```bash
git clone https://github.com/yourusername/sayur-mart.git
cd sayur-mart
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
copy .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Setup database**
- Buka Supabase Dashboard → SQL Editor
- Copy-paste isi `supabase_schema.sql`
- Run SQL

5. **Run development server**
```bash
npm run dev
```
atau
```bash
START_SERVER.bat
```

Aplikasi berjalan di: http://localhost:5173

---

## 📦 Deployment

### Deploy ke Render.com

File `public/_redirects` dan `render.yaml` sudah disiapkan untuk fix masalah 404 setelah refresh.

**Quick Deploy**:
1. Push ke GitHub
2. Connect repository di Render.com
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Set environment variables
6. Deploy!

**⚠️ Penting**: File `public/_redirects` diperlukan agar routing React Router berfungsi setelah refresh.

**Lihat panduan lengkap**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📁 Project Structure

```
sayur-mart/
├── public/
│   ├── _redirects          # Redirect rules untuk deployment
│   └── assets/             # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components (Button, Badge)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CartDrawer.tsx
│   │   └── ...
│   ├── context/           # React Context (State Management)
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── CategoryContext.tsx
│   │   └── InventoryContext.tsx
│   ├── lib/               # Utilities
│   │   ├── supabase.ts    # Supabase client
│   │   ├── imageUpload.ts # Image upload helper
│   │   └── utils.ts       # Helper functions
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminManagement.tsx
│   │   ├── AdminCategories.tsx
│   │   └── AdminUsers.tsx
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── supabase_schema.sql    # Database schema
├── render.yaml            # Render deployment config
├── DEPLOYMENT.md          # Deployment guide
├── SETUP.md              # Setup guide
├── CHANGELOG.md          # Changelog
└── README.md             # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router DOM** - Routing
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Storage
  - Real-time subscriptions

### Libraries
- **XLSX** - Export to Excel
- **Sharp** (via Supabase) - Image compression

---

## 🔐 Authentication

Aplikasi ini menggunakan **admin-only authentication**. Tidak ada fitur register untuk customer.

### Membuat Admin Pertama

Setelah setup database, buat admin via Supabase Dashboard:

1. **Authentication** → **Users** → **Add User**
2. Isi email dan password
3. Buka **SQL Editor**, jalankan:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

Atau gunakan Supabase Dashboard → Table Editor → profiles → Edit role.

---

## 📊 Database Schema

Tabel utama:
- `profiles` - User profiles dengan role
- `products` - Data produk
- `product_categories` - Kategori produk
- `orders` - Order customer
- `order_items` - Item dalam order
- `carts` - Shopping cart
- `cart_items` - Item dalam cart

Lihat detail lengkap di `supabase_schema.sql`

---

## 🎨 Design System

### Color Palette
- **Primary Green**: `#22C55E`
- **Dark Green**: `#166534`
- **Light Green**: `#DCFCE7`
- **Orange Accent**: `#F97316`
- **Cream Background**: `#FFFBF5`
- **Soft Gray**: `#F3F4F6`

### Typography
- **Headings**: Plus Jakarta Sans
- **Body**: Inter

### Components
- Modern rounded corners (24px - 48px)
- Soft shadows
- Smooth animations
- Glassmorphism effects

---

## 🐛 Troubleshooting

### 404 Setelah Refresh (Deployment)
**Solusi**: Pastikan file `public/_redirects` ada dan ter-deploy.

### Supabase Connection Error
**Solusi**: 
1. Cek environment variables
2. Cek Supabase URL dan Anon Key
3. Tambahkan domain deploy di Supabase → Authentication → URL Configuration

### Image Upload Gagal
**Solusi**:
1. Cek Supabase Storage bucket sudah dibuat
2. Cek RLS policies di Storage
3. Cek file size < 5MB

### Data Tidak Muncul
**Solusi**:
1. Cek RLS policies di Supabase
2. Cek user sudah login
3. Cek role user = 'admin'

---

## 📝 Documentation

- [SETUP.md](SETUP.md) - Panduan setup lengkap
- [DEPLOYMENT.md](DEPLOYMENT.md) - Panduan deployment
- [CHANGELOG.md](CHANGELOG.md) - Log perubahan

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Dibuat dengan ❤️ untuk project Sayur Mart

---

## 🎉 Acknowledgments

- Design inspiration: Sayurbox, Tokopedia, GrabMart
- Icons: Lucide React
- UI Framework: Tailwind CSS
- Backend: Supabase
