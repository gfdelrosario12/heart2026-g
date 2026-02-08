import crypto from 'crypto';
import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });

/**
 * Export an async function, hashPassword, which takes a password string and 
 * returns a promise containing the salt and the computed hash.
 * @param password - password string
 * @return Promise<string>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
    .toString('hex');
  return `${salt}:${hash}`;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [salt, storedHash] = hash.split(':');
  const computedHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
    .toString('hex');
  return computedHash === storedHash;
}

export async function getUserByEmail(email: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, password_hash, name FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  const passwordHash = await hashPassword(password);
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getSessionUser(sessionId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT user_id FROM sessions WHERE id = $1 AND expires_at > NOW()',
      [sessionId]
    );
    if (!result.rows[0]) return null;

    const userResult = await client.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [result.rows[0].user_id]
    );
    return userResult.rows[0];
  } finally {
    client.release();
  }
}

export async function createSession(userId: string) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
      [sessionId, userId]
    );
    return sessionId;
  } finally {
    client.release();
  }
}

export async function deleteSession(sessionId: string) {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
  } finally {
    client.release();
  }
}

export async function logAuditEvent(
  userId: string,
  action: string,
  details: string
) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [userId, action, details]
    );
  } finally {
    client.release();
  }
}

export async function getAllUsers() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, name, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getAuditLogs() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, user_id, action, details, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 50'
    );
    return result.rows;
  } finally {
    client.release();
  }
}
