import { MemoStorage } from "./memo_storage.js";

export class MemoManager {
  constructor() {
    this.storage = new MemoStorage();
    this.memos = this.storage.load() || [];
  }

  listMemos() {
    return this.memos;
  }

  addMemo(content) {
    if (!content || content.trim().length === 0) {
      console.error("Memo content cannot be empty.");
      return;
    }
    const newMemo = { content };
    this.memos.push(newMemo);
    this.storage.save(this.memos);
  }

  getMemo(content) {
    return this.memos.find((memo) => memo.content === content);
  }

  deleteMemo(index) {
    if (this.memos[index]) {
      this.memos.splice(index, 1);
      this.storage.save(this.memos);
    }
  }
}
