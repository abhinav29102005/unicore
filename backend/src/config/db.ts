import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

export const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

export interface QueryResult {
  rows: any[];
  rowCount: number;
}

// Wrapper to match pg API for seamless interaction with LibSQL / Turso
export const pool = {
  query: async (sql: string, params: any[] = []): Promise<QueryResult> => {
    // Replace Postgres $1, $2 with LibSQL ?1, ?2
    const sqliteSql = sql.replace(/\$(\d+)/g, '?$1');
    
    if (sqliteSql === 'BEGIN' || sqliteSql === 'COMMIT' || sqliteSql === 'ROLLBACK') {
      return { rows: [], rowCount: 0 };
    }
    
    const result = await client.execute({ sql: sqliteSql, args: params });
    
    return {
      rows: result.rows as any[],
      rowCount: result.rows.length,
    };
  },
  connect: async () => {
    return {
      query: async (sql: string, params: any[] = []): Promise<QueryResult> => {
        const sqliteSql = sql.replace(/\$(\d+)/g, '?$1');
        
        if (sqliteSql === 'BEGIN' || sqliteSql === 'COMMIT' || sqliteSql === 'ROLLBACK') {
          return { rows: [], rowCount: 0 };
        }
        
        const result = await client.execute({ sql: sqliteSql, args: params });
  
        return {
          rows: result.rows as any[],
          rowCount: result.rows.length,
        };
      },
      release: () => {},
    };
  },
};

export default pool;
