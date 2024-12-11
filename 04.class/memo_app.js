import inquirer from "inquirer";
import readline from "readline"; // readlineモジュールをインポート
import { MemoManager } from "./memo_manager"; // メモ管理ロジックをインポート

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
      this.askForMemoContent(); // 標準入力を受け付けてメモを追加
    } else {
      console.log("Usage: memo.js -l | -r | -d");
    }
  }
}
