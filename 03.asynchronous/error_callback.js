#!/usr/bin/env node

import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run(
      "INSERT INTO non_existing_table (title) VALUES ('cherry')",
      (err) => {
        console.error(err.message);

        db.all("SELECT * FROM non_existing_table", (err) => {
          console.error(err.message);

          db.run("DROP TABLE books", () => {
            db.close();
          });
        });
      },
    );
  },
);
