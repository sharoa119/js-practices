#!/usr/bin/env node

import { run, all, close } from "./dbPromises.js";

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run("INSERT INTO non_existing_table (title) VALUES ('cherry')"))
  .catch((err) => {
    console.error(err.message);

    return all("SELECT * FROM non_existing_table");
  })
  .catch((err) => {
    console.error(err.message);

    return run("DROP TABLE books");
  })
  .then(() => close())
  .catch((err) => {
    console.error(err.message);
  });
