const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'admin123';
  const storedHash = '$2b$10$TDzAW/MItslr89cQGTiU8evgeHn6qJGdz5Fxug14O4rh8gtDaOjzG';
  
  console.log('Testing password verification:');
  console.log('Password:', password);
  console.log('Stored hash:', storedHash);
  
  // Generate a new hash
  const newHash = await bcrypt.hash(password, 10);
  console.log('Newly generated hash:', newHash);
  
  // Verify with stored hash
  const isValidStored = await bcrypt.compare(password, storedHash);
  console.log('Verification with stored hash:', isValidStored);
  
  // Verify with new hash (should always work)
  const isValidNew = await bcrypt.compare(password, newHash);
  console.log('Verification with new hash:', isValidNew);
  
  // Generate a few more hashes to compare
  console.log('\nGenerating multiple hashes for the same password:');
  for (let i = 0; i < 3; i++) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Hash ${i + 1}:`, hash);
    const isValid = await bcrypt.compare(password, hash);
    console.log(`Verification ${i + 1}:`, isValid);
  }
}

testPassword().catch(console.error); 