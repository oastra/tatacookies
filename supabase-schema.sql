-- TaTaCookies Shop Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'type' CHECK (type IN ('seasonal', 'type')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  season_start TEXT, -- MM-DD format
  season_end TEXT,   -- MM-DD format
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_aud NUMERIC(10,2) NOT NULL,
  stripe_price_id TEXT,
  stock_count INT DEFAULT 0,
  sku TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled')),
  subtotal_aud NUMERIC(10,2),
  total_aud NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  product_title TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  price_aud NUMERIC(10,2) NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for shop
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public can read active products"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read product_categories"
  ON product_categories FOR SELECT USING (true);

CREATE POLICY "Public can read active variants"
  ON product_variants FOR SELECT USING (is_active = true);

-- Admin full access (any authenticated user = admin)
CREATE POLICY "Admin full access on categories"
  ON categories FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access on products"
  ON products FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access on product_categories"
  ON product_categories FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access on product_variants"
  ON product_variants FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access on orders"
  ON orders FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access on order_items"
  ON order_items FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================
-- SEED CATEGORIES
-- ============================================

INSERT INTO categories (name, slug, type, sort_order) VALUES
  -- Seasonal
  ('Valentine''s Day', 'valentines-day', 'seasonal', 1),
  ('Easter', 'easter', 'seasonal', 2),
  ('Halloween', 'halloween', 'seasonal', 3),
  ('Christmas', 'christmas', 'seasonal', 4),
  ('Wedding', 'wedding', 'seasonal', 5),
  ('Baby Shower', 'baby-shower', 'seasonal', 6),
  ('Birthday', 'birthday', 'seasonal', 7),
  -- Type
  ('Single Cookies', 'single-cookies', 'type', 10),
  ('Gift Boxes', 'gift-boxes', 'type', 11),
  ('Custom Sets', 'custom-sets', 'type', 12),
  ('Party Packs', 'party-packs', 'type', 13);

-- ============================================
-- ATOMIC STOCK DECREMENT FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION decrement_stock(p_variant_id UUID, p_qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE product_variants
  SET stock_count = stock_count - p_qty
  WHERE id = p_variant_id AND stock_count >= p_qty;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for variant %', p_variant_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Create via Supabase Dashboard:
-- Bucket name: product-images
-- Public: true
-- Allowed MIME types: image/webp, image/png, image/jpeg
-- Max file size: 5MB
