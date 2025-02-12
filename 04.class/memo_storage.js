import { promises as fs } from "fs";

export class MemoStorage {
  constructor(filename = "memos.json") {
    this.filename = filename;
  }

  async load() {
    try {
      const data = await fs.readFile(this.filename, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error?.code === "ENOENT") {
        console.log(`${this.filename} not found. Creating a new file.`);
        await this.save([]);
        return [];
      } else {
        throw error;
      }
    }
  }

  async save(data) {
    await fs.writeFile(this.filename, JSON.stringify(data));
  }
}
