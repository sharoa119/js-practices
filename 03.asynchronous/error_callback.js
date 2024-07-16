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

    db.run(
      "INSERT INTO non_existing_table(title) VALUES('blueberry')",
      function (err) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(this.lastID);

        readData();
      },
    );
  });
}

function readData() {
  db.each(
    "SELECT * FROM non_existing_table",
    (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
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
