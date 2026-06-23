import dotenv from "dotenv";
await dotenv.config();

console.log("current Dir", process.cwd());
import { Pool } from "pg";

console.log("dotenv :", process.env.DATABASE_URL);
console.log("HOST CHECK:", new URL(process.env.DATABASE_URL!).hostname);
export const pool = new Pool({
  connectionString:process.env.DATABASE_URL
});
