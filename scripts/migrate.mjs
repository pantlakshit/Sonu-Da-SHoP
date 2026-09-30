import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is required.');
    process.exit(1);
  }

  const sql = neon(dbUrl);
  const migrationsDir = path.join(__dirname, '../db/migrations');

  try {
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    console.log('Running migrations...');

    for (const file of sqlFiles) {
      console.log(`Applying ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const query = await fs.readFile(filePath, 'utf8');
      
      await sql(query);
      console.log(`✅ ${file} applied successfully.`);
    }

    console.log('🎉 All migrations applied!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
