#!/usr/bin/env node

import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const yearArg = args.y;
const monthArg = args.m;

const today = new Date();
const year = yearArg ?? today.getFullYear();
const month = monthArg ?? today.getMonth() + 1;

const firstDay = new Date(year, month - 1);
const lastDay = new Date(year, month, 0);

console.log(`${" ".repeat(6)}${month}月 ${year}`);

const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
console.log(dayNames.join(" "));

process.stdout.write("   ".repeat(firstDay.getDay()));

let currentDate = firstDay;

while (currentDate <= lastDay) {
  const day = currentDate.getDate().toString().padStart(2, " ");
  const dayOfWeek = currentDate.getDay();

  process.stdout.write(day);

  if (dayOfWeek === 6) {
    process.stdout.write("\n");
  } else {
    process.stdout.write(" ");
  }

  currentDate.setDate(currentDate.getDate() + 1);
}
console.log();
