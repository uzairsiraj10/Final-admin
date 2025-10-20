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

// Decide whether to use the real DB or the mock.
// Default to mock when DB_HOST is not configured (prevents build-time connection attempts on Vercel).
const useMock = !process.env.DB_HOST;

if (useMock) {
  console.warn('[DB] No DB_HOST configured — using mock database (build-safe)');
} else {
  console.log('[DB] Using REAL database');
}

const impl = useMock
  ? {
      query: mockQuery,
      queryOne: mockQueryOne,
      testConnection: mockTestConnection,
      closePool: mockCloseConnection,
    }
  : {
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
  return useMock
    ? { connectionType: 'mock', status: 'Using mock DB (no external connection)' }
    : { connectionType: 'single', connectionLimit: 1, status: 'Using single connection approach for limited hosting' };
}

export default { query, queryOne, testConnection, closePool, getPoolStatus };