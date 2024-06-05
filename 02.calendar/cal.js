#!/usr/bin/env node

import minimist from "minimist";

const { y, m } = minimist(process.argv.slice(2));

const today = new Date();
const year = y || today.getFullYear();
const month = m || today.getMonth() + 1;

const firstDay = new Date(year, month - 1);
const lastDay = new Date(year, month, 0);

console.log(" ".repeat(6) + month + "月" + " " + year);

const week = ["日", "月", "火", "水", "木", "金", "土"];
console.log(week.join(" "));

const firstDayOfWeek = firstDay.getDay();

for (let space = 0; space < firstDayOfWeek; space++) {
  process.stdout.write("   ");
}

const end = lastDay.getDate().toLocaleString();

for (let days = 1; days <= end; days++) {
  const date = new Date(year, month - 1, days);
  const dayOfWeek = date.getDay();

  if (days < 10) {
    process.stdout.write(" ");
  }
  process.stdout.write(days.toString());

  if (dayOfWeek === 6) {
    process.stdout.write("\n");
  } else {
    process.stdout.write(" ");
  }
}
console.log();
