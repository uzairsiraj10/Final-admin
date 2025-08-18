import mysql from "mysql2/promise";

// Single connection approach for extremely limited hosting
let connection: mysql.Connection | null = null;
let connectionPromise: Promise<mysql.Connection> | null = null;

const dbConfig = {
  host: process.env.DB_HOST || "198.38.90.50",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "bolalooc_mazdoor",
  user: process.env.DB_USER || "bolalooc_maz123",
  password: process.env.DB_PASSWORD || "EsbER0JeytIXlp40",
  // Only valid options for mysql2 single connections
  connectTimeout: 60000,
  timezone: '+00:00',
};

async function getConnection(): Promise<mysql.Connection> {
  // Always create a fresh connection to avoid connection limit issues
  // This ensures we don't hold onto stale connections
  if (connection) {
    try {
      await connection.end();
    } catch (error) {
      // Ignore errors when closing old connection
    }
    connection = null;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  console.log('[DB] Creating new database connection...');
  connectionPromise = mysql.createConnection(dbConfig);
  
  try {
    connection = await connectionPromise;
    connectionPromise = null;
    
    console.log('[DB] Database connection established successfully');
    
    // Handle connection errors
    connection.on('error', (err: any) => {
      console.error('Database connection error:', err);
      connection = null;
      connectionPromise = null;
    });
    
    return connection;
  } catch (error) {
    console.error('[DB] Failed to create database connection:', error);
    connectionPromise = null;
    throw error;
  }
}

export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  let retries = 5; // More retries
  let delay = 1000; // Start with shorter delay
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    let conn: mysql.Connection | null = null;
    try {
      conn = await getConnection();
      
      // Execute query with timeout
      const [results] = await Promise.race([
        conn.query(sql, params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout after 30 seconds')), 30000)
        )
      ]) as any;
      
      // Close connection immediately after successful query
      await conn.end();
      connection = null;
      
      return results as T[];
    } catch (error: any) {
      // Clean up connection on error
      if (conn) {
        try {
          await conn.end();
        } catch (closeError) {
          // Ignore close errors
        }
      }
      connection = null;
      connectionPromise = null;
      
      console.error(`Database query error (attempt ${attempt}/${retries}):`, {
        error: error.message,
        code: error.code,
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
      });
      
      if (attempt === retries) {
        if (error.code === 'ER_TOO_MANY_USER_CONNECTIONS') {
          throw new Error('Database connection limit reached. Your hosting provider has very strict connection limits. Please try again in a few moments or contact your hosting provider to increase the connection limit.');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      
      // Progressive delay with some randomness to avoid thundering herd
      const randomDelay = delay + Math.random() * 1000;
      console.log(`Retrying in ${randomDelay.toFixed(0)}ms...`);
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      delay *= 1.2; // Slower growth
    }
  }
  
  throw new Error('Max retries exceeded');
}

export async function queryOne<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT 1 as test');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

export async function closeConnection(): Promise<void> {
  if (connection) {
    try {
      await connection.end();
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error('Error closing database connection:', error);
    } finally {
      connection = null;
      connectionPromise = null;
    }
  }
}
