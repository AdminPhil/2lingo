import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const rawUrl = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "");
const connectionString =
  rawUrl || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const sql = neon(connectionString);
// @ts-ignore
const db = drizzle(sql, { schema });

export default db;
