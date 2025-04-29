import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function main() {
  console.log("Pushing schema to database...");
  
  try {
    // Create the schema in the database
    await db.query(`
      CREATE SCHEMA IF NOT EXISTS public;
    `);
    
    // Create tables using our schema
    await db.query(`
      ${schema.users.toSql()}
    `);
    await db.query(`
      ${schema.reports.toSql()}
    `);
    
    console.log("Schema pushed successfully!");
  } catch (error) {
    console.error("Error pushing schema:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();