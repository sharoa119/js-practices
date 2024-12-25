import { MemoStorage } from "./memo_storage.js";

export class MemoManager {
  constructor() {
    this.storage = new MemoStorage();
  }

  async listMemos() {
    try {
      return await this.storage.load();
    } catch (error) {
      throw new Error("Failed to load memos: " + error.message);
    }
  }

  async addMemo(content) {
    if (!content || content.trim().length === 0) {
      throw new Error("Memo content cannot be empty.");
    }
    const newMemo = { content };
    const memos = await this.storage.load();
    await this.storage.save([...memos, newMemo]);
  }

  async deleteMemo(content) {
    const memos = await this.storage.load();
    const updatedMemos = memos.filter((memo) => memo.content !== content);
    if (memos.length === updatedMemos.length) {
      throw new Error("Memo not found.");
    }
    await this.storage.save(updatedMemos);
  }
}
