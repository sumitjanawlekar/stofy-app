import {
  Pool,
  type QueryResult,
  type QueryResultRow,
} from "@neondatabase/serverless";

let poolInstance: Pool | null = null;

export function getPool(): Pool {
  if (!poolInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "Missing DATABASE_URL environment variable. Set it in .env.local to connect to Neon.",
      );
    }
    poolInstance = new Pool({ connectionString });
  }
  return poolInstance;
}

export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const p = getPool();
    const value = Reflect.get(p, prop, p) as unknown;
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(p)
      : value;
  },
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const p = getPool();
  const start = Date.now();
  try {
    const res = await p.query<T>(text, params);
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
