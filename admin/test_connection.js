const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Host: 198.38.90.50');
  console.log('Port: 3306');
  console.log('Database: bolalooc_mazdoor');
  console.log('User: bolalooc_maz123');
  console.log('Password: EsbER0JeytIXlp40');
  console.log('---');

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
    console.log('Attempting to connect...');
    const [result] = await pool.query('SELECT 1 as test');
    console.log('✅ Connection successful!');
    console.log('Test query result:', result);
    
    // Test if the database exists
    const [databases] = await pool.query('SHOW DATABASES');
    console.log('Available databases:', databases.map(db => db.Database));
    
    // Test if the users table exists
    try {
      const [tables] = await pool.query('SHOW TABLES');
      console.log('Tables in database:', tables);
      
      if (tables.length > 0) {
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        console.log('Users in database:', users[0].count);
      }
    } catch (tableError) {
      console.log('No tables found or users table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error number:', error.errno);
    
    if (error.code === 'ETIMEDOUT') {
      console.error('\n🔍 Troubleshooting steps for ETIMEDOUT:');
      console.error('1. Check if the database server is running');
      console.error('2. Verify the IP address 198.38.90.50 is correct');
      console.error('3. Check if port 3306 is open and accessible');
      console.error('4. Verify firewall settings allow connections');
      console.error('5. Test network connectivity: ping 198.38.90.50');
      console.error('6. Check if the database server allows remote connections');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n🔍 Troubleshooting steps for ECONNREFUSED:');
      console.error('1. Database server is not running');
      console.error('2. Wrong port number');
      console.error('3. Firewall blocking the connection');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔍 Troubleshooting steps for ER_ACCESS_DENIED_ERROR:');
      console.error('1. Wrong username or password');
      console.error('2. User does not have access to the database');
      console.error('3. User is not allowed to connect from this IP');
    }
  } finally {
    await pool.end();
  }
}

testConnection(); 