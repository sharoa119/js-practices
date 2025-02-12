import { v4 as uuidv4 } from "uuid";
import { MemoStorage } from "./memo_storage.js";

export class MemoManager {
  constructor() {
    this.storage = new MemoStorage();
  }

  async listMemos() {
    try {
      return await this.storage.load();
    } catch (error) {
      throw new Error(`Failed to load memos: ${error.message}`);
    }
  }

  async addMemo(content) {
    if (!content || content.trim().length === 0) {
      throw new Error("Memo content cannot be empty.");
    }
    const newMemo = { id: uuidv4(), content };
    const memos = await this.storage.load();
    await this.storage.save([...memos, newMemo]);
  }

  async deleteMemo(id) {
    const memos = await this.storage.load();

    const memoIndex = memos.findIndex((memo) => memo.id === id);
    if (memoIndex === -1) {
      throw new Error("Memo not found.");
    }

    memos.splice(memoIndex, 1);
    await this.storage.save(memos);
  }
}
