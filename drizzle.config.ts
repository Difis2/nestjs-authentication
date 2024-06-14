import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error('MAIN_DB_URL environment variable is not defined');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/drizzle/schema.ts',
  out: './drizzleMigrations',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
