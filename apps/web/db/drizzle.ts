import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Sanitize connection string by removing surrounding quotes if present (common Vercel issue)
// Fallback to empty string to prevent build crashes when DATABASE_URL is not set
const rawConnectionString = process.env.DATABASE_URL || "";
const connectionString = rawConnectionString.startsWith('"') && rawConnectionString.endsWith('"')
    ? rawConnectionString.slice(1, -1)
    : rawConnectionString;

// Disable prefetch as it is not supported for "Transaction" pool mode
// Using a dummy connection string if empty to avoid immediate crash, but generic error will occur if used
export const client = postgres(connectionString || "postgres://user:pass@localhost:5432/db", { prepare: false });
export const db = drizzle(client, { schema });
