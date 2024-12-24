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
      throw new Error("Memo content cannot be empty.");
    }
    const newMemo = { content };
    const memos = await this.storage.load();
    this.storage.save([...memos, newMemo]);

    return true;
  }

  async deleteMemo(content) {
    const memos = await this.storage.load();
    if (memos[content]) {
      memos.splice(content, 1);
      this.storage.save(memos);
    }
  }
}
