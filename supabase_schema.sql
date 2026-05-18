-- SAYUR MART PRODUCTION-READY SUPABASE SCHEMA

-- 1. UTILS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processed', 'shipped', 'completed', 'cancelled');
CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'ADJUSTMENT');
CREATE TYPE movement_source AS ENUM ('order', 'restock', 'manual');

-- 3. TABLES

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'customer' NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg', -- kg, ikat, buah, pack
  stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  min_stock DECIMAL(12,2) NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders (Restock)
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  order_date DATE DEFAULT CURRENT_DATE,
  total_amount DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'ordered', -- ordered, received, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  qty DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goods Receipts (Incoming Stock)
CREATE TABLE goods_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_id UUID REFERENCES purchase_orders(id),
  received_date TIMESTAMPTZ DEFAULT NOW(),
  received_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE goods_receipt_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id UUID REFERENCES goods_receipts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  qty_received DECIMAL(12,2) NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id),
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_address TEXT,
  payment_method TEXT,
  payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  qty DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) GENERATED ALWAYS AS (qty * unit_price) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock Movements (History)
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type movement_type NOT NULL,
  source movement_source NOT NULL,
  qty DECIMAL(12,2) NOT NULL,
  reference_id UUID, -- order_id or receipt_id
  notes TEXT,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart System
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  qty DECIMAL(12,2) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- Settings
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRIGGERS

-- Updated At Triggers
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tr_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- Auto Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Stock Management: Decrease on Order
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into stock movements
  INSERT INTO stock_movements (product_id, type, source, qty, reference_id, notes)
  SELECT product_id, 'OUT', 'order', qty, NEW.order_id, 'Pemesanan baru'
  FROM order_items WHERE order_id = NEW.order_id;

  -- Update products table
  UPDATE products p
  SET stock = p.stock - oi.qty
  FROM order_items oi
  WHERE p.id = oi.product_id AND oi.order_id = NEW.order_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Stock Management: Increase on Receipt
CREATE OR REPLACE FUNCTION update_stock_after_receipt()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert movement record
  INSERT INTO stock_movements (product_id, type, source, qty, reference_id, notes)
  SELECT product_id, 'IN', 'restock', qty_received, NEW.id, 'Barang masuk dari PO'
  FROM goods_receipt_items WHERE receipt_id = NEW.id;

  -- Update product stock
  UPDATE products p
  SET stock = p.stock + gri.qty_received
  FROM goods_receipt_items gri
  WHERE p.id = gri.product_id AND gri.receipt_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_order_stock_update
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE PROCEDURE update_stock_after_order();

CREATE TRIGGER tr_receipt_stock_update
  AFTER INSERT ON goods_receipts
  FOR EACH ROW EXECUTE PROCEDURE update_stock_after_receipt();


-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- PUBLIC / CUSTOMER Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Categories are viewable by everyone." ON product_categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (is_active = true OR get_user_role() IN ('admin', 'staff'));

CREATE POLICY "Customers can see their own orders." ON orders FOR SELECT USING (auth.uid() = customer_id OR get_user_role() IN ('admin', 'staff'));
CREATE POLICY "Customers can insert their own orders." ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can see their own order items." ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (customer_id = auth.uid() OR get_user_role() IN ('admin', 'staff')))
);

CREATE POLICY "Customers can manage their own cart." ON carts FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Customers can manage their own cart items." ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE id = cart_id AND customer_id = auth.uid())
);

-- ADMIN / STAFF Policies
CREATE POLICY "Admins have full access." ON profiles FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin/Staff can manage categories." ON product_categories FOR ALL USING (get_user_role() IN ('admin', 'staff'));
CREATE POLICY "Admin/Staff can manage products." ON products FOR ALL USING (get_user_role() IN ('admin', 'staff'));
CREATE POLICY "Admin/Staff can manage suppliers." ON suppliers FOR ALL USING (get_user_role() IN ('admin', 'staff'));
CREATE POLICY "Admin/Staff can manage purchase orders." ON purchase_orders FOR ALL USING (get_user_role() IN ('admin', 'staff'));
CREATE POLICY "Admin/Staff can manage receipts." ON goods_receipts FOR ALL USING (get_user_role() IN ('admin', 'staff'));
CREATE POLICY "Admin/Staff can view stock movements." ON stock_movements FOR SELECT USING (get_user_role() IN ('admin', 'staff'));

-- 6. INDEXES
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
