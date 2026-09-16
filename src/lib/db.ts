import {
  Pool,
  type QueryResult,
  type QueryResultRow,
} from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Missing DATABASE_URL environment variable. Set it in .env.local to connect to Neon.",
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __neonPool: Pool | undefined;
}

const pool =
  globalThis.__neonPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__neonPool = pool;
}

export { pool };

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("[db:query]", {
        text,
        duration: `${duration}ms`,
        rows: res.rowCount,
      });
    }
    return res;
  } catch (error) {
    console.error("[db:query:error]", { text, error });
    throw error;
  }
}
