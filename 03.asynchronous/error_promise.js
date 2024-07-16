#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

createBooksTable()
  .then(() => insertData())
  .then(() => closeDatabase())
  .catch((err) => {
    console.error(err);
    closeDatabase();
  });

function createBooksTable() {
  const sql =
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)";
  return run(sql);
}

function insertData() {
  return run("INSERT INTO books(title) VALUES('cherry')")
    .then((lastID) => {
      console.log(lastID);
      return run("INSERT INTO non_existing_table(title) VALUES('blueberry')");
    })
    .then((lastID) => {
      console.log(lastID);
      return all("SELECT * FROM books");
    })
    .then((rows) => {
      rows.forEach((row) => console.log(row));
    });
}

function closeDatabase() {
  db.close();
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
