#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { run, all, close } from "./db_promise.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

const result1 = await run(db, "INSERT INTO books (title) VALUES ('cherry')");
console.log(result1.lastID);

const result2 = await run(db, "INSERT INTO books (title) VALUES ('blueberry')");
console.log(result2.lastID);

const rows = await all(db, "SELECT * FROM books");
rows.forEach((row) => {
  console.log(row);
});

await run(db, "DROP TABLE books");

await close(db);
