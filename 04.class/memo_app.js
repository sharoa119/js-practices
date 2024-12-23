import inquirer from "inquirer";
import readline from "readline";
import { MemoManager } from "./memo_manager.js";

export class MemoApp {
  constructor() {
    this.manager = new MemoManager();
  }

  async start() {
    const args = process.argv.slice(2);

    if (args.length > 1) {
      console.log("Error: Only one option is allowed at a time.");
      console.log("Usage: memo.js -l | -r | -d");
      process.exit(1);
    }

    try {
      if (args.includes("-l")) {
        await this.#listMemos();
      } else if (args.includes("-r")) {
        await this.#viewMemo();
      } else if (args.includes("-d")) {
        await this.#deleteMemo();
      } else if (args.length === 0) {
        await this.#addMemo();
      } else {
        console.log("Usage: memo.js -l | -r | -d");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async #listMemos() {
    const memos = await this.manager.listMemos();
    if (memos.length === 0) {
      console.log("No memos available.");
      return;
    }
    memos.forEach((memo, index) => {
      console.log(`${index + 1}: ${memo.content.split("\n")[0]}`);
    });
  }

  async #viewMemo() {
    const memos = await this.manager.listMemos();
    if (memos.length === 0) {
      console.log("No memos available to view.");
      return;
    }

    const { selectedMemo } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedMemo",
        message: "Choose a note you want to see:",
        choices: memos.map((memo, index) => ({
          name: `${index + 1}: ${memo.content.split("\n")[0]}`,
          value: memo,
        })),
      },
    ]);
    console.log("Full memo:");
    console.log(selectedMemo.content);
  }

  async #deleteMemo() {
    const memos = await this.manager.listMemos();
    if (memos.length === 0) {
      console.log("No memos available to delete.");
      return;
    }

    const { selectedIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedIndex",
        message: "Choose a memo you want to delete:",
        choices: memos.map((memo, index) => ({
          name: `${index + 1}: ${memo.content.split("\n")[0]}`,
          value: index,
        })),
      },
    ]);
    this.manager.deleteMemo(selectedIndex);
    console.log("Memo deleted.");
  }

  async #addMemo() {
    console.log("Enter your memo (press Ctrl+D to finish):");

    const content = await this.#readMemoContent();
    if (content.trim().length === 0) {
      console.log("Empty memo. Nothing was saved.");
      return;
    }

    await this.manager.addMemo(content.trim());
    console.log("Added a memo.");
  }

  #readMemoContent() {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: null,
      });

      const lines = [];
      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => resolve(lines.join("\n")));
    });
  }
}
