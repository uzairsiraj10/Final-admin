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

// Always use the real DB implementation in production. The mock should only be used
// during local development when deliberately enabled. Ensure you have set DB_* env vars
// in your deployment (Vercel) so the connection can be established.
console.log('[DB] Using REAL database implementation (mock disabled)');

const impl = {
  query: simpleQuery,
  queryOne: simpleQueryOne,
  testConnection: simpleTestConnection,
  closePool: simpleCloseConnection,
};

export const query = <T = any>(sql: string, params: any[] = []) => impl.query<T>(sql, params);
export const queryOne = <T = any>(sql: string, params: any[] = []) => impl.queryOne<T>(sql, params);
export const testConnection = () => impl.testConnection();
export const closePool = () => impl.closePool();

export function getPoolStatus() {
  return { connectionType: 'single', connectionLimit: 1, status: 'Using single connection approach for limited hosting' };
}

export default { query, queryOne, testConnection, closePool, getPoolStatus };