import inquirer from "inquirer";
import readline from "readline";
import { MemoManager } from "./memo_manager.js";

export class MemoApp {
  constructor() {
    this.manager = new MemoManager();
    process.on("SIGINT", () => {
      console.log("\nOperation cancelled. Exiting...");
      process.exit(1);
    });
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
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async #listMemos() {
    try {
      const memos = await this.manager.listMemos();
      if (memos.length === 0) {
        console.log("No memos available.");
        return;
      }
      memos.forEach((memo, index) => {
        console.log(`${index + 1}: ${memo.content.split("\n")[0]}`);
      });
    } catch (error) {
      console.error("Failed to list memos:", error.message);
    }
  }

  async #viewMemo() {
    try {
      const memos = await this.manager.listMemos();
      if (memos.length === 0) {
        console.log("No memos available to view.");
        return;
      }

      const { selectedMemo } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedMemo",
          message: "Choose a memo you want to see:",
          choices: memos.map((memo, index) => ({
            name: `${index + 1}: ${memo.content.split("\n")[0]}`,
            value: memo,
          })),
        },
      ]);

      console.log("Full memo:");
      console.log(selectedMemo.content);
    } catch (error) {
      if (error.message.includes("User force closed the prompt")) {
        console.log("\nOperation cancelled. Exiting...");
        process.exit(0);
      }
      console.error("Failed to view memo:", error.message);
    }
  }

  async #deleteMemo() {
    try {
      const memos = await this.manager.listMemos();
      if (memos.length === 0) {
        console.log("No memos available to delete.");
        return;
      }

      const { selectedMemo } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedMemo",
          message: "Choose a memo you want to delete:",
          choices: memos.map((memo, index) => ({
            name: `${index + 1}: ${memo.content.split("\n")[0]}`, // インデックス付きに変更
            value: memo.content,
          })),
        },
      ]);

      await this.manager.deleteMemo(selectedMemo);
      console.log("Deleted a memo.");
    } catch (error) {
      if (error.message.includes("User force closed the prompt")) {
        console.log("\nOperation cancelled. Exiting...");
        process.exit(0);
      }
      console.error("Failed to delete memo:", error.message);
    }
  }

  async #addMemo() {
    console.log("Enter your memo (press Ctrl+D to finish):");

    try {
      const content = await this.#readMemoContent();
      if (content.trim().length === 0) {
        console.log("Empty memo. Nothing was saved.");
        return;
      }

      await this.manager.addMemo(content.trim());
      console.log("Added a memo.");
    } catch (error) {
      console.error("Failed to add memo:", error.message);
    }
  }

  #readMemoContent() {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
      });

      const lines = [];
      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => resolve(lines.join("\n")));

      rl.on("error", (error) => {
        reject(error);
      });
    });
  }
}
