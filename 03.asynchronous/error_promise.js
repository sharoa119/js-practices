#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { run, all, close } from "./db_promise.js";

const db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    run(db, "INSERT INTO non_existing_table (title) VALUES ('cherry')"),
  )
  .catch((err) => {
    console.error(err.message);

    return all(db, "SELECT * FROM non_existing_table");
  })
  .catch((err) => {
    console.error(err.message);

    return run(db, "DROP TABLE books");
  })
  .then(() => close(db));
