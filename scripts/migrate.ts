import "../db/load-env";

import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { pool } from "@/src/lib/db";

interface MigrationNameRow {
  name: string;
}

const MIGRATIONS_DIR = join(process.cwd(), "db", "migrations");

function listMigrationFiles(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));
}

async function migrate(): Promise<void> {
  const migrationFiles = listMigrationFiles();
  console.log(
    `[db:migrate] Found ${migrationFiles.length} migration file(s) in ${MIGRATIONS_DIR}`,
  );

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("[db:migrate] Transaction started.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const appliedResult = await client.query<MigrationNameRow>(
      `SELECT name FROM schema_migrations`,
    );
    const applied = new Set(appliedResult.rows.map((row) => row.name));

    let appliedCount = 0;

    for (const filename of migrationFiles) {
      if (applied.has(filename)) {
        console.log(`[db:migrate] Skipping already applied ${filename}`);
        continue;
      }

      const sql = readFileSync(join(MIGRATIONS_DIR, filename), "utf8");
      await client.query(sql);
      await client.query(`INSERT INTO schema_migrations (name) VALUES ($1)`, [
        filename,
      ]);

      console.log(`[db:migrate] Applied ${filename}`);
      appliedCount += 1;
    }

    await client.query("COMMIT");
    console.log(
      appliedCount === 0
        ? "[db:migrate] No new migrations to apply. Transaction committed."
        : `[db:migrate] Applied ${appliedCount} migration(s). Transaction committed.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[db:migrate] Transaction rolled back.");
    throw error;
  } finally {
    client.release();
    await pool.end();
    console.log("[db:migrate] Client released and pool closed.");
  }
}

migrate().catch((error: unknown) => {
  console.error("[db:migrate] Failed:", error);
  process.exitCode = 1;
});
