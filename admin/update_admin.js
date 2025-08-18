const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
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
    // Generate a fresh hash for 'admin123'
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log('Generated new hash:', hash);
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash verification:', isValid);

    // First, check if the users table exists and has the correct structure
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

    // Then, insert or update the admin user with the fresh hash
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

    console.log('Admin user updated successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updateAdminPassword(); 