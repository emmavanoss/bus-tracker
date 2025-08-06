import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema.ts";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "path";

const adminDbUrl = process.env.ADMIN_DB_URL;

export type TestDbContext = {
  pool: Pool;
  db: NodePgDatabase<typeof schema>;
  testDbName: string;
};

export async function createTestDb(): Promise<TestDbContext> {
  const testDbName = generateTestDbName();
  const testDbUrl = `${process.env.TEST_DB_URL_PREFIX}${testDbName}`;

  const adminPool = new Pool({ connectionString: adminDbUrl });
  await adminPool.query(`CREATE DATABASE "${testDbName}"`);
  adminPool.end();

  const pool = new Pool({
    connectionString: testDbUrl,
    max: 10,
    idleTimeoutMillis: 30000,
  });

  const db = drizzle(pool, { schema, casing: "snake_case" });
  await migrate(db, { migrationsFolder: join(__dirname, "../src/db/drizzle") });

  return { pool, db, testDbName };
}

// e.g., test_db_r9m2tq7z
function generateTestDbName() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  const suffix = Array.from(arr, (byte) => chars[byte % chars.length]).join("");
  return `test_db_${suffix}`;
}

export async function destroyTestDb({ pool, testDbName }: TestDbContext) {
  await pool.end();

  const adminPool = new Pool({ connectionString: adminDbUrl });
  adminPool.query(
    `
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = $1 AND pid <> pg_backend_pid()
        `,
    [testDbName],
  );
  await adminPool.query(`DROP DATABASE IF EXISTS "${testDbName}"`);
  await adminPool.end();
}
