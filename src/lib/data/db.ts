import 'server-only';
import { Pool } from '@neondatabase/serverless';

// -----------------------------------------------------------------------
// Lazy pool initialisation
// -----------------------------------------------------------------------
// Uses the @neondatabase/serverless Pool, which works via WebSockets in
// Vercel serverless/edge environments.
// -----------------------------------------------------------------------

declare const global: typeof globalThis & { __dbPool?: Pool };

function getPool(): Pool {
  if (global.__dbPool) return global.__dbPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. ' +
      'On Vercel: connect a Neon database via the Vercel/Neon integration. ' +
      'Locally: add DATABASE_URL to .env.local.'
    );
  }

  const pool = new Pool({ connectionString });

  if (process.env.NODE_ENV !== 'production') {
    global.__dbPool = pool;
  }

  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}

export async function getClient() {
  return getPool().connect();
}
