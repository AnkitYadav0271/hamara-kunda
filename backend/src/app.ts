import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { pool } from "./config/db.ts";

const app = express();

async function test() {
  const result = await pool.query(`SELECT NOW()`);
  console.log(result.rows);
}

test();