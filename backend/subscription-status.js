import pg from 'pg';

const { Pool } = pg;
let pool;

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for subscription status');
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return pool;
}

export async function getCurrentSubscription(userId) {
  const client = await getPool().connect();
  try {
    const result = await client.query(
      `select plan, status, starts_at, expires_at
       from public.subscriptions
       where user_id=$1 and status='active' and expires_at > now()
       order by expires_at desc
       limit 1`,
      [userId]
    );

    if (!result.rowCount) {
      return { active: false, plan: 'free', status: 'free', startsAt: null, expiresAt: null };
    }

    const row = result.rows[0];
    return {
      active: true,
      plan: row.plan,
      status: row.status,
      startsAt: row.starts_at,
      expiresAt: row.expires_at
    };
  } finally {
    client.release();
  }
}
