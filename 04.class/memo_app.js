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
      this.#exitProgram(1, `An error occurred: ${error.message || error}`);
    }
  }

  async #listMemos() {
    const memos = await this.#manager.listMemos();

    if (memos.length === 0) {
      this.#exitProgram(0, "No memos available.");
    }
    memos.forEach((memo, index) => {
      console.log(`${index + 1}: ${memo.content.split("\n")[0]}`);
    });
  }

  async #viewMemo() {
    const memos = await this.#manager.listMemos();

    if (memos.length === 0) {
      this.#exitProgram(0, "No memos available to view.");
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
      this.#exitProgram(
        1,
        `Failed to process input: ${error?.message || error}`,
      );
    }
    console.log(selectedMemo.content);
  }

  async #deleteMemo() {
    const memos = await this.#manager.listMemos();

    if (memos.length === 0) {
      this.#exitProgram(0, "No memos available to delete.");
    }

    let selectedMemo;

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
      selectedMemo = response.selectedMemo;
    } catch (error) {
      if (error.message.includes("User force closed the prompt")) {
        this.#exitProgram(1, "\nOperation cancelled by user.");
      }
      this.#exitProgram(
        1,
        `Failed to process input: ${error?.message || error}`,
      );
    }

    try {
      await this.#manager.deleteMemo(selectedMemo.id);
      this.#exitProgram(0, "Deleted a memo.");
    } catch (error) {
      this.#exitProgram(1, `Failed to delete memo: ${error.message}`);
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
