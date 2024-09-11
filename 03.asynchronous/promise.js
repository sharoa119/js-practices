#!/usr/bin/env node

import { run, all, close } from "./db_promise.js";

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run("INSERT INTO books (title) VALUES ('cherry')"))
  .then((result) => {
    console.log(result.lastID);

    return run("INSERT INTO books (title) VALUES ('blueberry')");
  })
  .then((result) => {
    console.log(result.lastID);

    return all("SELECT * FROM books");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row);
    });

    return run("DROP TABLE books");
  })
  .then(() => close());
