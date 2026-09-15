import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env and add it.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

async function runFile(file) {
  const sql = readFileSync(resolve(root, "db", file), "utf8");
  const client = await pool.connect();
  try {
    console.log(`Applying ${file} ...`);
    await client.query(sql);
    console.log(`Done: ${file}`);
  } finally {
    client.release();
  }
}

const cmd = process.argv[2] ?? "migrate";

try {
  if (cmd === "migrate") {
    await runFile("schema.sql");
  } else if (cmd === "seed") {
    await runFile("seed.sql");
  } else if (cmd === "setup") {
    await runFile("schema.sql");
    await runFile("seed.sql");
  } else {
    throw new Error(`Unknown command: ${cmd} (expected migrate | seed | setup)`);
  }
} finally {
  await pool.end();
}