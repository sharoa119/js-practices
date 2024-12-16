import { MemoStorage } from "./memo_storage.js";

export class MemoManager {
  constructor() {
    this.storage = new MemoStorage();
  }

  async listMemos() {
    const memos = await this.storage.load();
    return memos;
  }

  async addMemo(content) {
    if (!content || content.trim().length === 0) {
      console.error("Memo content cannot be empty.");
      return;
    }
    const newMemo = { content };
    const memos = await this.storage.load();
    this.storage.save([...memos, newMemo]);
  }

  async deleteMemo(index) {
    const memos = await this.storage.load();
    if (memos[index]) {
      memos.splice(index, 1);
      this.storage.save(memos);
    }
  }
}
