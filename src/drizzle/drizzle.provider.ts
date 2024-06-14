import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async () => {
      const connectionString = process.env.DB_URL;
      const pool = new Pool({
        connectionString,
      });

      return drizzle(pool, { schema });
    },
  },
];
