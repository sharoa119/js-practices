#!/usr/bin/env node

import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

const run = (sql, params = []) => {
  return new Promise((resolve) => {
    db.run(sql, params, function () {
      resolve(this.lastID);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve) => {
    db.all(sql, params, (_err, rows) => {
      resolve(rows);
    });
  });
};

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run("INSERT INTO books (title) VALUES ('cherry')"))
  .then((lastID) => {
    console.log(lastID);
    return run("INSERT INTO books (title) VALUES ('blueberry')");
  })
  .then((lastID) => {
    console.log(lastID);
    return all("SELECT * FROM books");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row);
    });
    return run("DROP TABLE books");
  })
  .then(() => {
    db.close();
  })
  .catch((err) => {
    console.error(err.message);
    db.close();
  });
