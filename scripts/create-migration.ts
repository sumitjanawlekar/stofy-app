import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const rawName = process.argv[2];

if (!rawName) {
  console.error("Usage: npm run db:create-migration <migration_name>");
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const sanitizedName = rawName
  .toLowerCase()
  .replace(/[\s-]+/g, "_");

const migrationsDir = join(process.cwd(), "db", "migrations");
mkdirSync(migrationsDir, { recursive: true });

const fileName = `${timestamp}_${sanitizedName}.sql`;
const filePath = join(migrationsDir, fileName);

writeFileSync(filePath, "", "utf8");

console.log(`Created migration file: db/migrations/${fileName}`);
