const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  // Read DB connection from environment variables so this script can run
  // against any environment (local or production) without editing the file.
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '198.38.90.50',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'bolalooc_mazdoor',
    user: process.env.DB_USER || 'bolalooc_maz123',
    password: process.env.DB_PASS || 'EsbER0JeytIXlp40',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
  });

  try {
    console.log('Testing database connection...');
    
    // Test the connection
    await pool.query('SELECT 1');
    console.log('Database connection successful!');

  // Admin credentials can be provided via environment variables.
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hash = await bcrypt.hash(password, 10);
  console.log('Generated bcrypt hash for admin password (hidden)');
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash verification:', isValid);

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table created/verified');

    // Insert or update the admin user
    const [result] = await pool.query(`
      INSERT INTO users (email, password_hash, name, role) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        password_hash = VALUES(password_hash),
        role = VALUES(role)
    `, [
      adminEmail,
      hash,
      'Admin User',
      'admin'
    ]);

    console.log('Admin user created/updated successfully!');
    console.log('Result:', result);
    
    // Verify the user was created
  const [users] = await pool.query('SELECT id, email, name, role FROM users WHERE email = ?', [adminEmail]);
    console.log('Created user:', users[0]);
    
  } catch (error) {
    console.error('Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ETIMEDOUT') {
      console.error('Connection timeout. Please check:');
      console.error('1. Database server is running');
      console.error('2. Firewall allows connections on port 3306');
      console.error('3. Database credentials are correct');
      console.error('4. Network connectivity to 198.38.90.50');
    }
  } finally {
    await pool.end();
  }
}

createAdminUser(); 