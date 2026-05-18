# 🚀 Setup Sayur Mart

## 📋 Prerequisites

- Node.js (v18+)
- npm atau yarn
- Akun Supabase

---

## 🔧 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` ke `.env`:
```bash
copy .env.example .env
```

Edit `.env` dan isi dengan credentials Supabase Anda:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database
Jalankan SQL schema di Supabase SQL Editor:
```bash
# File: supabase_schema.sql
```

Buka Supabase Dashboard → SQL Editor → Paste isi file `supabase_schema.sql` → Run

---

## 🏃 Running the App

### Development Server
```bash
npm run dev
```
atau gunakan:
```bash
START_SERVER.bat
```

Aplikasi akan berjalan di: http://localhost:5173

---

## 📁 Project Structure

```
sayur-mart/
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React Context (State Management)
│   ├── lib/            # Utilities & Supabase client
│   ├── pages/          # Page components
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── supabase_schema.sql # Database schema
├── .env               # Environment variables
└── START_SERVER.bat   # Quick start script
```

---

## 🔑 Default Admin Login

Setelah setup database, buat admin pertama dengan:

1. Buka Supabase SQL Editor
2. Jalankan query:
```sql
-- Ganti dengan email dan password Anda
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@sayurmart.com', crypt('password123', gen_salt('bf')), NOW());

-- Ambil ID user yang baru dibuat
SELECT id FROM auth.users WHERE email = 'admin@sayurmart.com';

-- Update profile jadi admin (ganti USER_ID dengan ID dari query di atas)
UPDATE profiles SET role = 'admin' WHERE id = 'USER_ID';
```

Atau lebih mudah, gunakan Supabase Dashboard → Authentication → Add User

---

## 🎯 Features

### Public Pages
- 🏠 Home (Landing page)
- 🛒 Products (Shopping)
- ℹ️ About
- 📞 Contact

### Admin Dashboard
- 📊 Dashboard Overview
- 📦 Product Management (CRUD)
- 🏷️ Category Management (CRUD)
- 👥 Admin User Management
- 📥 Export to Excel

---

## 🐛 Troubleshooting

### Error: "Supabase credentials are missing"
- Pastikan file `.env` sudah dibuat
- Cek apakah `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah diisi
- Restart dev server setelah edit `.env`

### Error: "Database error"
- Pastikan schema sudah dijalankan di Supabase
- Cek RLS policies sudah aktif
- Cek koneksi internet

### Login tidak bisa
- Pastikan sudah buat admin user
- Cek role di tabel `profiles` adalah 'admin'
- Cek email dan password benar

---

## 📝 Notes

- Aplikasi menggunakan Supabase untuk backend
- Authentication menggunakan Supabase Auth
- Storage menggunakan Supabase Storage
- Real-time updates menggunakan Supabase Realtime

---

## 🎉 Done!

Aplikasi siap digunakan! 🚀
