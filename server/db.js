// MySQL connection + automatic table creation.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const here = path.dirname(fileURLToPath(import.meta.url));

const base = () => ({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

export const DB_NAME = process.env.DB_NAME || 'campspace';
let pool = null;

// Creates the database + tables if they don't exist yet, then opens the pool.
export async function initDb() {
  const admin = await mysql.createConnection({ ...base(), multipleStatements: true });
  const schema = fs
    .readFileSync(path.join(here, 'sql', 'schema.sql'), 'utf8')
    .replaceAll('campspace', DB_NAME.replace(/[^\w]/g, ''));
  await admin.query(schema);
  await admin.end();

  pool = mysql.createPool({
    ...base(),
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });
  await pool.query('SELECT 1');
  return pool;
}

export function db() {
  if (!pool) throw new Error('Database is not initialised yet');
  return pool;
}

// ---- Sandbox for the editor's MYSQL language -------------------------------
let sandboxPool = null;

export function sandboxConfigured() {
  return Boolean(process.env.SANDBOX_DB_USER);
}

export function getSandboxPool() {
  if (!sandboxPool) {
    sandboxPool = mysql.createPool({
      ...base(),
      user: process.env.SANDBOX_DB_USER,
      password: process.env.SANDBOX_DB_PASSWORD || '',
      multipleStatements: true,
      waitForConnections: true,
      connectionLimit: 4,
    });
  }
  return sandboxPool;
}

// One private scratch database per owner, e.g. campspace_sb_3f2a9c01b7d4
export function sandboxDbName(owner) {
  const hash = crypto.createHash('sha1').update(String(owner)).digest('hex').slice(0, 12);
  return `campspace_sb_${hash}`;
}
