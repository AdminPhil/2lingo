import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });
config({ path: ".env" });

const targetUrl = (process.env.DATABASE_URL_V2 || "").trim().replace(/^["']|["']$/g, "");
if (!targetUrl) {
  throw new Error(
    "Missing DATABASE_URL_V2! Create an isolated Neon `v2-dev` branch and set DATABASE_URL_V2 in .env.local before pushing v2 schema."
  );
}

export default {
  schema: "./db/schema.v2.ts",
  out: "./drizzle-v2",
  driver: "pg",
  dbCredentials: {
    connectionString: targetUrl,
  },
} satisfies Config;
