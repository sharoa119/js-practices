import inquirer from "inquirer";
import readline from "readline";
import { MemoManager } from "./memo_manager.js";

export class MemoApp {
  constructor() {
    this.manager = new MemoManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start() {
    const args = process.argv.slice(2);

    if (args.includes("-l")) {
      this.listMemos();
    } else if (args.includes("-r")) {
      await this.viewMemo();
    } else if (args.includes("-d")) {
      await this.deleteMemo();
    } else if (args.length === 0) {
      await this.askForMemoContent();
    } else {
      console.log("Usage: memo.js -l | -r | -d");
    }
  }

  askForMemoContent() {
    console.log("Enter your memo (type 'EOF' on a new line to finish):");

    let content = "";
    this.rl.on("line", (line) => {
      if (line === "EOF") {
        this.rl.close();
        this.manager.addMemo(content.trim());
        console.log("Memo added.");
      } else {
        content += line + "\n";
      }
    });
  }

  listMemos() {
    const memos = this.manager.listMemos();
    if (memos.length === 0) {
      console.log("No memos available.");
      process.exit();
    }
    memos.forEach((memo, index) => {
      console.log(`${index + 1}: ${memo.content.split("\n")[0]}`);
    });

    process.exit();
  }

  async viewMemo() {
    const memos = this.manager.listMemos();
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

  async deleteMemo() {
    const memos = this.manager.listMemos();
    const { selectedMemo } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedMemo",
        message: "Choose a memo you want to delete:",
        choices: memos.map((memo, index) => ({
          name: `${index + 1}: ${memo.content.split("\n")[0]}`,
          value: index,
        })),
      },
    ]);
    this.manager.deleteMemo(selectedMemo);
    console.log("Memo deleted.");
  }
}
