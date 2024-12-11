import fs from "fs";

export class MemoStorage {
  constructor(filename = "memos.json") {
    this.filename = filename;
  }

  load() {
    try {
      const data = fs.readFileSync(this.filename, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        // ファイルが存在しない場合
        console.log(`${this.filename} が見つかりません。新規作成します。`);
        this.save([]); // 空の配列をファイルに保存
        return []; // 空の配列を返す
      } else {
        console.error("ファイル読み込み時にエラーが発生しました:", error);
        return [];
      }
    }
  }

  save(data) {
    fs.writeFileSync(this.filename, JSON.stringify(data));
  }
}
