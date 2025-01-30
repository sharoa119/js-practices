import inquirer from "inquirer";
import readline from "readline";
import { MemoManager } from "./memo_manager.js";

export class MemoApp {
  #manager;

  constructor() {
    this.#manager = new MemoManager();
    process.on("SIGINT", () => {
      console.log("\nOperation cancelled. Exiting...");
      process.exit(1);
    });
  }

  async start() {
    const args = process.argv.slice(2);

    if (args.length > 1) {
      return this.#exitWithError(
        "Error: Only one option is allowed at a time.\nUsage: memo.js -l | -r | -d",
      );
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
      this.#exitWithError(error.message || "Unexpected error");
    }
  }

  #exitWithError(message) {
    console.error(message);
    process.exit(1);
  }

  async #listMemos() {
    const memos = await this.#manager.listMemos();
    if (memos.length === 0) {
      console.log("No memos available.");
      return;
    }

    memos.forEach((memo, index) => {
      console.log(`${index + 1}: ${memo.content.split("\n")[0]}`);
    });
  }

  async #viewMemo() {
    const memos = await this.#manager.listMemos();
    if (memos.length === 0) {
      console.log("No memos available to view.");
      return;
    }

    try {
      const response = await inquirer.prompt([
        {
          type: "list",
          name: "selectedMemo",
          message: "Choose a memo you want to see:",
          choices: memos.map((memo) => ({
            name: memo.content.split("\n")[0],
            value: memo,
          })),
        },
      ]);
      console.log(response.selectedMemo.content);
    } catch (error) {
      console.error("An error occurred during prompt:", error);
      throw new Error("Operation cancelled while selecting a memo.");
    }
  }

  async #deleteMemo() {
    const memos = await this.#manager.listMemos();
    if (memos.length === 0) {
      console.log("No memos available to delete.");
      return;
    }

    try {
      const response = await inquirer.prompt([
        {
          type: "list",
          name: "selectedMemo",
          message: "Choose a memo you want to delete:",
          choices: memos.map((memo) => ({
            name: memo.content.split("\n")[0],
            value: memo,
          })),
        },
      ]);
      await this.#manager.deleteMemo(response.selectedMemo.id);
      console.log("Deleted a memo.");
    } catch (error) {
      console.error("An error occurred during prompt:", error);
      throw new Error("Failed to delete memo.");
    }
  }

  async #addMemo() {
    if (process.stdin.isTTY) {
      console.log("Enter your memo (press Ctrl+D to finish):");
    }

    let content;

    try {
      content = await this.#readMemoContent();
    } catch (error) {
      throw new Error(`Failed to read memo content: ${error.message}`);
    }
    if (content.trim().length === 0) {
      console.log("Empty memo. Nothing was saved.");
      return;
    }

    try {
      await this.#manager.addMemo(content.trim());
      console.log("\nAdded a memo.");
    } catch (error) {
      throw new Error(`Failed to add memo: ${error.message}`);
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

      rl.on("close", () => {
        resolve(lines.join("\n"));
      });

      rl.on("error", (error) => {
        reject(error);
      });
    });
  }
}
