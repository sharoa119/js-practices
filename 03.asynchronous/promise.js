#!/usr/bin/env node

import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

export const all = (sql, params = []) => {
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

export const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

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
