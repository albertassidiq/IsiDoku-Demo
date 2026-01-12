import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Sanitize connection string by removing surrounding quotes if present (common Vercel issue)
const rawConnectionString = process.env.DATABASE_URL!;
const connectionString = rawConnectionString.startsWith('"') && rawConnectionString.endsWith('"')
    ? rawConnectionString.slice(1, -1)
    : rawConnectionString;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
