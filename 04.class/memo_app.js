import inquirer from "inquirer";
import readline from "readline"; // readlineモジュールをインポート
import { MemoManager } from "./memo_manager.js"; // メモ管理ロジックをインポート

export class MemoApp {
  constructor() {
    this.manager = new MemoManager(); // MemoManagerインスタンスを初期化
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start() {
    const args = process.argv.slice(2); // コマンドライン引数を取得

    if (args.includes("-l")) {
      this.listMemos();
    } else if (args.includes("-r")) {
      await this.viewMemo();
    } else if (args.includes("-d")) {
      await this.deleteMemo();
    } else if (args.length === 0) {
      await this.askForMemoContent(); // 標準入力を受け付けてメモを追加
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
        this.manager.addMemo(content.trim()); // 改行を含むメモを保存
        console.log("Memo added.");
      } else {
        content += line + "\n"; // 改行を追加
      }
    });
  }

  getMemos() {
    return this.manager.listMemos(); // MemoManager からメモ一覧を取得
  }

  listMemos() {
    const memos = this.getMemos();
    // console.log("Debug: memos =", memos); // デバッグ用
    if (memos.length === 0) {
      console.log("No memos available.");
      process.exit(); // 終了
    }
    // メモを一覧表示
    memos.forEach((memo, index) => {
      console.log(`${index + 1}: ${memo.content.split("\n")[0]}`); // 最初の行を表示
    });

    process.exit(); // 表示後に終了
  }

  async viewMemo() {
    const memos = this.getMemos();
    const { selectedMemo } = await inquirer.prompt([
      // 2. プロンプトで選択
      {
        type: "list",
        name: "selectedMemo",
        message: "Choose a note you want to see:",
        choices: memos.map((memo, index) => ({
          // 3. 選択肢を生成
          name: `${index + 1}: ${memo.content.split("\n")[0]}`, // メモの最初の行を表示,番号を追加
          value: memo, // メモそのものを渡す
        })),
      },
    ]);
    // const memoContent = this.manager.getMemo(selectedMemo);
    // console.log(`Full memo:\n${memoContent}`); // 4. 選択されたメモの全文を表示
    // 選択したメモを表示
    console.log("Full memo:");
    console.log(selectedMemo.content);
  }

  async deleteMemo() {
    const memos = this.getMemos();
    const { selectedMemo } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedMemo",
        message: "Choose a memo you want to delete:",
        choices: memos.map((memo, index) => ({
          name: `${index + 1}: ${memo.content.split("\n")[0]}`, // メモの最初の行を表示
          value: index, // 選択したメモのインデックスを返す
        })),
      },
    ]);
    this.manager.deleteMemo(selectedMemo); // インデックスを渡す
    console.log("Memo deleted.");
  }
}
