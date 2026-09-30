import 'server-only';
import { getStore } from '@netlify/blobs';
import { Pool } from 'pg';

// -----------------------------------------------------------------------
// Lazy pool initialisation
// -----------------------------------------------------------------------
// Connection string resolution order — evaluated only on the FIRST real
// database query, never at module-load / build time.  This lets
// `next build` complete locally without a live database.
//
// Priority 1: getConnectionString() from @netlify/database
//   Reads NETLIFY_DB_URL, auto-injected by Netlify in production AND
//   when running locally via `netlify dev`.  This is the canonical path
//   for all Netlify environments — no manual configuration required.
//
// Priority 2: DATABASE_URL  (local dev fallback ONLY)
//   Set in .env.local when running `next dev` against a local Postgres
//   instance (i.e. without the Netlify CLI).
//   MUST NOT be set in Netlify environment settings — let Netlify Database
//   inject NETLIFY_DB_URL automatically.
// -----------------------------------------------------------------------

declare const global: typeof globalThis & { __dbPool?: Pool };

function getPool(): Pool {
  if (global.__dbPool) return global.__dbPool;

  let connectionString: string;

  // Priority 1 — @netlify/database reads NETLIFY_DB_URL
  try {
    // require() keeps this import out of the static analysis pass so Next.js
    // never evaluates getConnectionString() at build time.
    const { getConnectionString } = require('@netlify/database') as typeof import('@netlify/database');
    connectionString = getConnectionString();
  } catch {
    // Priority 2 — local DATABASE_URL fallback
    if (process.env.DATABASE_URL) {
      connectionString = process.env.DATABASE_URL;
    } else {
      throw new Error(
        'No database connection available. ' +
        'On Netlify: enable Netlify Database — it provides NETLIFY_DB_URL automatically. ' +
        'Locally without netlify dev: set DATABASE_URL in .env.local.'
      );
    }
  }

  const pool = new Pool({
    connectionString,
    // Disable SSL only for plain localhost/127.0.0.1 (local dev).
    ssl: /localhost|127\.0\.0\.1/.test(connectionString)
      ? false
      : { rejectUnauthorized: false },
  });

  // Cache the pool across hot-reloads in development only.
  if (process.env.NODE_ENV !== 'production') {
    global.__dbPool = pool;
  }

  return pool;
}

export function getBlobsStore() {
  return getStore('showroom-media');
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

/** Returns a pooled client for multi-statement transactions.
 *  Caller is responsible for calling client.release(). */
export async function getClient() {
  return getPool().connect();
}
