import { MemoStorage } from "./memo_storage.js";

// メモの 作成、編集、削除、取得 を管理
export class MemoManager {
  constructor() {
    this.storage = new MemoStorage();
    this.memos = this.storage.load() || [];
  }

  // メモの一覧表示（最初の行だけ）
  listMemos() {
    return this.memos; // 全てのメモをそのまま返す
  }

  // メモを追加（標準入力で内容を受け取る）
  addMemo(content) {
    if (!content || content.trim().length === 0) {
      console.error("Memo content cannot be empty.");
      return;
    }
    const newMemo = { content };
    this.memos.push(newMemo);
    this.storage.save(this.memos);
  }

  // メモを参照（全文表示）
  getMemo(content) {
    return this.memos.find((memo) => memo.content === content); // contentで検索
  }

  // メモを削除（選択したメモを削除）
  deleteMemo(index) {
    if (this.memos[index]) {
      this.memos.splice(index, 1);
      this.storage.save(this.memos);
    }
  }
}
