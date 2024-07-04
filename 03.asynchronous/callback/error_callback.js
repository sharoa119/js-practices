#!/usr/bin/env node

import sqlite3 from 'sqlite3';

// インメモリデータベースを作成
const db = new sqlite3.Database(':memory:');

// booksテーブルを作成
db.run("CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)", () => {
  insertData();
});

// データを挿入する関数
function insertData() {
  // データを挿入
  db.run("INSERT INTO books(title) VALUES('cherry')", function() {
    console.log(this.lastID);

    db.run("INSERT INTO non_existing_table(title) VALUES('blueberry')", function(err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(this.lastID);
      }

      // データを読み取る
      readData();
    });
  });
}
  // データを読み取る
function readData() {
  db.each("SELECT * FROM non_existing_table", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(row);
  });

  // データベース接続をクローズ
  db.close();
}
