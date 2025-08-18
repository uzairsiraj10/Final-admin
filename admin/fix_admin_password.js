const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixAdminPassword() {
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
    console.log('Connecting to database...');
    
    // Test the connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful!');

    // Generate the correct bcrypt hash for 'Admin@123'
    const password = 'Admin@123';
    const correctHash = await bcrypt.hash(password, 10);
    console.log('Generated correct hash for Admin@123:', correctHash);
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, correctHash);
    console.log('Hash verification:', isValid);

    // Update the admin user with the correct password hash
    const [result] = await pool.query(`
      UPDATE users 
      SET password_hash = ? 
      WHERE email = ?
    `, [correctHash, 'admin@example.com']);

    console.log('Update result:', result);
    
    if (result.affectedRows > 0) {
      console.log('✅ Admin password updated successfully!');
      
      // Verify the update
      const [users] = await pool.query('SELECT id, email, name, role, password_hash FROM users WHERE email = ?', ['admin@example.com']);
      console.log('Updated user:', users[0]);
      
      // Test the password verification
      const testPassword = 'Admin@123';
      const testHash = users[0].password_hash;
      const passwordMatch = await bcrypt.compare(testPassword, testHash);
      console.log('Password verification test:', passwordMatch);
      
    } else {
      console.log('❌ No user found to update');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  } finally {
    await pool.end();
  }
}

fixAdminPassword(); 