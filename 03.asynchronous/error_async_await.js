#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { run, all, close } from "./db_promise.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

try {
  await run(db, "INSERT INTO non_existing_table (title) VALUES ('cherry')");
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    throw err;
  }
}

try {
  await all(db, "SELECT * FROM non_existing_table");
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    throw err;
  }
}

await run(db, "DROP TABLE books");

await close(db);
