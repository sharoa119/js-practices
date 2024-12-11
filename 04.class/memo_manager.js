import { MemoStorage } from "./memo_storage";

// メモの 作成、編集、削除、取得 を管理
export class MemoManager {
  constructor() {
    this.storage = new MemoStorage();
    this.memos = this.storage.load() || [];
  }

  // メモの一覧表示（最初の行だけ）
  listMemos() {
    return this.memos.map((memo) => memo.content.split("\n")[0]);
  }

  // メモを追加（標準入力で内容を受け取る）
  addMemo(content) {
    const newMemo = { content };
    this.memos.push(newMemo);
    this.storage.save(this.memos);
  }

  // メモを参照（全文表示）
  getMemo(index) {
    return this.memos[index] ? this.memos[index].content : null;
  }

  // メモを削除（選択したメモを削除）
  deleteMemo(index) {
    if (this.memos[index]) {
      this.memos.splice(index, 1);
      this.storage.save(this.memos);
    }
  }
}
