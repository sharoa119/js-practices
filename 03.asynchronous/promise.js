#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { run, all, close } from "./db_promise.js";

const db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (title) VALUES ('cherry')"))
  .then((result) => {
    console.log(result.lastID);

    return run(db, "INSERT INTO books (title) VALUES ('blueberry')");
  })
  .then((result) => {
    console.log(result.lastID);

    return all(db, "SELECT * FROM books");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row);
    });

    return run(db, "DROP TABLE books");
  })
  .then(() => close(db));
