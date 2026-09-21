import "server-only";
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

export const pool = DATABASE_URL
  ? new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    })
  : null;