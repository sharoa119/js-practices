#!/usr/bin/env node

// 今日の日付
const today = new Date();
console.log(today);

// 今日の日付から年・月・日・曜日を取得
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();
const day = today.getDay();

// 月と年の表示
const blank = ' ';
const blanks = blank.repeat(6);
console.log(blanks + month +'月' + year);

//　日から土を表示
const week = ['日','月','火','水','木','金','土'];
const displayweek = week.join(' ');
console.log(displayweek);
