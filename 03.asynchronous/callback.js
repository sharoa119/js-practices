#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    insertData();
  },
);

function insertData() {
  db.run("INSERT INTO books(title) VALUES('cherry')", function () {
    console.log(this.lastID);

    db.run("INSERT INTO books(title) VALUES('blueberry')", function () {
      console.log(this.lastID);

      readData();
    });
  });
}

function readData() {
  db.each(
    "SELECT * FROM books",
    (err, row) => {
      console.log(row);
    },
    () => {
      closeDatabase();
    },
  );
}

function closeDatabase() {
  db.close();
}
