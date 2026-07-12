-- B2B Website Database Schema for Cloudflare D1

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  detailed_description TEXT,
  specifications TEXT,
  image_url TEXT,
  gallery_images TEXT, -- JSON array of image URLs
  category TEXT,
  is_featured BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  country TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, completed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_iterations INTEGER NOT NULL DEFAULT 100000,
  email TEXT,
  role TEXT DEFAULT 'admin', -- super_admin, admin
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_product ON inquiries(product_id);


INSERT OR IGNORE INTO admins (username, password_hash, password_salt, password_iterations, email, role)
VALUES
('ththelp', 'c3a2481765f87618ac4345963e7685247d282cdfafe0af0a87ead8275a40052c', '6b3d215f832df8a6a6045254d9b2d0ac', 100000, 'jasonwu@smthelp.com', 'super_admin'),
('thtsales', '06b541d19add9d83a62ac6f7f5ecb5a5d9b7bb5aec68d5565f5961187e7ecfd2', 'bb67d1303804fedfadfbf6f8f02c6259', 100000, 'jasonwu@smthelp.com', 'admin');

-- Insert verified THT product records
INSERT OR IGNORE INTO products (id, name, description, detailed_description, specifications, image_url, category, is_featured)
VALUES
(1, 'S3010A Radial Auto Insertion Machine', 'Automatic insertion for radial capacitors, LEDs and transistors.', 'A radial component insertion platform for THT PCB production. Final feeder, tooling and application compatibility are confirmed from component and PCB samples.', 'Rated speed: 12,000 CPH\nApplication: Radial THT components\nConfiguration: Confirmed case by case', 'https://hk03-1251009151.file.myqcloud.com/smthelp.com/shop_imgs/2023-6-29-16879999218660.png', 'Radial Insertion', 1),
(2, 'S4000 Axial Auto Insertion Machine', 'Automatic insertion for diodes, resistors and axial components.', 'An axial component insertion platform for THT PCB production. Final feeder, tooling and application compatibility are confirmed from component and PCB samples.', 'Rated speed: 13,000 CPH\nApplication: Axial THT components\nConfiguration: Confirmed case by case', 'https://hk03-1251009151.file.myqcloud.com/smthelp.com/shop_imgs/2023-6-29-16879999218660.png', 'Axial Insertion', 1),
(3, 'S7900 Odd Form Insertion Machine', 'Configurable insertion for transformers, connectors and large electrolytic capacitors.', 'An odd-form insertion platform configured around component geometry, feeding method, insertion force and PCB support requirements.', 'Application: Odd-form THT components\nSpeed: Application dependent\nConfiguration: Engineering confirmation required', 'https://hk03-1251009151.file.myqcloud.com/smthelp.com/desc/2019/05/%E5%9B%BE%E7%89%872-1.png', 'Odd Form Insertion', 1);
