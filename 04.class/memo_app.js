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
    let memos;

    try {
      memos = await this.#manager.listMemos();
    } catch (error) {
      this.#exitProgram(1, `Failed to retrieve memos: ${error.message}`);
    }
    if (memos.length === 0) {
      this.#exitProgram(0, "No memos available.");
    }

    memos.forEach((memo, index) => {
      console.log(`${index + 1}: ${memo.content.split("\n")[0]}`);
    });
  }

  async #viewMemo() {
    let memos;

    try {
      memos = await this.#manager.listMemos();
    } catch (error) {
      this.#exitProgram(1, `Failed to retrieve memos: ${error.message}`);
    }
    if (memos.length === 0) {
      this.#exitProgram(1, "No memos available to view.");
    }

    let selectedMemo;

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
      selectedMemo = response.selectedMemo;
    } catch (error) {
      if (error?.message?.includes("User force closed the prompt")) {
        this.#exitProgram(1, "\nOperation cancelled by user.");
      }
      console.error("Failed to process input:", error?.message || error);
      return;
    }
    console.log(selectedMemo.content);
  }

  async #deleteMemo() {
    let memos;

    try {
      memos = await this.#manager.listMemos();
    } catch (error) {
      this.#exitProgram(1, `Failed to retrieve memos: ${error.message}`);
    }
    if (memos.length === 0) {
      this.#exitProgram(1, "No memos available to delete.");
    }

    let selectedMemoId;

    try {
      const response = await inquirer.prompt([
        {
          type: "list",
          name: "selectedMemoId",
          message: "Choose a memo you want to delete:",
          choices: memos.map((memo) => ({
            name: memo.content.split("\n")[0],
            value: memo.id,
          })),
        },
      ]);
      selectedMemoId = response.selectedMemoId;
    } catch (error) {
      if (error.message.includes("User force closed the prompt")) {
        this.#exitProgram(1, "\nOperation cancelled by user.");
      }
      console.error("Failed to process input:", error.message);
      return;
    }

    try {
      await this.#manager.deleteMemo(selectedMemoId);
    } catch (error) {
      this.#exitProgram(1, `Failed to delete memo: ${error.message}`);
    }

    console.log("Deleted a memo.");
  }

  async #addMemo() {
    if (process.stdin.isTTY) {
      console.log("Enter your memo (press Ctrl+D to finish):");
    }

    let content;

    try {
      content = await this.#readMemoContent();
    } catch (error) {
      this.#exitProgram(1, `Failed to read memo content: ${error.message}`);
    }
    if (content.trim().length === 0) {
      this.#exitProgram(0, "Empty memo. Nothing was saved.");
    }

    try {
      await this.#manager.addMemo(content.trim());
      this.#exitProgram(0, "\nAdded a memo.");
    } catch (error) {
      this.#exitProgram(1, `Failed to add memo: ${error.message}`);
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

  #exitProgram(code, message = null) {
    if (message) {
      if (code === 0) {
        console.log(message);
      } else {
        console.error(message);
      }
    }
    process.exit(code);
  }
}
