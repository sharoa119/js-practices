#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { run, all, close } from "./db_promise.js";

const db = new sqlite3.Database(":memory:");

async function execute() {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    await run(db, "INSERT INTO non_existing_table (title) VALUES ('cherry')");
  } catch (err) {
    console.error(err.message);
  }

  try {
    await all(db, "SELECT * FROM non_existing_table");
  } catch (err) {
    console.error(err.message);
  } finally {
    await run(db, "DROP TABLE books");
    await close(db);
  }
}

execute();
