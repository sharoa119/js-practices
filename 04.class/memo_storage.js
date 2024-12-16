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
      if (error.code === "ENOENT") {
        console.log(`${this.filename} not found. Creating a new file.`);
        await this.save([]);
        return [];
      } else {
        console.error("Error occurred while loading the file:", error);
        return [];
      }
    }
  }

  async save(data) {
    try {
      await fs.writeFile(this.filename, JSON.stringify(data));
    } catch (error) {
      console.error("Error occurred while saving the file:", error);
    }
  }
}
