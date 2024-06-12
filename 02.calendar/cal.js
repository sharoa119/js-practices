#!/usr/bin/env node

import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const today = new Date();
const year = args.y ?? today.getFullYear();
const month = args.m ?? today.getMonth() + 1;

const firstDay = new Date(year, month - 1);
const lastDay = new Date(year, month, 0);

console.log(`${" ".repeat(6)}${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");
process.stdout.write("   ".repeat(firstDay.getDay()));

for (
  let currentDate = new Date(firstDay);
  currentDate <= lastDay;
  currentDate.setDate(currentDate.getDate() + 1)
) {
  process.stdout.write(currentDate.getDate().toString().padStart(2, " "));

  if (currentDate.getDay() === 6) {
    process.stdout.write("\n");
  } else if (currentDate < lastDay) {
    process.stdout.write(" ");
  }
}
console.log();
