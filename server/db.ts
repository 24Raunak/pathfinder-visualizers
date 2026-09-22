import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const databasePath = path.join(process.cwd(), "server", "mazes.db");

const db = new Database(databasePath);

const schemaPath = path.join(
  process.cwd(),
  "server",
  "schema.sql",
);

const schema = fs.readFileSync(schemaPath, "utf-8");

db.exec(schema);

export default db;