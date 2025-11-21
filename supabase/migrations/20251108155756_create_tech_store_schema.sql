/*
  # Tech Store Database Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `created_at` (timestamp)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `stock` (integer)
      - `category_id` (uuid, foreign key)
      - `image_url` (text)
      - `is_new` (boolean, for carousel)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `wishes`
      - `id` (uuid, primary key)
      - `user_name` (text)
      - `user_email` (text)
      - `product_description` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for categories and products
    - Authenticated admin-only write access for products and categories
    - Public insert for wishes
    - Admin-only read access for wishes
*/

-- Create admin_users table first
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL,
  stock integer DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text DEFAULT '',
  is_new boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create wishes table
CREATE TABLE IF NOT EXISTS wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_email text NOT NULL,
  product_description text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit wishes"
  ON wishes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view wishes"
  ON wishes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update wishes"
  ON wishes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete wishes"
  ON wishes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Insert sample categories
INSERT INTO categories (name, slug) VALUES
  ('Laptops', 'laptops'),
  ('Smartphones', 'smartphones'),
  ('Tablets', 'tablets'),
  ('Accesorios', 'accesorios'),
  ('Audio', 'audio')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, stock, category_id, image_url, is_new) VALUES
  (
    'MacBook Pro 14"',
    'Laptop profesional con chip M3 Pro, 16GB RAM, 512GB SSD',
    2499.99,
    15,
    (SELECT id FROM categories WHERE slug = 'laptops'),
    'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Dell XPS 13',
    'Ultrabook premium con Intel i7, 16GB RAM, 1TB SSD',
    1799.99,
    8,
    (SELECT id FROM categories WHERE slug = 'laptops'),
    'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'iPhone 15 Pro',
    'Smartphone con chip A17 Pro, cámara de 48MP, 256GB',
    1199.99,
    25,
    (SELECT id FROM categories WHERE slug = 'smartphones'),
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Samsung Galaxy S24',
    'Smartphone Android con Snapdragon 8 Gen 3, 12GB RAM',
    999.99,
    20,
    (SELECT id FROM categories WHERE slug = 'smartphones'),
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
    false
  ),
  (
    'iPad Air',
    'Tablet con chip M1, pantalla Liquid Retina de 10.9", 256GB',
    749.99,
    12,
    (SELECT id FROM categories WHERE slug = 'tablets'),
    'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Samsung Galaxy Tab S9',
    'Tablet Android premium con S Pen incluido, 128GB',
    649.99,
    10,
    (SELECT id FROM categories WHERE slug = 'tablets'),
    'https://images.pexels.com/photos/1334544/pexels-photo-1334544.jpeg?auto=compress&cs=tinysrgb&w=800',
    false
  ),
  (
    'AirPods Pro 2',
    'Auriculares inalámbricos con cancelación de ruido adaptativa',
    249.99,
    30,
    (SELECT id FROM categories WHERE slug = 'audio'),
    'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Sony WH-1000XM5',
    'Auriculares over-ear con la mejor cancelación de ruido',
    399.99,
    18,
    (SELECT id FROM categories WHERE slug = 'audio'),
    'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=800',
    false
  ),
  (
    'Magic Keyboard',
    'Teclado inalámbrico para Mac con Touch ID',
    149.99,
    40,
    (SELECT id FROM categories WHERE slug = 'accesorios'),
    'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800',
    false
  ),
  (
    'Logitech MX Master 3S',
    'Mouse inalámbrico ergonómico para profesionales',
    99.99,
    35,
    (SELECT id FROM categories WHERE slug = 'accesorios'),
    'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
    false
  )
ON CONFLICT DO NOTHING;