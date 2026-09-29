-- DIGITAL SHOWROOM OS - SUPABASE DATABASE SCHEMA
-- Target Showroom: Berinag, Uttarakhand, India

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE product_availability AS ENUM ('available', 'unavailable', 'low_stock');
CREATE TYPE product_status AS ENUM ('published', 'draft');

-- 3. PROFILES / ADMIN USERS
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  reference_code TEXT NOT NULL UNIQUE,
  brand TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  price_unit TEXT NOT NULL DEFAULT 'sq.ft',
  size TEXT,
  thickness TEXT,
  finish TEXT,
  color TEXT,
  material TEXT,
  look TEXT,
  space TEXT,
  description TEXT,
  availability product_availability NOT NULL DEFAULT 'available',
  status product_status NOT NULL DEFAULT 'published',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SHOP SETTINGS
CREATE TABLE IF NOT EXISTS shop_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_name TEXT NOT NULL DEFAULT 'Berinag Tiles & Showroom',
  tagline TEXT DEFAULT 'Premium Architectural Materials & Tiles',
  logo_url TEXT,
  description TEXT DEFAULT 'Discover designs, colours and finishes before you visit our showroom in Berinag, Uttarakhand.',
  phone TEXT NOT NULL DEFAULT '+91 94120 00000',
  whatsapp TEXT NOT NULL DEFAULT '+91 94120 00000',
  address TEXT NOT NULL DEFAULT 'Main Market, Near Petrol Pump, Berinag, Pithoragarh, Uttarakhand 262531',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Berinag+Uttarakhand',
  opening_hours TEXT NOT NULL DEFAULT 'Mon - Sun: 9:00 AM - 7:30 PM',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  facebook_url TEXT DEFAULT 'https://facebook.com',
  hero_image_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE & SEARCH
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_reference_code ON products(reference_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status_avail ON products(status, availability);
CREATE INDEX IF NOT EXISTS idx_products_look ON products(look);
CREATE INDEX IF NOT EXISTS idx_products_finish ON products(finish);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;

-- Public READ Policies
CREATE POLICY "Public users can view active categories"
  ON categories FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Public users can view published products"
  ON products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public users can view images of published products"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.status = 'published'
    )
  );

CREATE POLICY "Public users can view shop settings"
  ON shop_settings FOR SELECT
  USING (TRUE);

-- Authenticated Admin Policies (ALL operations)
CREATE POLICY "Admins have full access to profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Admins have full access to categories"
  ON categories FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Admins have full access to products"
  ON products FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Admins have full access to product_images"
  ON product_images FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Admins have full access to shop_settings"
  ON shop_settings FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- 10. STORAGE BUCKET CONFIGURATION
-- Run in Supabase SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('showroom-media', 'showroom-media', true);
-- CREATE POLICY "Public read showroom media" ON storage.objects FOR SELECT USING (bucket_id = 'showroom-media');
-- CREATE POLICY "Admin upload showroom media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'showroom-media');
-- CREATE POLICY "Admin update showroom media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'showroom-media');
-- CREATE POLICY "Admin delete showroom media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'showroom-media');
