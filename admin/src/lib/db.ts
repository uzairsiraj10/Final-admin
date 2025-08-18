// Import both real and mock database approaches
import { 
  query as simpleQuery, 
  queryOne as simpleQueryOne, 
  testConnection as simpleTestConnection,
  closeConnection as simpleCloseConnection 
} from './db-simple';

import { 
  query as mockQuery, 
  queryOne as mockQueryOne, 
  testConnection as mockTestConnection,
  closeConnection as mockCloseConnection 
} from './db-mock';

export type DbResult<T> = T extends Promise<infer U> ? U : never;

// Always use real database - improved connection handling
console.log('[DB] Using REAL database with optimized connection handling');

// Export the real database functions
export const query = simpleQuery;
export const queryOne = simpleQueryOne;
export const testConnection = simpleTestConnection;
export const closePool = simpleCloseConnection;

// Function to get connection status
export function getPoolStatus() {
  return {
    connectionType: 'single',
    connectionLimit: 1,
    status: 'Using single connection approach for limited hosting',
  };
}

export default { query, queryOne, testConnection, closePool, getPoolStatus }; 