const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const pool = mysql.createPool({
    host: '198.38.90.50',
    port: 3306,
    database: 'bolalooc_mazdoor',
    user: 'bolalooc_maz123',
    password: 'EsbER0JeytIXlp40',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
  });

  try {
    console.log('Testing database connection...');
    
    // Test the connection
    await pool.query('SELECT 1');
    console.log('Database connection successful!');

    // Generate bcrypt hash for 'Admin@123'
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);
    console.log('Generated bcrypt hash for Admin@123:', hash);
    
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
      'admin@example.com',
      hash,
      'Admin User',
      'admin'
    ]);

    console.log('Admin user created/updated successfully!');
    console.log('Result:', result);
    
    // Verify the user was created
    const [users] = await pool.query('SELECT id, email, name, role FROM users WHERE email = ?', ['admin@example.com']);
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