-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS bolalooc_mazdoor;
USE bolalooc_mazdoor;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_en VARCHAR(255) NOT NULL,
  name_ur VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_ur TEXT,
  icon_url VARCHAR(255),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create labour_profiles table
CREATE TABLE IF NOT EXISTS labour_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
  photo_url VARCHAR(255),
  id_proof_url VARCHAR(255),
  experience_years INT NOT NULL DEFAULT 0,
  hourly_rate DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'suspended') NOT NULL DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  labour_id INT NOT NULL,
  category_id INT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'disputed') NOT NULL DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'paid', 'refunded') NOT NULL DEFAULT 'pending',
  notes TEXT,
  rating DECIMAL(3,2),
  review TEXT,
  dispute_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (labour_id) REFERENCES labour_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  referrer_id INT NOT NULL,
  referred_name VARCHAR(255) NOT NULL,
  referred_email VARCHAR(255),
  referred_phone VARCHAR(20) NOT NULL,
  referred_city VARCHAR(100) NOT NULL,
  referred_category VARCHAR(100),
  status ENUM('pending', 'contacted', 'registered', 'completed') NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy data for testing
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@mazdoor.com', '$2a$10$your_hashed_password', 'Admin User', 'admin'),
('staff@mazdoor.com', '$2a$10$your_hashed_password', 'Staff User', 'staff'),
('user1@example.com', '$2a$10$your_hashed_password', 'John Doe', 'staff'),
('user2@example.com', '$2a$10$your_hashed_password', 'Jane Smith', 'staff'),
('user3@example.com', '$2a$10$your_hashed_password', 'Bob Johnson', 'staff');

INSERT INTO categories (name_en, name_ur, description_en, description_ur, icon_url) VALUES
('Plumbing', 'پلمبنگ', 'Plumbing services', 'پلمبنگ کی خدمات', '/icons/plumbing.svg'),
('Electrical', 'بجلی', 'Electrical services', 'بجلی کی خدمات', '/icons/electrical.svg'),
('Carpentry', 'کارپینٹری', 'Carpentry services', 'کارپینٹری کی خدمات', '/icons/carpentry.svg'),
('Cleaning', 'صفائی', 'Cleaning services', 'صفائی کی خدمات', '/icons/cleaning.svg');

INSERT INTO labour_profiles (user_id, category_id, name, phone, email, address, city, hourly_rate, status) VALUES
(3, 1, 'Ali Ahmed', '+923001234567', 'ali@example.com', 'House 123, Street 5', 'Lahore', 500.00, 'approved'),
(4, 2, 'Ahmed Khan', '+923001234568', 'ahmed@example.com', 'House 456, Street 10', 'Karachi', 600.00, 'approved'),
(5, 3, 'Muhammad Ali', '+923001234569', 'muhammad@example.com', 'House 789, Street 15', 'Islamabad', 450.00, 'pending');

INSERT INTO bookings (customer_id, labour_id, category_id, booking_date, start_time, end_time, status, amount, payment_status) VALUES
(3, 1, 1, '2024-05-01', '09:00:00', '12:00:00', 'completed', 1500.00, 'paid'),
(4, 2, 2, '2024-05-02', '10:00:00', '14:00:00', 'confirmed', 2400.00, 'paid'),
(5, 3, 3, '2024-05-03', '08:00:00', '11:00:00', 'pending', 1350.00, 'pending');

INSERT INTO referrals (referrer_id, referred_name, referred_email, referred_phone, referred_city, referred_category, status) VALUES
(3, 'Sara Khan', 'sara@example.com', '+923001234570', 'Lahore', 'Plumbing', 'contacted'),
(4, 'Fatima Ali', 'fatima@example.com', '+923001234571', 'Karachi', 'Electrical', 'registered'),
(5, 'Aisha Ahmed', 'aisha@example.com', '+923001234572', 'Islamabad', 'Carpentry', 'pending');

