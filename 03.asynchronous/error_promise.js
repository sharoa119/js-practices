#!/usr/bin/env node

import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

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
  .finally(() => {
    db.close();
  });
