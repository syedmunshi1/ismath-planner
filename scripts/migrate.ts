import { sql } from '@vercel/postgres';

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS schedule_overrides (
      date        DATE PRIMARY KEY,
      combo       SMALLINT NOT NULL CHECK (combo IN (1,2,3,4)),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS meal_history (
      id          SERIAL PRIMARY KEY,
      date        DATE NOT NULL,
      slot        TEXT NOT NULL,
      option_key  TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(date, slot, option_key)
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS meal_history_date_slot_idx
    ON meal_history (date, slot)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS send_log (
      id          SERIAL PRIMARY KEY,
      plan_date   DATE NOT NULL,
      sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status      TEXT NOT NULL CHECK (status IN ('success', 'failed')),
      error_msg   TEXT,
      UNIQUE(plan_date)
    )
  `;

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
