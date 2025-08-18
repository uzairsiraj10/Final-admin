const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin@123';
  
  console.log('Generating bcrypt hash for password:', password);
  console.log('---');
  
  // Generate the hash
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);
  
  // Verify the hash works
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash verification:', isValid);
  
  console.log('---');
  console.log('SQL INSERT statement:');
  console.log(`INSERT INTO users (email, password_hash, name, role) VALUES ('admin@example.com', '${hash}', 'Admin User', 'admin');`);
  
  console.log('---');
  console.log('Login credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: Admin@123');
}

generateHash().catch(console.error); 