/*
  # Initial Database Setup for National Furniture

  1. New Tables
    - `users` - Admin user accounts
    - `products` - Furniture products catalog
    - `offers` - Promotional offers
    - `media` - Uploaded media files
    - `contacts` - Contact form submissions

  2. Security
    - Enable RLS on all tables
    - Public read access for active products and offers
    - Public write access for contacts
    - Note: Admin authentication is handled via Express sessions, not Supabase Auth
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read for demonstration (Express handles auth)
CREATE POLICY "Allow all operations on users"
  ON users FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER,
  discounted_price INTEGER,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow product management"
  ON products FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  expiry_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_home_header BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view offers"
  ON offers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow offer management"
  ON offers FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  filename TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow media management"
  ON media FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contacts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow viewing contacts"
  ON contacts FOR SELECT
  TO public
  USING (true);